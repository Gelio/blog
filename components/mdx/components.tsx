import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type HTMLProps,
} from "react";
import {
  ArticleHeading2,
  ArticleHeading3,
  Paragraph,
  ParagraphLink,
} from "../text";

// MDX components
// @see https://nextjs.org/docs/pages/guides/mdx#add-an-mdx-componentstsx-file

export const MDXLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) =>
  props.href ? (
    <Link
      href={props.href}
      passHref
      // TODO: remove `legacyBehavior` prop
      legacyBehavior
    >
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

export const MDXImage = (props: HTMLProps<HTMLImageElement>) => (
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

export const Pre = (props: HTMLAttributes<HTMLPreElement>) => {
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

export const InlineCode = (props: HTMLAttributes<HTMLElement>) => {
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
