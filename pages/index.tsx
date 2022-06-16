import { array, either, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { ComponentProps } from "react";
import { HomePage } from "../components/HomePage";
import { readAllContentIndex } from "../content-processing/indexes";

export default HomePage;

/**
 * Max number of posts to be shown.
 *
 * Exceeding this number should push me to add pagination to the index page and
 * the topic pages.
 */
const maxPosts = 30;

export const getStaticProps: GetStaticProps<
  ComponentProps<typeof HomePage>
> = async () => {
  const allPostsResult = await readAllContentIndex();

  if (
    either.isRight(allPostsResult) &&
    allPostsResult.right.length >= maxPosts
  ) {
    throw new Error(
      `Max number of posts (${maxPosts}) exceeded. There are ${allPostsResult.right.length} posts. It is time to add pagination`
    );
  }

  const allPostsWithSerializedContentResult = await pipe(
    taskEither.fromEither(allPostsResult),
    taskEither.chainTaskK(
      flow(
        array.map((contentWithMetadata) => async () => ({
          ...contentWithMetadata.contentMetadata,
          summary: await serialize(contentWithMetadata.contentMetadata.summary),
        })),
        task.sequenceArray
      )
    )
  )();

  return {
    props: {
      allPostsResult: allPostsWithSerializedContentResult,
    },
  };
};
