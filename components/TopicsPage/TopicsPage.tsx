import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import Link from "next/link";
import type { readTopicsSummaryIndex } from "../../content-processing/indexes/per-topic";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import { Layout } from "../Layout";
import { getTopicPagePath } from "../TopicPage";
import styles from "./TopicsPage.module.css";

interface TopicsPageProps {
  topicsResult: Awaited<ReturnType<typeof readTopicsSummaryIndex>>;
}

export const TopicsPage = ({ topicsResult }: TopicsPageProps) => {
  return (
    <Layout>
      <HeadDocumentTitle>Topics</HeadDocumentTitle>
      <HeadMetaDescription>
        A list of topics that I write about on my blog.
      </HeadMetaDescription>

      <div className="responsive-container responsive-container-inline-padding page-content">
        <h1 className="heading">Topics I write about</h1>
      </div>

      {pipe(
        topicsResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read topics index file.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          (topics) => (
            <main
              className={`responsive-container responsive-container-inline-padding ${styles.topics}`}
            >
              {topics.map((topic) => (
                <Link
                  className={`decoration-on-hover ${styles["topic-link"]}`}
                  href={getTopicPagePath(topic)}
                  key={topic}
                >
                  {topic}
                </Link>
              ))}
            </main>
          ),
        ),
      )}
    </Layout>
  );
};
