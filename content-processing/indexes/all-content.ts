import { taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { ArticleWithMetadata } from "../parse-articles";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

const allArticlesIndexName = "all-articles.json";

export const createAllArticlesIndex = (
  articlesWithMetadata: readonly ArticleWithMetadata[]
) =>
  pipe(
    taskEither.rightIO(getIndexFilePath(allArticlesIndexName)),
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
      safeWriteIndex(indexFilePath, articlesWithMetadata)
    )
  );

export const readAllArticlesIndex = pipe(
  taskEither.rightIO(getIndexFilePath(allArticlesIndexName)),
  taskEither.chainW(safeReadIndex),
  taskEither.map((data) => data as import("./utils").ArticleWithMetadata[])
);
