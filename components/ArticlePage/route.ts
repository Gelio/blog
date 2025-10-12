import type { Route } from "next";

export const getArticlePagePath = (slug: string) => `/article/${slug}` as Route;
