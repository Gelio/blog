import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { githubProfileLink } from "../../consts";
import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { decorationOnHoverLinkStyle } from "../../styles/typography";
import { homePagePath } from "../HomePage";
import { topicsPagePath } from "../TopicsPage";

export const Header = () => {
  return (
    <StyledHeader>
      <HeaderLinks>
        <Link href={homePagePath} passHref>
          <StyledBlogTitle>Greg Rozdzialik</StyledBlogTitle>
        </Link>

        <Sublinks>
          <Link href={topicsPagePath} passHref>
            <StyledHeaderLink>Topics</StyledHeaderLink>
          </Link>

          <Link href="/about" passHref>
            <StyledHeaderLink>About</StyledHeaderLink>
          </Link>
        </Sublinks>
      </HeaderLinks>

      <StyledGitHubLink href={githubProfileLink}>
        <GitHubIcon />
      </StyledGitHubLink>
    </StyledHeader>
  );
};

const StyledHeader = styled("header")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBlockStart: rem(spacing(1)),
    paddingBlock: rem(spacing(1)),
  }
);

const StyledHeaderLink = styled("a")(
  decorationOnHoverLinkStyle,
  ({ theme }) => ({
    color: theme.color.primary.main,
    fontSize: rem(20),
  })
);

const StyledBlogTitle = styled(StyledHeaderLink)({
  fontSize: rem(24),
});

const HeaderLinks = styled("nav")({
  display: "flex",
  alignItems: "baseline",
  gap: rem(spacing(3)),
});

const Sublinks = styled("div")({
  display: "flex",
  gap: rem(spacing(2)),
});

const GitHubIcon = () => {
  const size = spacing(3);

  return (
    <Image
      alt="GitHub logo"
      src="/images/github.svg"
      width={size}
      height={size}
    />
  );
};

const StyledGitHubLink = styled("a")(({ theme }) => ({
  textDecoration: "none",
  transition: "filter ease-in-out 200ms",
  "--shadowRadius": "1px",
  filter: `drop-shadow(0px 0px var(--shadowRadius) ${theme.color.text.main})`,
  ":hover": {
    "--shadowRadius": "2px",
  },
}));
