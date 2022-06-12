import { taskEither } from "fp-ts/es6";
import { flow, pipe } from "fp-ts/es6/function";
import { ContentWithMetadata } from "../parse-content";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

export type AllContentIndex = ContentWithMetadata[];

const allContentIndexName = "all-content.json";

export const createAllContentIndex = (
  contentWithMetadata: readonly ContentWithMetadata[]
) =>
  pipe(
    taskEither.rightIO(getIndexFilePath(allContentIndexName)),
    taskEither.chainFirstW(
      flow(
        ensureParentDirectoryExists,
        taskEither.mapLeft(
          (error) =>
            ({
              type: "cannot-create-index-parent-directory",
              error,
            } as const)
        )
      )
    ),
    taskEither.chainW((indexFilePath) =>
      safeWriteIndex(indexFilePath, contentWithMetadata)
    )
  );

export const readAllContentIndex = pipe(
  taskEither.rightIO(getIndexFilePath(allContentIndexName)),
  taskEither.chainW(safeReadIndex),
  taskEither.map((data) => data as AllContentIndex)
);
