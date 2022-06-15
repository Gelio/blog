import { taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { ContentWithMetadata } from "../parse-content";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

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
  taskEither.map((data) => data as import("./utils").ContentWithMetadata[])
);
