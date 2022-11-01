import styled from "@emotion/styled";
import type { Components as MDXComponents } from "@mdx-js/react/lib";
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext } from "react";
import {
  ArticleHeading2,
  ArticleHeading3,
  Paragraph,
  ParagraphLink,
} from "../text";

export const MDXLink: MDXComponents["a"] = (props) =>
  props.href ? (
    <Link href={props.href} passHref legacyBehavior>
      <ParagraphLink {...props} />
    </Link>
  ) : (
    (() => {
      throw new Error("Link does not have a href");
    })()
  );

const ResponsiveImage = styled(Image)({
  maxWidth: "100%",
  height: "100%",
});

export const MDXImage: MDXComponents["img"] = (props) => (
  <ResponsiveImage
    {...props}
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

export const BlockQuote = styled("blockquote")(({ theme }) => ({
  borderInlineStart: "solid 3px",
  borderColor: theme.color.primary.main,

  marginInlineStart: theme.spacing(1),
  paddingInlineStart: theme.spacing(2),
}));

const InsideCodeBlockContext = createContext(false);

export const Pre: MDXComponents["pre"] = (props) => {
  return (
    <InsideCodeBlockContext.Provider value={true}>
      <StyledPre {...props} />
    </InsideCodeBlockContext.Provider>
  );
};

const StyledPre = styled("pre")(({ theme }) => ({
  boxShadow: `${theme.shadow(0.25)} ${theme.color.shadow(0.4)}`,
}));

export const StyledInlineCode = styled("code")(({ theme }) => ({
  backgroundColor: theme.color.text.onDarkBackground,
  border: `solid 1px ${theme.color.background.light}`,
  borderRadius: theme.spacing(1),
  paddingBlock: theme.spacing(0.25),
  paddingInline: theme.spacing(0.5),
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

export const ListItem = styled("li")(({ theme }) => ({
  marginBlockEnd: theme.spacing(2),
  fontSize: theme.pxToRem(18),
}));

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
