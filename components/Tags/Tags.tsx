import Link from "next/link";
import { getTopicPagePath } from "../TopicPage";
import styles from "./Tags.module.css";

interface TagsProps {
  names: string[];
}

export const Tags = ({ names }: TagsProps) => (
  <>
    {names
      .flatMap((name) => [
        <Tag key={name} name={name} />,
        <span key={`${name}-separator`}>, </span>,
      ])
      // NOTE: trim the final comma
      .slice(0, -1)}
  </>
);

const Tag = ({ name }: { name: string }) => (
  <Link
    className={styles["tag-link"]}
    href={getTopicPagePath(name)}
    aria-label={`Topic: ${name}`}
  >
    {name}
  </Link>
);
