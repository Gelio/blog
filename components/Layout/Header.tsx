import styles from "./Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { githubProfileLink } from "../../consts";
import { aboutPagePath } from "../AboutPage/route";
import { homePagePath } from "../HomePage/route";
import { topicsPagePath } from "../TopicsPage/route";

export const Header = () => {
  return (
    <header
      className={`responsive-container responsive-container-inline-padding ${styles.header}`}
    >
      <nav className={styles["header-links"]}>
        <Link
          className={`decoration-on-hover ${styles["header-link"]} ${styles["header-title-link"]}`}
          href={homePagePath}
        >
          Greg Rozdzialik
        </Link>

        <div className={styles.sublinks}>
          <Link
            className={`decoration-on-hover ${styles["header-link"]}`}
            href={topicsPagePath}
          >
            Topics
          </Link>

          <Link
            className={`decoration-on-hover ${styles["header-link"]}`}
            href={aboutPagePath}
          >
            About
          </Link>
        </div>
      </nav>

      <div className={styles.sublinks}>
        <a
          className={styles["icon-link"]}
          href="/rss.xml"
          target="_blank"
          rel="noopener"
          aria-label="RSS feed for the blog"
        >
          <RSSIcon />
        </a>
        <a
          className={styles["icon-link"]}
          href={githubProfileLink}
          target="_blank"
          rel="noopener"
          aria-label="My GitHub profile"
        >
          <GitHubIcon />
        </a>
      </div>
    </header>
  );
};

const GitHubIcon = () => {
  return (
    <Image alt="GitHub logo" src="/images/github.svg" width={24} height={24} />
  );
};

const RSSIcon = () => {
  return (
    <Image alt="RSS feed icon" src="/images/rss.svg" width={24} height={24} />
  );
};
