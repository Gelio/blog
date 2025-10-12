import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import type { ReadAllArticlesIndexError } from "../../content-processing/indexes";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";

import {
  type IndexedArticleMetadataWithSerializedSummary,
  IndexedArticleCard,
} from "../ArticleCard";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { Layout } from "../Layout";
import styles from "./HomePage.module.css";

interface HomePageProps {
  allArticlesResult: either.Either<
    ReadAllArticlesIndexError,
    readonly IndexedArticleMetadataWithSerializedSummary[]
  >;
}

export const HomePage = ({ allArticlesResult }: HomePageProps) => {
  return (
    <Layout>
      <HeadDocumentTitle>Greg Rozdzialik</HeadDocumentTitle>
      <HeadMetaDescription>
        A list of the most recent articles published on Greg&apos;s blog.
      </HeadMetaDescription>

      <main className="responsive-container responsive-container-inline-padding page-content">
        <p>Hey, I&apos;m Greg, welcome to my blog!</p>
      </main>

      {pipe(
        allArticlesResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read articles metadata.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          (articles) => (
            <div
              className={`responsive-container responsive-container-inline-padding ${styles.cards}`}
            >
              {articles.map((article) => (
                <IndexedArticleCard metadata={article} key={article.slug} />
              ))}
              {/* TODO: add pagination */}
            </div>
          ),
        ),
      )}
    </Layout>
  );
};
