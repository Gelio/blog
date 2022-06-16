import { z } from "zod";

/**
 * Schema describing the article metadata that is
 * stored in content indexes.
 */
export const indexedArticleMetadataSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
  readingTimeMin: z.number(),
  summary: z.string(),
});

/**
 * Metadata about articles that is stored in content indexes.
 */
export type IndexedArticleMetadata = z.infer<
  typeof indexedArticleMetadataSchema
>;
