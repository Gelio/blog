import styled from "@emotion/styled";
import Image from "next/image";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { headingStyle } from "../../styles/typography";
import {
  StyledArticleParagraph,
  StyledArticleParagraphLink,
} from "../ArticlePage/styled-components";
import { Layout } from "../Layout";

export const AboutPage = () => {
  return (
    <Layout>
      <StyledMainContent>
        <StyledPageHeading>About me</StyledPageHeading>

        <StyledAboutParagraph>
          My name is Grzegorz Rozdzialik (pronounced “Rossgialik”), but I go by{" "}
          <StyledAccent>Greg</StyledAccent>. I am a Senior Software Engineer
          working at{" "}
          <StyledArticleParagraphLink href="https://www.splitgraph.com/">
            Splitgraph
          </StyledArticleParagraphLink>
          .
        </StyledAboutParagraph>

        <StyledHeroImageContainer>
          {/* TODO: clip the image on both mobile and desktop */}
          {/* TODO: change the layout on desktop */}
          <Image
            src="/images/me.jpg"
            alt="A picture of me in Vienna"
            width={4000}
            height={2250}
            layout="responsive"
          />
        </StyledHeroImageContainer>

        <StyledAboutParagraph>
          My primary interests are frontend-related, but recently I found myself
          pulled towards Rust more often.
        </StyledAboutParagraph>

        <StyledAboutParagraph>
          Outside of work, I enjoy weightlifting, reading books, and
          snowboarding.
        </StyledAboutParagraph>

        <StyledAboutParagraph>
          You can find more of my work on{" "}
          <StyledArticleParagraphLink href="https://github.com/Gelio">
            my GitHub profile
          </StyledArticleParagraphLink>
          .
        </StyledAboutParagraph>
      </StyledMainContent>
    </Layout>
  );
};

const StyledMainContent = styled("main")(
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding
);

const StyledPageHeading = styled("h2")(headingStyle);

const StyledAccent = styled("span")(({ theme }) => ({
  color: theme.color.primary.main,
}));

const StyledAboutParagraph = styled(StyledArticleParagraph)({
  marginBlockEnd: rem(spacing(1)),
});

// NOTE: next/image is comprised of many elements but only the innermost `img`
// can be styled. This results in clipped box-shadow of the image. Thus, those
// properties must be applied through a container.
const StyledHeroImageContainer = styled("div")({
  borderRadius: rem(spacing(2)),
  boxShadow: `${rem(4)} ${rem(4)} ${rem(4)} rgba(0, 0, 0, 0.25)`,
  overflow: "hidden",
  marginBlockEnd: rem(spacing(2)),
});
