import Image from "next/image";
import { Layout } from "../Layout";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import meImage from "../../public/images/me.jpg";
import styles from "./AboutPage.module.css";

export const AboutPage = () => {
  return (
    <Layout>
      <HeadDocumentTitle>About me</HeadDocumentTitle>
      <HeadMetaDescription>
        Information about Grzegorz Rozdzialik, the blog author.
      </HeadMetaDescription>

      <main
        className={`${styles.content} page-content responsive-container responsive-container-inline-padding`}
      >
        <div className={styles["left-column"]}>
          <h2 className="heading">About me</h2>

          <p className={styles.about}>
            My name is Grzegorz Rozdzialik (pronounced “Rossgialik”), but I go
            by <span className={styles.accent}>Greg</span>. I am a Staff
            Software Engineer working at{" "}
            <a
              href="https://www.enterprisedb.com/"
              target="_blank"
              rel="noreferrer"
            >
              EDB
            </a>
            .
          </p>
        </div>

        <div className={styles["hero-image-container"]}>
          <Image
            className={styles["hero-image"]}
            src={meImage}
            alt="A picture of me in Vienna"
            placeholder="blur"
          />
        </div>

        <div className={styles["left-column"]}>
          <p className={styles.about}>
            My primary interests are frontend-related, but recently I found
            myself pulled towards Rust more often.
          </p>

          <p className={styles.about}>
            Outside of work, I enjoy weightlifting, reading books, and
            snowboarding.
          </p>

          <p className={styles.about}>
            You can find more of my work on{" "}
            <a href="https://github.com/Gelio" target="_blank" rel="noreferrer">
              my GitHub profile
            </a>
            .
          </p>
        </div>
      </main>
    </Layout>
  );
};
