import type { either, task } from "fp-ts";

export type ExtractLeftFromEither<T> = T extends either.Left<infer E>
  ? E
  : never;

export type ExtractResultFromTask<T extends task.Task<any>> = Awaited<
  ReturnType<T>
>;
