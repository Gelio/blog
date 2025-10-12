import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import type { ReadTopicIndexError } from "../../content-processing/indexes";
import {
  type IndexedArticleMetadataWithSerializedSummary,
  IndexedArticleCard,
} from "../ArticleCard";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import { Layout } from "../Layout";
import styles from "./TopicPage.module.css";

interface TopicPageProps {
  topicName: string;
  articlesResult: either.Either<
    ReadTopicIndexError,
    {
      articles: readonly IndexedArticleMetadataWithSerializedSummary[];
      description: string;
    }
  >;
}

export const TopicPage = ({ topicName, articlesResult }: TopicPageProps) => {
  return (
    <Layout>
      <HeadDocumentTitle>{topicName} articles</HeadDocumentTitle>

      <main className="responsive-container responsive-container-inline-padding page-content">
        <h1 className={`heading ${styles["page-title"]}`}>
          Articles about {topicName}
        </h1>

        <p>
          {pipe(
            articlesResult,
            either.match(
              // NOTE: error is shown below
              () => null,
              ({ description }) => description,
            ),
          )}
        </p>
      </main>

      {pipe(
        articlesResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <HeadMetaDescription>
                Articles about {topicName}.
              </HeadMetaDescription>
              <ErrorAlert>Could not read topic index.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          ({ articles, description }) => (
            <>
              <HeadMetaDescription>
                Articles about {topicName}. {description}
              </HeadMetaDescription>

              <div
                className={`responsive-container responsive-container-inline-padding ${styles["article-cards"]}`}
              >
                {articles.map((article) => (
                  <IndexedArticleCard metadata={article} key={article.slug} />
                ))}
              </div>

              {/* TODO: pagination */}
            </>
          ),
        ),
      )}
    </Layout>
  );
};
