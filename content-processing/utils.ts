import { either, ioOption, option } from "fp-ts";
import { pipe } from "fp-ts/function";
import type { z, ZodTypeDef } from "zod";

// NOTE: the suggestion from the zod README to use z.ZodType or
// z.ZodTypeAny leads to this function returning `any`
// https://github.com/colinhacks/zod#writing-generic-functions
// We need to manually specify ZodType's generic arguments for
// `safeParse` to retain the types
export const safeParseSchema =
  <Output, Def extends ZodTypeDef, Input>(
    schema: z.ZodType<Output, Def, Input>
  ) =>
  (data: unknown) =>
    pipe(schema.safeParse(data), (result) =>
      result.success ? either.right(result.data) : either.left(result.error)
    );

const getVercelSiteURL: ioOption.IOOption<URL> = () =>
  pipe(
    option.fromNullable(process.env.VERCEL_URL),
    option.map((host) => new URL(`https://${host}/`))
  );

export const getSiteURL = pipe(
  getVercelSiteURL,
  ioOption.getOrElse(() => () => new URL(`http://localhost:3000/`))
);
