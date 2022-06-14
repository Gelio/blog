import { either, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import { z } from "zod";
import { ContentWithMetadata } from "../parse-content";
import { safeParseSchema } from "../utils";
import {
  contentWithMetadataSchema,
  ensureParentDirectoryExists,
  getIndexFilePath,
  IndexReadError,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

/** Keys are slugs */
type SlugReverseMappingOutput = Record<string, ContentWithMetadata>;

const slugReverseMappingIndexName = "slug-reverse-mapping.json";

interface DuplicateSlugError {
  slug: string;
  filePaths: string[];
}

export const createSlugReverseMappingIndex = (
  contentWithMetadata: readonly ContentWithMetadata[]
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
            ContentWithMetadata[]
          > = {};

          contentWithMetadata.forEach((content) => {
            const { slug } = content.contentMetadata;
            const sameSlugArray = slugReverseMappingWithDuplicates[slug];
            if (sameSlugArray) {
              sameSlugArray.push(content);
            } else {
              slugReverseMappingWithDuplicates[slug] = [content];
            }
          });

          const duplicateErrors: DuplicateSlugError[] = [];
          const slugReverseMapping: SlugReverseMappingOutput = {};

          Object.entries(slugReverseMappingWithDuplicates).forEach(
            ([slug, contents]) => {
              if (contents.length === 1) {
                slugReverseMapping[slug] = contents[0]!;
              } else {
                duplicateErrors.push({
                  slug,
                  filePaths: contents.map((content) => content.contentFilePath),
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
  contentWithMetadataSchema
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
