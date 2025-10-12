import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { ArticleMeta } from "../ArticleMeta";
import { getArticlePagePath } from "../ArticlePage/route";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps extends ComponentProps<typeof ArticleMeta> {
  className?: string;
  title: string;
  slug: string;
  summary: ReactNode;
}

export const ArticleCard = ({
  title,
  slug,
  summary,
  className,
  tagNames,
  readingTimeMin,
  createdDate,
}: ArticleCardProps) => (
  <article className={`${styles["article-card"]} ${className}`}>
    <h2 className={`${styles["article-title"]} article-title`}>{title}</h2>

    <ArticleMeta
      readingTimeMin={readingTimeMin}
      createdDate={createdDate}
      tagNames={tagNames}
    />

    <div>{summary}</div>

    <Link
      href={getArticlePagePath(slug)}
      aria-label={`Read the article "${title}"`}
      className={styles["read-more-link"]}
    >
      Read more
    </Link>
  </article>
);
