import { either, taskEither } from "fp-ts";
import { serialize } from "next-mdx-remote/serialize";
import { MDXProvider } from "@mdx-js/react";
import { pipe } from "fp-ts/function";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import {
  ArticleHeader,
  StyledArticleContainer,
  StyledArticleParagraph,
  StyledArticleParagraphLink,
  StyledArticleSection,
  StyledArticleSectionHeading,
} from "../../components/ArticlePage";
import { Layout } from "../../components/Layout";
import {
  readSlugReverseMapping,
  ReadSlugReverseMappingError,
} from "../../content-processing/indexes";
import {
  ContentMetadata,
  FileReadError,
  safeReadFile,
} from "../../content-processing/indexes/utils";
import { MDXRemote } from "next-mdx-remote";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../../components/ErrorAlert";

interface SourceWithMetadata {
  mdxSource: any;
  contentMetadata: ContentMetadata;
}

interface ArticlePageProps {
  sourceWithMetadataResult: either.Either<
    | ReadSlugReverseMappingError
    | {
        type: "content-read-error";
        error: FileReadError;
      },
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
                <ErrorAlert>Could not get the post.</ErrorAlert>
                <DevOnlyErrorDetails error={error} />
              </ErrorAlertContainer>
            ),
            ({ contentMetadata, mdxSource }) => (
              <>
                <ArticleHeader
                  title={contentMetadata.title}
                  readingTimeMin={contentMetadata.readingTimeMin}
                  createdDate={contentMetadata.date}
                  tagNames={contentMetadata.tags}
                />

                <StyledArticleSection>
                  <MDXProvider
                    components={{
                      a: (props) =>
                        props.href ? (
                          <Link href={props.href} passHref>
                            <StyledArticleParagraphLink {...props} />
                          </Link>
                        ) : (
                          (() => {
                            throw new Error("Link does not have a href");
                          })()
                        ),
                      p: StyledArticleParagraph,
                      h2: StyledArticleSectionHeading,
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
      const contentWithMetadata = slugReverseMapping[slug];
      if (!contentWithMetadata) {
        return either.left({
          type: "slug-not-found",
          slug,
        } as const);
      }

      return either.right(contentWithMetadata);
    }),
    taskEither.bindTo("contentWithMetadata"),
    taskEither.bindW(
      "mdxSource",
      ({ contentWithMetadata: { contentFilePath } }) =>
        pipe(
          safeReadFile(contentFilePath),
          taskEither.mapLeft(
            (error) =>
              ({
                type: "content-read-error",
                error,
              } as const)
          ),
          taskEither.chainTaskK(
            (source) => () => serialize(source, { parseFrontmatter: true })
          ),
          taskEither.map((mdxSource) => {
            // NOTE: delete frontmatter since it cannot be serialized by Next in SSR.
            // Frontmatter is already available via `contentMetadata`
            delete mdxSource["frontmatter"];
            return mdxSource;
          })
        )
    ),
    taskEither.map(
      ({
        contentWithMetadata: { contentMetadata },
        mdxSource,
      }): SourceWithMetadata => ({
        contentMetadata,
        mdxSource,
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
