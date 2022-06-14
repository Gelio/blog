import { either } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import type { PageConfig } from "next";
import { z } from "zod";

/**
 * Serializes and deserializes the result if it is `Left`.
 *
 * Fixes the problem of Next.js not being able to send the result
 * if it contains a Node.js `Error`. Then, Next.js complains about not knowing how to serialize
 * the `Error`.
 *
 * Using `JSON.serialize` followed by `JSON.parse` fixes the problem.
 *
 * @see https://simplernerd.com/next-js-error-serializing-date-returned-from-getserversideprops/
 */
export const reserializeIfError = <E, A>(
  result: either.Either<E, A>
): either.Either<E, A> =>
  pipe(result, either.mapLeft(flow(JSON.stringify, JSON.parse)));

// NOTE: the suggestion from the zod README to use z.ZodType or
// z.ZodTypeAny leads to this function returning `any`
// https://github.com/colinhacks/zod#writing-generic-functions
// We need to manually specify ZodType's generic arguments for
// `safeParse` to retain the types
export const safeParseSchema = <Output, Def, Input>(
  schema: z.ZodType<Output, Def, Input>,
  data: unknown
) =>
  pipe(schema.safeParse(data), (result) =>
    result.success ? either.right(result.data) : either.left(result.error)
  );

const globAnyFileInDirectory = (directoryPath: string) =>
  // NOTE: the `*.*` is mandatory so that minimatch returns only files (with an
  // extension) and not directories. Otherwise, Next logs an EISDIR when
  // processing matches.
  `${directoryPath}/**/*.*`;

/**
 * Globs pointing to files that are necessary during Incremental Static
 * Generation of content resources.
 *
 * Globs are reletive to the root of the repository.
 *
 * They are needed because otherwise Next will exclude these files from the runtime environment of ISG.
 *
 * @see https://nextjs.org/docs/advanced-features/output-file-tracing#caveats
 */
export const contentIncludeFileGlobs: PageConfig["unstable_includeFiles"] = [
  "content-indexes",
  "content",
].map(globAnyFileInDirectory);
