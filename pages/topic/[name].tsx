import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { ComponentProps } from "react";
import { TopicPage } from "../../components/TopicPage";
import {
  readTopicIndex,
  readTopicsSummaryIndex,
} from "../../content-processing/indexes";
import { reserializeIfError } from "../../content-processing/utils";

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
  const topicIndexResult = await readTopicIndex(topicName)();

  return {
    props: {
      postsResult: reserializeIfError(topicIndexResult),
      topicName,
    },
  };
};
