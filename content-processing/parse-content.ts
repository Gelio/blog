import glob from "glob";
import { readFile } from "fs/promises";
import grayMatter from "gray-matter";
import { date, either, ord, readonlyArray, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import { z } from "zod";
import readingTime from "reading-time";
import { safeParseSchema } from "./utils";
import { getRepositoryRootDirectoryPath } from "./indexes/utils";
import path from "path";

const contentGlob = "content/**/*.mdx";

// TODO: add summary to content metadata

const getContentFilePaths = pipe(
  taskEither.Do,
  taskEither.apS(
    "repositoryDirectoryPath",
    taskEither.rightIO(getRepositoryRootDirectoryPath)
  ),
  taskEither.bindW(
    "contentFilePaths",
    ({ repositoryDirectoryPath }) =>
      () =>
        new Promise<either.Either<Error, string[]>>((resolve) => {
          glob(
            contentGlob,
            { cwd: repositoryDirectoryPath, absolute: true },
            (error, matches) => {
              resolve(error ? either.left(error) : either.right(matches));
            }
          );
        })
  ),
  taskEither.map(({ contentFilePaths, repositoryDirectoryPath }) =>
    contentFilePaths.map((filePath) =>
      path.relative(repositoryDirectoryPath, filePath)
    )
  )
);

export interface ContentWithMetadata {
  contentFilePath: string;
  contentMetadata: ContentFrontMatter;
}

export const parseContentWithMetadata = pipe(
  getContentFilePaths,
  taskEither.mapLeft(
    (error) =>
      ({
        type: "cannot-complete-glob",
        error,
      } as const)
  ),
  taskEither.chainW((contentFilePaths) =>
    pipe(
      contentFilePaths,
      readonlyArray.map((contentFilePath) =>
        pipe(
          parseContentMetadata(contentFilePath),
          taskEither.map((contentMetadata) => ({
            contentMetadata,
            contentFilePath,
          })),
          taskEither.mapLeft((error) => [error])
        )
      ),
      readonlyArray.sequence(
        taskEither.getApplicativeTaskValidation(
          task.ApplyPar,
          readonlyArray.getSemigroup<ContentMetadataParseError>()
        )
      ),
      taskEither.mapLeft(
        (errors) =>
          ({
            type: "cannot-parse-content",
            errors,
          } as const)
      )
    )
  ),
  taskEither.map(
    readonlyArray.sort(
      pipe(
        date.Ord,
        ord.contramap(
          (contentWithMetadata: ContentWithMetadata) =>
            contentWithMetadata.contentMetadata.date
        ),
        ord.reverse
      )
    )
  )
);

type ContentMetadataParseError =
  | {
      type: "cannot-read-file";
      error: Error;
    }
  | {
      type: "cannot-parse-frontmatter";
      readFrontMatter: Record<string, unknown>;
      error: z.ZodError<z.input<typeof contentFrontMatterSchema>>;
    };

const contentFrontMatterSchema = z.object({
  title: z.string().min(1),

  date: z
    .date()
    .refine((date) => !Number.isNaN(date.getTime()), "Invalid date"),

  tags: z.string().transform((tagsLine, context) =>
    tagsLine.split(/\s*,\s*/).map((tag, index) => {
      const trimmedTag = tag.trim();

      if (trimmedTag.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Empty tag with index ${index}`,
        });
      }

      return trimmedTag;
    })
  ),

  slug: z.string().min(1),
});
type ContentFrontMatter = z.infer<typeof contentFrontMatterSchema>;

export type ContentMetadata = ContentFrontMatter & {
  readingTimeMin: number;
};

const parseContentMetadata = (
  contentFilePath: string
): taskEither.TaskEither<ContentMetadataParseError, ContentMetadata> =>
  pipe(
    taskEither.tryCatch(
      () => readFile(contentFilePath, { encoding: "utf-8" }),
      (error): ContentMetadataParseError => ({
        type: "cannot-read-file",
        error: error as Error,
      })
    ),
    taskEither.chainEitherK((contents) => {
      const { data, content } = grayMatter(contents);

      return pipe(
        safeParseSchema(contentFrontMatterSchema, data),
        either.bimap(
          (error): ContentMetadataParseError => ({
            type: "cannot-parse-frontmatter",
            readFrontMatter: data,
            error,
          }),
          (parsedFrontMatter): ContentMetadata => ({
            ...parsedFrontMatter,
            readingTimeMin: readingTime(content).minutes,
          })
        )
      );
    })
  );
