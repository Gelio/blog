import { io } from "fp-ts/es6";
import { pipe } from "fp-ts/es6/function";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { taskEither } from "fp-ts";

export const getIndexesDirectoryPath: io.IO<string> = () => {
  const indexesDirectoryPath = fileURLToPath(new URL(".", import.meta.url));

  const repositoryRootDirectoryPath = pipe(
    indexesDirectoryPath,
    path.dirname,
    path.dirname
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
