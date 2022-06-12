import { either, io, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

export const getIndexesDirectoryPath: io.IO<string> = () => {
  const thisFilePath = fileURLToPath(import.meta.url);

  const indexesDirectoryPath = path.dirname(thisFilePath);
  const contentProcessingDirectoryPath = path.dirname(indexesDirectoryPath);
  const repositoryRootDirectoryPath = path.dirname(
    contentProcessingDirectoryPath
  );

  return path.join(repositoryRootDirectoryPath, "content-indexes");
};

export const getIndexFilePath = (indexFileName: string): io.IO<string> =>
  pipe(
    getIndexesDirectoryPath,
    io.map((repositoryRootDirectoryPath) =>
      path.join(repositoryRootDirectoryPath, indexFileName)
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

interface FileReadError {
  type: "file-read-error";
  error: unknown;
  filePath: string;
}

const safeReadFile = (
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

interface IndexReadError {
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
