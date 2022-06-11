import glob from "glob";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import grayMatter from "gray-matter";
import { date, either, ord, readonlyArray, taskEither } from "fp-ts/es6";
import { pipe } from "fp-ts/es6/function";
import { z } from "zod";
import { task } from "fp-ts";

const contentGlob = "content/**/*.mdx";

const getContentFilePaths: taskEither.TaskEither<Error, string[]> = () =>
  new Promise((resolve) => {
    const repositoryDirectoryPath = fileURLToPath(
      new URL("..", import.meta.url)
    );
    glob(
      contentGlob,
      { cwd: repositoryDirectoryPath, absolute: true },
      (error, matches) => {
        resolve(error ? either.left(error) : either.right(matches));
      }
    );
  });

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
export type ContentFrontMatter = z.infer<typeof contentFrontMatterSchema>;

const parseContentMetadata = (
  contentFilePath: string
): taskEither.TaskEither<ContentMetadataParseError, ContentFrontMatter> =>
  pipe(
    taskEither.tryCatch(
      () => readFile(contentFilePath, { encoding: "utf-8" }),
      (error): ContentMetadataParseError => ({
        type: "cannot-read-file",
        error: error as Error,
      })
    ),
    taskEither.chain((contents) => {
      const { data } = grayMatter(contents);

      return () =>
        contentFrontMatterSchema.safeParseAsync(data).then((result) =>
          result.success
            ? either.right(result.data)
            : either.left<ContentMetadataParseError>({
                type: "cannot-parse-frontmatter",
                readFrontMatter: data,
                error: result.error,
              })
        );
    })
  );
