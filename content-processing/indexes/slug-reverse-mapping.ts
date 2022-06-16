import { either, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import { z } from "zod";
import { ArticleWithMetadata } from "../parse-articles";
import { safeParseSchema } from "../utils";
import {
  articleWithMetadataSchema,
  ensureParentDirectoryExists,
  getIndexFilePath,
  IndexReadError,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

/** Keys are slugs */
type SlugReverseMappingOutput = Record<string, ArticleWithMetadata>;

const slugReverseMappingIndexName = "slug-reverse-mapping.json";

interface DuplicateSlugError {
  slug: string;
  filePaths: string[];
}

export const createSlugReverseMappingIndex = (
  articlesWithMetadata: readonly ArticleWithMetadata[]
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
        ((): either.Either<DuplicateSlugError[], SlugReverseMappingOutput> => {
          const slugReverseMappingWithDuplicates: Record<
            string,
            ArticleWithMetadata[]
          > = {};

          articlesWithMetadata.forEach((articleWithMetadata) => {
            const { slug } = articleWithMetadata.articleMetadata;
            const sameSlugArray = slugReverseMappingWithDuplicates[slug];
            if (sameSlugArray) {
              sameSlugArray.push(articleWithMetadata);
            } else {
              slugReverseMappingWithDuplicates[slug] = [articleWithMetadata];
            }
          });

          const duplicateErrors: DuplicateSlugError[] = [];
          const slugReverseMapping: SlugReverseMappingOutput = {};

          Object.entries(slugReverseMappingWithDuplicates).forEach(
            ([slug, articlesForSlug]) => {
              if (articlesForSlug.length === 1) {
                slugReverseMapping[slug] = articlesForSlug[0]!;
              } else {
                duplicateErrors.push({
                  slug,
                  filePaths: articlesForSlug.map(
                    ({ articleFilePath }) => articleFilePath
                  ),
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

const slugReverseMappingSchema = z.record(
  z.string(),
  articleWithMetadataSchema
);

/** Keys are slugs */
export type SlugReverseMapping = z.infer<typeof slugReverseMappingSchema>;

export type ReadSlugReverseMappingError =
  | IndexReadError
  | {
      type: "slug-reverse-mapping-parse-error";
      error: z.ZodError;
    };

export const readSlugReverseMapping = pipe(
  taskEither.rightIO(getIndexFilePath(slugReverseMappingIndexName)),
  taskEither.chainW(safeReadIndex),
  taskEither.chainEitherKW((rawSlugReverseMapping) =>
    pipe(
      safeParseSchema(slugReverseMappingSchema, rawSlugReverseMapping),
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
