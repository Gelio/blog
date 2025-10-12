import type { ComponentProps } from "react";

import { ArticleMeta } from "../ArticleMeta";
import styles from "./ArticleHeader.module.css";

interface ArticleHeaderProps extends ComponentProps<typeof ArticleMeta> {
  title: string;
}

export const ArticleHeader = ({
  title,
  createdDate,
  readingTimeMin: readingDuration,
  tagNames,
}: ArticleHeaderProps) => (
  <div
    className={`responsive-container responsive-container-inline-padding ${styles.header}`}
  >
    <h1 className={`article-title ${styles["article-title"]}`}>{title}</h1>

    <ArticleMeta
      createdDate={createdDate}
      readingTimeMin={readingDuration}
      tagNames={tagNames}
    />
  </div>
);
