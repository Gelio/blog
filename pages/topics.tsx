import { GetStaticProps } from "next";
import { ComponentProps } from "react";
import { TopicsPage } from "../components/TopicsPage";

import { readTopicsSummaryIndex } from "../content-processing/indexes/per-topic";
import { reserializeIfError } from "../content-processing/utils";

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
