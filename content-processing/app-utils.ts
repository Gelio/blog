import { either } from "fp-ts";
import { flow, pipe } from "fp-ts/function";

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
