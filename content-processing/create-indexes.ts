import { either, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import path from "path";
import rimraf from "rimraf";
import {
  createAllArticlesIndex,
  createSlugReverseMappingIndex,
  createTopicIndexes,
} from "./indexes";
import { getIndexesDirectoryPath } from "./indexes/utils";
import { parseArticleWithMetadata } from "./parse-articles";

const clearIndexesDirectory: taskEither.TaskEither<Error, undefined> = pipe(
  taskEither.rightIO(getIndexesDirectoryPath),
  taskEither.chain(
    (indexesDirectoryPath): taskEither.TaskEither<Error, undefined> =>
      () =>
        new Promise((resolve) =>
          rimraf(path.join(indexesDirectoryPath, "*"), {}, (error) =>
            error
              ? resolve(either.left(error))
              : resolve(either.right(undefined))
          )
        )
  )
);

const main = pipe(
  parseArticleWithMetadata,
  taskEither.apFirstW(
    pipe(
      clearIndexesDirectory,
      taskEither.mapLeft(
        (error) =>
          ({
            type: "cannot-clear-indexes-directory",
            error,
          } as const)
      )
    )
  ),
  taskEither.chainW((articlesWithMetadata) =>
    pipe(
      // TODO: show errors from all processes. Right now only the first failed
      // process' errors are returned
      createAllArticlesIndex(articlesWithMetadata),
      taskEither.apFirstW(createTopicIndexes(articlesWithMetadata)),
      taskEither.apFirstW(createSlugReverseMappingIndex(articlesWithMetadata))
    )
  ),
  taskEither.matchE(
    (error) =>
      task.fromIO(() => {
        console.log("Error occurred");
        console.dir(error, { depth: null });
      }),
    () =>
      task.fromIO(() => {
        console.log("All done!");
      })
  )
);

main();
