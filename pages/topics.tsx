import type { GetStaticProps } from "next";
import type { ComponentProps } from "react";
import { TopicsPage } from "../components/TopicsPage";
import { reserializeIfError } from "../content-processing/app-utils";

import { readTopicsSummaryIndex } from "../content-processing/indexes/per-topic";

export default TopicsPage;

export const getStaticProps: GetStaticProps<
  ComponentProps<typeof TopicsPage>
> = async () => {
  const topicsResult = await readTopicsSummaryIndex();

  return {
    props: {
      topicsResult: reserializeIfError(topicsResult),
    },
  };
};
