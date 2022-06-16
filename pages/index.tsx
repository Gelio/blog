import { array, either, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { ComponentProps } from "react";
import { HomePage } from "../components/HomePage";
import { readAllArticlesIndex } from "../content-processing/indexes";

export default HomePage;

/**
 * Max number of posts to be shown.
 *
 * Exceeding this number should push me to add pagination to the index page and
 * the topic pages.
 */
const maxArticles = 30;

export const getStaticProps: GetStaticProps<
  ComponentProps<typeof HomePage>
> = async () => {
  const allArticlesResult = await readAllArticlesIndex();

  if (
    either.isRight(allArticlesResult) &&
    allArticlesResult.right.length >= maxArticles
  ) {
    throw new Error(
      `Max number of articles (${maxArticles}) exceeded. There are ${allArticlesResult.right.length} articles. It is time to add pagination`
    );
  }

  const allArticlesWithSerializedContentResult = await pipe(
    taskEither.fromEither(allArticlesResult),
    taskEither.chainTaskK(
      flow(
        array.map((articleMetadata) => async () => ({
          ...articleMetadata,
          summary: await serialize(articleMetadata.summary),
        })),
        task.sequenceArray
      )
    )
  )();

  return {
    props: {
      allArticlesResult: allArticlesWithSerializedContentResult,
    },
  };
};
