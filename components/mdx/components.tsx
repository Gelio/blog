import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type HTMLProps,
  type ReactNode,
} from "react";
import type { Route } from "next";
import styles from "./components.module.css";

// MDX components
// @see https://nextjs.org/docs/pages/guides/mdx#add-an-mdx-componentstsx-file

const MDXLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) =>
  props.href ? (
    <Link {...props} href={props.href as Route} />
  ) : (
    (() => {
      throw new Error("Link does not have a href");
    })()
  );

const MDXImage = (props: HTMLProps<HTMLImageElement>) => (
  <Image
    {...props}
    className={styles["responsive-image"]}
    // NOTE: required to fix a TS error
    src={props.src as string}
    // NOTE: required to tell ESLint we do pass `alt`
    alt={props.alt as string}
    // NOTE: required to fix a TS error
    width={props.width as number}
    height={props.height as number}
    // TODO: implement blur placeholders for all photos
    placeholder="empty"
  />
);

const BlockQuote = ({ children }: { children: ReactNode }) => {
  return <blockquote className={styles.blockquote}>{children}</blockquote>;
};

const InsideCodeBlockContext = createContext(false);

const Pre = (props: HTMLAttributes<HTMLPreElement>) => {
  return (
    <InsideCodeBlockContext.Provider value={true}>
      <pre {...props} className={`${props.className} ${styles.pre}`} />
    </InsideCodeBlockContext.Provider>
  );
};

const InlineCode = (props: HTMLAttributes<HTMLElement>) => {
  const insideCodeBlock = useContext(InsideCodeBlockContext);

  return (
    <code
      {...props}
      className={`${props.className} ${insideCodeBlock ? undefined : styles.code}`}
    />
  );
};

const ListItem = ({ children }: { children: ReactNode }) => {
  return <li className={styles["list-item"]}>{children}</li>;
};

export const baseMDXComponents = {
  a: MDXLink,
  img: MDXImage,
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className={styles.h2}>{children}</h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className={styles.h3}>{children}</h3>
  ),
  blockquote: BlockQuote,
  code: InlineCode,
  pre: Pre,
  li: ListItem,
};
