import { either, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { z } from "zod";
import { ParsedArticleWithMetadata } from "../parse-articles";
import { safeParseSchema } from "../utils";
import { indexedArticleMetadataSchema } from "./schema";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  IndexReadError,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

/** Keys are slugs */
type DeserializedSlugReverseMapping = Record<string, ParsedArticleWithMetadata>;

const slugReverseMappingIndexName = "slug-reverse-mapping.json";

interface DuplicateSlugError {
  slug: string;
  filePaths: string[];
}

export const createSlugReverseMappingIndex = (
  articlesWithMetadata: readonly ParsedArticleWithMetadata[]
) =>
  pipe(
    taskEither.rightIO(getIndexFilePath(slugReverseMappingIndexName)),
    taskEither.bindTo("slugReverseMappingIndexPath"),
    taskEither.chainFirstW(({ slugReverseMappingIndexPath }) =>
      pipe(
        ensureParentDirectoryExists(slugReverseMappingIndexPath),
        taskEither.mapLeft(
          (error) =>
            ({
              type: "cannot-create-index-parent-directory",
              error,
            } as const)
        )
      )
    ),
    taskEither.apSW(
      "slugReverseMapping",
      taskEither.fromEither(
        ((): either.Either<
          DuplicateSlugError[],
          DeserializedSlugReverseMapping
        > => {
          const slugReverseMappingWithDuplicates: Record<
            string,
            ParsedArticleWithMetadata[]
          > = {};

          articlesWithMetadata.forEach((articleWithMetadata) => {
            const { slug } = articleWithMetadata.metadata;
            const sameSlugArray = slugReverseMappingWithDuplicates[slug];
            if (sameSlugArray) {
              sameSlugArray.push(articleWithMetadata);
            } else {
              slugReverseMappingWithDuplicates[slug] = [articleWithMetadata];
            }
          });

          const duplicateErrors: DuplicateSlugError[] = [];
          const slugReverseMapping: DeserializedSlugReverseMapping = {};

          Object.entries(slugReverseMappingWithDuplicates).forEach(
            ([slug, articlesForSlug]) => {
              if (articlesForSlug.length === 1) {
                slugReverseMapping[slug] = articlesForSlug[0]!;
              } else {
                duplicateErrors.push({
                  slug,
                  filePaths: articlesForSlug.map(({ filePath }) => filePath),
                });
              }
            }
          );

          if (duplicateErrors.length > 0) {
            return either.left(duplicateErrors);
          }

          return either.right(slugReverseMapping);
        })()
      )
    ),
    taskEither.chainW(({ slugReverseMappingIndexPath, slugReverseMapping }) =>
      pipe(
        safeWriteIndex(slugReverseMappingIndexPath, slugReverseMapping),
        taskEither.mapLeft(
          (error) =>
            ({
              type: "cannot-write-slug-reverse-mapping",
              slugReverseMappingIndexPath,
              error,
            } as const)
        )
      )
    )
  );

const indexedArticleWithMetadataSchema = z.object({
  filePath: z.string(),
  metadata: indexedArticleMetadataSchema,
});

const slugReverseMappingSchema = z.record(
  z.string(),
  indexedArticleWithMetadataSchema
);

export type ReadSlugReverseMappingError =
  | IndexReadError
  | {
      type: "slug-reverse-mapping-parse-error";
      error: z.ZodError;
    };

export const readSlugReverseMapping = pipe(
  taskEither.rightIO(getIndexFilePath(slugReverseMappingIndexName)),
  taskEither.chainW(safeReadIndex),
  taskEither.chainEitherKW(
    flow(
      safeParseSchema(slugReverseMappingSchema),
      either.mapLeft(
        (error): ReadSlugReverseMappingError =>
          ({
            type: "slug-reverse-mapping-parse-error",
            error,
          } as const)
      )
    )
  )
);
