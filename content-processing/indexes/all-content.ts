import { taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { z } from "zod";
import { ExtractLeftFromEither, ExtractResultFromTask } from "../../lib/fp-ts";
import { ParsedArticleWithMetadata } from "../parse-articles";
import { safeParseSchema } from "../utils";
import { indexedArticleMetadataSchema } from "./schema";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

const allArticlesIndexName = "all-articles.json";

export const createAllArticlesIndex = (
  articlesWithMetadata: readonly ParsedArticleWithMetadata[]
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
      safeWriteIndex(
        indexFilePath,
        articlesWithMetadata.map(({ metadata }) => metadata)
      )
    )
  );

const allArticlesIndexSchema = z.array(indexedArticleMetadataSchema);

export type ReadAllArticlesIndexError = ExtractLeftFromEither<
  ExtractResultFromTask<typeof readAllArticlesIndex>
>;

export const readAllArticlesIndex = pipe(
  taskEither.rightIO(getIndexFilePath(allArticlesIndexName)),
  taskEither.chainW(safeReadIndex),
  taskEither.chainEitherKW(safeParseSchema(allArticlesIndexSchema))
);
