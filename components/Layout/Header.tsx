import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { githubProfileLink } from "../../consts";
import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { decorationOnHoverLinkStyle } from "../../styles/typography";
import { aboutPagePath } from "../AboutPage/route";
import { homePagePath } from "../HomePage/route";
import { topicsPagePath } from "../TopicsPage/route";

export const Header = () => {
  return (
    <StyledHeader>
      <HeaderLinks>
        <StyledBlogTitle href={homePagePath}>Greg Rozdzialik</StyledBlogTitle>

        <Sublinks>
          <StyledHeaderLink href={topicsPagePath}>Topics</StyledHeaderLink>

          <StyledHeaderLink href={aboutPagePath}>About</StyledHeaderLink>
        </Sublinks>
      </HeaderLinks>

      <Sublinks>
        <StyledIconLink
          href="/rss.xml"
          target="_blank"
          rel="noopener"
          aria-label="RSS feed for the blog"
        >
          <RSSIcon />
        </StyledIconLink>
        <StyledIconLink
          href={githubProfileLink}
          target="_blank"
          rel="noopener"
          aria-label="My GitHub profile"
        >
          <GitHubIcon />
        </StyledIconLink>
      </Sublinks>
    </StyledHeader>
  );
};

const StyledHeader = styled("header")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBlockStart: theme.spacing(1),
    paddingBlock: theme.spacing(1),
  })
);

const StyledHeaderLink = styled(Link)(
  decorationOnHoverLinkStyle,
  ({ theme }) => ({
    color: theme.color.primary.main,
    fontSize: theme.pxToRem(20),
  })
);

const StyledBlogTitle = styled(StyledHeaderLink)(({ theme }) => ({
  fontSize: theme.pxToRem(24),
}));

const HeaderLinks = styled("nav")(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: theme.spacing(3),
  flexWrap: "wrap",
}));

const Sublinks = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

const GitHubIcon = () => {
  const theme = useTheme();
  const size = theme.spacing(3);

  return (
    <Image
      alt="GitHub logo"
      src="/images/github.svg"
      width={size}
      height={size}
    />
  );
};

const StyledIconLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  transition: "filter ease-in-out 200ms",
  "--shadowRadius": "1px",
  filter: `drop-shadow(0 0 var(--shadowRadius) ${theme.color.shadow()})`,
  ":hover": {
    "--shadowRadius": "2px",
  },
}));

const RSSIcon = () => {
  const theme = useTheme();
  const size = theme.spacing(3);

  return (
    <Image
      alt="RSS feed icon"
      src="/images/rss.svg"
      width={size}
      height={size}
    />
  );
};
