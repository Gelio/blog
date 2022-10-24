import { either, taskEither } from "fp-ts";
import { serialize } from "next-mdx-remote/serialize";
import { MDXProvider } from "@mdx-js/react";
import { pipe } from "fp-ts/function";
import type { GetStaticPaths, GetStaticProps, PageConfig } from "next";
import type { ParsedUrlQuery } from "querystring";
import {
  ArticleHeader,
  StyledArticleContainer,
  StyledArticleSection,
} from "../../components/ArticlePage";
import { Layout } from "../../components/Layout";
import {
  readSlugReverseMapping,
  ReadSlugReverseMappingError,
} from "../../content-processing/indexes";
import {
  FileReadError,
  safeReadFile,
} from "../../content-processing/indexes/utils";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../../components/ErrorAlert";
import type { IndexedArticleMetadata } from "../../content-processing/indexes/schema";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import stripMarkdown from "strip-markdown";
import { remark } from "remark";
import rehypeHighlight from "rehype-highlight";
import rehypeImageSize from "rehype-img-size";
import "highlight.js/styles/base16/gruvbox-dark-medium.css";
import { WithWrappedCodeBlock } from "../../components/WithWrappedCodeBlock";
import { baseMDXComponents } from "../../components/mdx";

interface SourceWithMetadata {
  mdxSource: MDXRemoteSerializeResult;
  articleMetadata: IndexedArticleMetadata;

  /**
   * Article summary with all Markdown syntax stripped.
   * Based on the original summary in `articleMetadata`.
   */
  rawArticleSummary: string;
}

interface ArticlePageProps {
  sourceWithMetadataResult: either.Either<
    | ReadSlugReverseMappingError
    | {
        type: "article-read-error";
        error: FileReadError;
      }
    | StripMarkdownError,
    SourceWithMetadata
  >;
}

const ArticlePage = ({ sourceWithMetadataResult }: ArticlePageProps) => {
  return (
    <Layout>
      <StyledArticleContainer>
        {pipe(
          sourceWithMetadataResult,
          either.match(
            (error) => (
              <ErrorAlertContainer>
                <HeadDocumentTitle>Article retrieval error</HeadDocumentTitle>
                <ErrorAlert>Could not get the post.</ErrorAlert>
                <DevOnlyErrorDetails error={error} />
              </ErrorAlertContainer>
            ),
            ({ articleMetadata, mdxSource, rawArticleSummary }) => (
              <>
                <HeadDocumentTitle>{articleMetadata.title}</HeadDocumentTitle>
                <HeadMetaDescription>{rawArticleSummary}</HeadMetaDescription>

                <ArticleHeader
                  title={articleMetadata.title}
                  readingTimeMin={articleMetadata.readingTimeMin}
                  createdDate={articleMetadata.date}
                  tagNames={articleMetadata.tags}
                />

                <StyledArticleSection>
                  <MDXProvider
                    components={{
                      ...baseMDXComponents,
                      WithWrappedCodeBlock,
                    }}
                  >
                    <MDXRemote {...mdxSource} />
                  </MDXProvider>
                </StyledArticleSection>
              </>
            )
          )
        )}
      </StyledArticleContainer>
    </Layout>
  );
};

export default ArticlePage;

interface ArticlePageQueryParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<ArticlePageQueryParams> = () => {
  return {
    // TODO: autogenerate the latest X blogposts and the most popular X blogposts
    paths: [],
    // NOTE: do not autogenerate all pages during build time.
    // Generate them on demand.
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  ArticlePageProps,
  ArticlePageQueryParams
> = async (context) => {
  if (!context.params) {
    throw new Error(
      "context.params is undefined even though getStaticPaths exists"
    );
  }
  const { slug } = context.params;

  const sourceWithMetadataResult = await pipe(
    readSlugReverseMapping,
    taskEither.chainEitherKW((slugReverseMapping) => {
      const articleWithMetadata = slugReverseMapping[slug];
      if (!articleWithMetadata) {
        return either.left({
          type: "slug-not-found",
          slug,
        } as const);
      }

      return either.right(articleWithMetadata);
    }),
    taskEither.bindTo("articleWithMetadata"),
    taskEither.bindW("mdxSource", ({ articleWithMetadata: { filePath } }) =>
      pipe(
        safeReadFile(filePath),
        taskEither.mapLeft(
          (error) =>
            ({
              type: "article-read-error",
              error,
            } as const)
        ),
        taskEither.chainTaskK(
          (source) => () =>
            serialize(source, {
              parseFrontmatter: true,
              mdxOptions: {
                rehypePlugins: [
                  rehypeHighlight,
                  [
                    // @ts-expect-error Mismatched types
                    rehypeImageSize,
                    { dir: "public" },
                  ],
                ],
              },
            })
        ),
        taskEither.map((mdxSource) => {
          // NOTE: delete frontmatter since it cannot be serialized by Next in SSR.
          // Frontmatter is already available via `articleMetadata`
          delete mdxSource["frontmatter"];
          return mdxSource;
        })
      )
    ),
    taskEither.bindW(
      "rawArticleSummary",
      ({
        articleWithMetadata: {
          metadata: { summary },
        },
      }) => stripMarkdownFromString(summary)
    ),
    taskEither.map(
      ({
        articleWithMetadata: { metadata },
        mdxSource,
        rawArticleSummary,
      }): SourceWithMetadata => ({
        articleMetadata: metadata,
        mdxSource,
        rawArticleSummary,
      })
    )
  )();

  if (either.isLeft(sourceWithMetadataResult)) {
    // NOTE: TypeScript cannot infer that the `slug-not-found` case is handled
    // separately. We must help it via this more lengthy syntax
    const error = sourceWithMetadataResult.left;
    if (error.type === "slug-not-found") {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        sourceWithMetadataResult: either.left(error),
      },
    };
  }

  return {
    props: {
      sourceWithMetadataResult,
    },
  };
};

interface StripMarkdownError {
  type: "strip-markdown-error";
  error: unknown;
}

const stripMarkdownFromString =
  (value: string): taskEither.TaskEither<StripMarkdownError, string> =>
  () =>
    new Promise((resolve) =>
      remark()
        .use(stripMarkdown)
        .process(value)
        .then((strippedMarkdown) =>
          resolve(either.right(strippedMarkdown.toString()))
        )
        .catch((error) =>
          resolve(
            either.left<StripMarkdownError>({
              type: "strip-markdown-error",
              error,
            })
          )
        )
    );

export const config: PageConfig = {
  /**
   * Globs pointing to files that are necessary during Incremental Static
   * Generation of content resources.
   *
   * Globs are reletive to the root of the repository.
   *
   * They are needed because otherwise Next will exclude these files from the runtime environment of ISG.
   *
   * @see https://nextjs.org/docs/advanced-features/output-file-tracing#caveats
   */
  unstable_includeFiles: [
    // NOTE: the `*.*` is mandatory so that minimatch returns only files (with an
    // extension) and not directories. Otherwise, Next logs an EISDIR when
    // processing matches.
    "content-indexes/**/*.*",
    "content/**/*.*",
    // NOTE: static content is inspected by rehype-img-size to determine image dimensions
    "public/static-content/**/*.*",
  ],
};
