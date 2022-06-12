import { either, taskEither } from "fp-ts/es6";
import { pipe } from "fp-ts/es6/function";
import { ContentWithMetadata } from "../parse-content";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

/** Keys are slugs */
export type SlugReverseMapping = Record<string, ContentWithMetadata>;

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
        ((): either.Either<DuplicateSlugError[], SlugReverseMapping> => {
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
          const slugReverseMapping: SlugReverseMapping = {};

          Object.entries(slugReverseMappingWithDuplicates).forEach(
            ([slug, contents]) => {
              if (contents.length === 1) {
                slugReverseMapping[slug] = contents[0];
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

export const readSlugReverseMapping = pipe(
  taskEither.rightIO(getIndexFilePath(slugReverseMappingIndexName)),
  taskEither.chainW(safeReadIndex),
  taskEither.map((data) => data as SlugReverseMapping)
);
