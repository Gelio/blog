import styled from "@emotion/styled";
import type { Components as MDXComponents } from "@mdx-js/react/lib";
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext } from "react";
import { rem, spacing } from "../../styles/theme";
import {
  ArticleHeading2,
  ArticleHeading3,
  Paragraph,
  ParagraphLink,
} from "../text";

export const MDXLink: MDXComponents["a"] = (props) =>
  props.href ? (
    <Link href={props.href} passHref>
      <ParagraphLink {...props} />
    </Link>
  ) : (
    (() => {
      throw new Error("Link does not have a href");
    })()
  );

export const MDXImage: MDXComponents["img"] = (props) => (
  <Image
    // NOTE: required to fix a TS error
    src={props.src as string}
    // NOTE: required to tell ESLint we do pass `alt`
    alt={props.alt}
    {...props}
    layout="responsive"
    // TODO: implement blur placeholders for all photos
    placeholder="empty"
  />
);

export const BlockQuote = styled("blockquote")(({ theme }) => ({
  borderInlineStart: "solid 3px",
  borderColor: theme.color.primary.main,

  marginInlineStart: rem(spacing(1)),
  paddingInlineStart: rem(spacing(2)),
}));

const InsideCodeBlockContext = createContext(false);

export const Pre: MDXComponents["pre"] = (props) => {
  return (
    <InsideCodeBlockContext.Provider value={true}>
      <pre {...props} />
    </InsideCodeBlockContext.Provider>
  );
};

export const StyledInlineCode = styled("code")(({ theme }) => ({
  backgroundColor: theme.color.text.main,
  color: theme.color.primary.light,
  borderRadius: spacing(1),
  paddingBlock: spacing(0.25),
  paddingInline: spacing(0.5),
  wordBreak: "break-word",
}));

export const InlineCode: MDXComponents["code"] = (props) => {
  const insideCodeBlock = useContext(InsideCodeBlockContext);

  if (insideCodeBlock) {
    return <code {...props} />;
  } else {
    return <StyledInlineCode {...props} />;
  }
};

export const ListItem = styled("li")({
  marginBlockEnd: spacing(2),
  fontSize: rem(18),
});

export const baseMDXComponents = {
  a: MDXLink,
  p: Paragraph,
  img: MDXImage,
  h2: ArticleHeading2,
  h3: ArticleHeading3,
  blockquote: BlockQuote,
  code: InlineCode,
  pre: Pre,
  li: ListItem,
};
