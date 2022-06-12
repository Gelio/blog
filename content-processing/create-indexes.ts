import { either, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import rimraf from "rimraf";
import {
  createAllContentIndex,
  createSlugReverseMappingIndex,
  createTopicIndexes,
} from "./indexes";
import { getIndexesDirectoryPath } from "./indexes/utils";
import { parseContentWithMetadata } from "./parse-content";

const clearIndexesDirectory: taskEither.TaskEither<Error, undefined> = pipe(
  taskEither.rightIO(getIndexesDirectoryPath),
  taskEither.chain(
    (indexesDirectoryPath): taskEither.TaskEither<Error, undefined> =>
      () =>
        new Promise((resolve) =>
          rimraf(`${indexesDirectoryPath}/*`, {}, (error) =>
            error
              ? resolve(either.left(error))
              : resolve(either.right(undefined))
          )
        )
  )
);

const main = pipe(
  parseContentWithMetadata,
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
  taskEither.chainW((contentWithMetadata) =>
    pipe(
      // TODO: show errors from all processes. Right now only the first failed
      // process' errors are returned
      createAllContentIndex(contentWithMetadata),
      taskEither.apFirstW(createTopicIndexes(contentWithMetadata)),
      taskEither.apFirstW(createSlugReverseMappingIndex(contentWithMetadata))
    )
  ),
  taskEither.matchE(
    (error) =>
      task.fromIO(() => {
        // TODO: improve displaying errors
        console.log({ error });
      }),
    () =>
      task.fromIO(() => {
        console.log("All done!");
      })
  )
);

main();
