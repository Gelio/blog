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

/** Relative to the root of the reposiotry */
const articlesGlob = "content/articles/**/*.mdx";

const getArticleFilePaths = pipe(
  taskEither.Do,
  taskEither.apS(
    "repositoryDirectoryPath",
    taskEither.rightIO(getRepositoryRootDirectoryPath)
  ),
  taskEither.bindW(
    "articlePaths",
    ({ repositoryDirectoryPath }) =>
      () =>
        new Promise<either.Either<Error, string[]>>((resolve) => {
          glob(
            articlesGlob,
            { cwd: repositoryDirectoryPath, absolute: true },
            (error, matches) => {
              resolve(error ? either.left(error) : either.right(matches));
            }
          );
        })
  ),
  taskEither.map(({ articlePaths, repositoryDirectoryPath }) =>
    articlePaths.map((filePath) =>
      path.relative(repositoryDirectoryPath, filePath)
    )
  )
);

/**
 * Information about the article.
 * Used during the index-creation process.
 */
export interface ParsedArticleWithMetadata {
  filePath: string;
  metadata: ParsedArticleFrontMatter;
}

export const parseArticleWithMetadata = pipe(
  getArticleFilePaths,
  taskEither.mapLeft(
    (error) =>
      ({
        type: "cannot-complete-glob",
        error,
      } as const)
  ),
  taskEither.chainW((articleFilePaths) =>
    pipe(
      articleFilePaths,
      readonlyArray.map((articleFilePath) =>
        pipe(
          parseArticleMetadata(articleFilePath),
          taskEither.map(
            (articleMetadata): ParsedArticleWithMetadata => ({
              metadata: articleMetadata,
              filePath: articleFilePath,
            })
          ),
          taskEither.mapLeft((error) => [error])
        )
      ),
      readonlyArray.sequence(
        taskEither.getApplicativeTaskValidation(
          task.ApplyPar,
          readonlyArray.getSemigroup<ArticleMetadataParseError>()
        )
      ),
      taskEither.mapLeft(
        (errors) =>
          ({
            type: "cannot-parse-article",
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
          ({ metadata }: ParsedArticleWithMetadata) => metadata.date
        ),
        ord.reverse
      )
    )
  )
);

type ArticleMetadataParseError =
  | {
      type: "cannot-read-file";
      error: Error;
    }
  | {
      type: "cannot-parse-frontmatter";
      readFrontMatter: Record<string, unknown>;
      error: z.ZodError<z.input<typeof articleFrontMatterSchema>>;
    };

const articleFrontMatterSchema = z.object({
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

  summary: z.string().min(5),
});
type ParsedArticleFrontMatter = z.infer<typeof articleFrontMatterSchema>;

/**
 * This describes the metadata in the index-creation pipeline.
 */
type ParsedArticleMetadata = ParsedArticleFrontMatter & {
  readingTimeMin: number;
};

const parseArticleMetadata = (
  articleFilePath: string
): taskEither.TaskEither<ArticleMetadataParseError, ParsedArticleMetadata> =>
  pipe(
    taskEither.tryCatch(
      () => readFile(articleFilePath, { encoding: "utf-8" }),
      (error): ArticleMetadataParseError => ({
        type: "cannot-read-file",
        error: error as Error,
      })
    ),
    taskEither.chainEitherK((articleContents) => {
      const { data, content } = grayMatter(articleContents);

      return pipe(
        safeParseSchema(articleFrontMatterSchema)(data),
        either.bimap(
          (error): ArticleMetadataParseError => ({
            type: "cannot-parse-frontmatter",
            readFrontMatter: data,
            error,
          }),
          (parsedFrontMatter): ParsedArticleMetadata => ({
            ...parsedFrontMatter,
            readingTimeMin: readingTime(content).minutes,
          })
        )
      );
    })
  );
