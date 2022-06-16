import { either, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { ParsedUrlQuery } from "querystring";
import { ComponentProps } from "react";
import { TopicPage } from "../../components/TopicPage";
import { reserializeIfError } from "../../content-processing/app-utils";
import {
  readTopicIndex,
  readTopicsSummaryIndex,
} from "../../content-processing/indexes";

export default TopicPage;

interface TopicPageQueryParams {
  /** Name of the topic */
  name: string;
}

export const getStaticPaths: GetStaticPaths<
  TopicPageQueryParams & ParsedUrlQuery
> = async () => {
  const topicsSummaryResult = await readTopicsSummaryIndex();
  const topics = pipe(
    topicsSummaryResult,
    either.getOrElseW((error) => {
      console.log("Cannot read topics index file", error);
      throw new Error("Cannot read topics index file");
    })
  );

  return {
    paths: topics.map((topicName) => ({
      params: { name: topicName },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  ComponentProps<typeof TopicPage>,
  TopicPageQueryParams & ParsedUrlQuery
> = async (context) => {
  if (!context.params) {
    throw new Error("Params not defined even though `getStaticPaths` exists");
  }

  const { name: topicName } = context.params;
  const topicIndexResult = await pipe(
    readTopicIndex(topicName),
    taskEither.bindW("articlesWithSerializedSummary", ({ articles }) =>
      pipe(
        articles.map((articleMetadata) => async () => ({
          ...articleMetadata,
          summary: await serialize(articleMetadata.summary),
        })),
        task.sequenceArray,
        taskEither.rightTask
      )
    ),
    taskEither.map(({ description, articlesWithSerializedSummary }) => ({
      description,
      articles: articlesWithSerializedSummary,
    }))
  )();

  return {
    props: {
      articlesResult: reserializeIfError(topicIndexResult),
      topicName,
    },
  };
};
