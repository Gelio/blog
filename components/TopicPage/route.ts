import type { Route } from "next";

export const getTopicPagePath = (topic: string) => `/topic/${topic}` as Route;
