import { either, io, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";

export const getRepositoryRootDirectoryPath: io.IO<string> = () =>
  // NOTE: assume the scripts will always be invoked from the Next application root
  // This is the case:
  // * when running scripts via `npm run`,
  // * when running or building in production on Vercel

  // NOTE: previously this used `import.meta.env` to determine the path of the
  // root of the repository, but that proved to be unreliable when the
  // application was hosted on Vercel. Vercel moved the files around when it
  // generated the pages using Incremental Static Generation, but the
  // `import.meta.env` was from the moment the application was built. The file
  // paths were different. Using `process.cwd()` is the only reliable way to
  // get the path to the root of the repository and then use relative paths.
  process.cwd();

export const getIndexesDirectoryPath = pipe(
  getRepositoryRootDirectoryPath,
  io.map((repositoryRootDirectoryPath) =>
    path.join(repositoryRootDirectoryPath, "content-indexes")
  )
);

export const getIndexFilePath = (indexFileName: string): io.IO<string> =>
  pipe(
    getIndexesDirectoryPath,
    io.map((indexesDirectoryPath) =>
      path.join(indexesDirectoryPath, indexFileName)
    )
  );

export const ensureParentDirectoryExists = (
  filePath: string
): taskEither.TaskEither<unknown, undefined> =>
  pipe(
    taskEither.tryCatch(
      () => fs.mkdir(path.dirname(filePath), { recursive: true }),
      (error) => error
    ),
    taskEither.map(() => undefined)
  );

export interface FileWriteError {
  type: "file-write-error";
  error: unknown;
}

export const safeWriteIndex = (
  filePath: string,
  data: unknown
): taskEither.TaskEither<FileWriteError, void> =>
  taskEither.tryCatch(
    () =>
      fs.writeFile(filePath, JSON.stringify(data, null, 2), {
        encoding: "utf-8",
      }),
    (error) => ({
      type: "file-write-error",
      error,
    })
  );

export interface FileReadError {
  type: "file-read-error";
  error: unknown;
  filePath: string;
}

export const safeReadFile = (
  filePath: string
): taskEither.TaskEither<FileReadError, string> =>
  taskEither.tryCatch(
    () => fs.readFile(filePath, { encoding: "utf-8" }),
    (error): FileReadError => ({
      type: "file-read-error",
      error,
      filePath,
    })
  );

interface IndexParseError {
  type: "json-parse-error";
  error: unknown;
}

const safeParseJSON = (data: string): either.Either<IndexParseError, unknown> =>
  either.tryCatch(
    () => JSON.parse(data),
    (error): IndexParseError => ({
      type: "json-parse-error",
      error,
    })
  );

export interface IndexReadError {
  type: "index-read-error";
  filePath: string;
  error: FileReadError | IndexParseError;
}

export const safeReadIndex = (filePath: string) =>
  pipe(
    safeReadFile(filePath),
    taskEither.chainEitherKW(safeParseJSON),
    taskEither.mapLeft(
      (error): IndexReadError => ({
        type: "index-read-error",
        filePath,
        error,
      })
    )
  );

export const articleMetadataSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
  readingTimeMin: z.number(),
  summary: z.string(),
});
export type ArticleMetadata = z.infer<typeof articleMetadataSchema>;

export const articleWithMetadataSchema = z.object({
  /** Relative path from the repository root to the article */
  articleFilePath: z.string(),
  articleMetadata: articleMetadataSchema,
});

export type ArticleWithMetadata = z.infer<typeof articleWithMetadataSchema>;
