import { either } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import type { PageConfig } from "next";

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
  // NOTE: static content is inspected by rehype-img-size to determine image dimensions
  "public/static-content",
].map(globAnyFileInDirectory);
