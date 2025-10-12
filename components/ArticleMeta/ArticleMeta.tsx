import styles from "./ArticleMeta.module.css";

import { Tags } from "../Tags";

interface ArticleMetaProps {
  createdDate: string;
  readingTimeMin: number;
  tagNames: string[];
}

export const ArticleMeta = ({
  createdDate,
  readingTimeMin,
  tagNames,
}: ArticleMetaProps) => (
  <div className={styles.container}>
    <span className={styles.item}>{formatDateString(createdDate)}</span>
    <span className={styles.item}>{formatReadingTime(readingTimeMin)}</span>
    <span className={styles.item}>
      <Tags names={tagNames} />
    </span>
  </div>
);

const formatDateString = (dateString: string) => {
  const date = new Date(dateString);

  return `${date.getFullYear()}-${padDateElement(
    date.getMonth() + 1,
  )}-${padDateElement(date.getDate())}`;
};

const padDateElement = (value: number) => value.toString().padStart(2, "0");

const formatReadingTime = (readingTimeMin: number) => {
  const roundedReadingTimeMin = Math.ceil(readingTimeMin);

  return `${roundedReadingTimeMin} minute${
    roundedReadingTimeMin === 1 ? "" : "s"
  } read`;
};
