import styled from "@emotion/styled";
import Image from "next/image";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { containerWidth } from "../../styles/theme";
import { headingStyle } from "../../styles/typography";
import { Layout } from "../Layout";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import { Paragraph, ParagraphLink } from "../text";
import meImage from "../../public/images/me.jpg";

export const AboutPage = () => {
  return (
    <Layout>
      <HeadDocumentTitle>About me</HeadDocumentTitle>
      <HeadMetaDescription>
        Information about Grzegorz Rozdzialik, the blog author.
      </HeadMetaDescription>

      <StyledMainContent>
        <StyledAlwaysLeftColumn>
          <StyledPageHeading>About me</StyledPageHeading>

          <StyledAboutParagraph>
            My name is Grzegorz Rozdzialik (pronounced “Rossgialik”), but I go
            by <StyledAccent>Greg</StyledAccent>. I am a Senior Software
            Engineer working at{" "}
            <ParagraphLink href="https://www.splitgraph.com/">
              Splitgraph
            </ParagraphLink>
            .
          </StyledAboutParagraph>
        </StyledAlwaysLeftColumn>

        <StyledHeroImageContainer>
          <StyledHeroImage
            src={meImage}
            alt="A picture of me in Vienna"
            width={4000}
            height={2250}
            layout="responsive"
            placeholder="blur"
          />
        </StyledHeroImageContainer>

        <StyledAlwaysLeftColumn>
          <StyledAboutParagraph>
            My primary interests are frontend-related, but recently I found
            myself pulled towards Rust more often.
          </StyledAboutParagraph>

          <StyledAboutParagraph>
            Outside of work, I enjoy weightlifting, reading books, and
            snowboarding.
          </StyledAboutParagraph>

          <StyledAboutParagraph>
            You can find more of my work on{" "}
            <ParagraphLink href="https://github.com/Gelio">
              my GitHub profile
            </ParagraphLink>
            .
          </StyledAboutParagraph>
        </StyledAlwaysLeftColumn>
      </StyledMainContent>
    </Layout>
  );
};

const mediaQueries = {
  portraitPhotoMobile: "@media (max-width: 500px)",
  desktop: `@media (min-width: ${containerWidth})`,
};

const StyledMainContent = styled("main")(
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
  ({ theme }) => ({
    display: "grid",
    columnGap: theme.spacing(2),
    [mediaQueries.desktop]: {
      gridTemplateColumns: "repeat(2, 1fr)",
      // NOTE: keep the second row of text close to the first row,
      // so the paragraphs appear as a single column.
      gridTemplateRows: "min-content 1fr",
    },
  })
);

const StyledAlwaysLeftColumn = styled("div")({
  gridColumn: 1,
});

const StyledPageHeading = styled("h2")(headingStyle);

const StyledAccent = styled("span")(({ theme }) => ({
  color: theme.color.primary.main,
}));

const StyledAboutParagraph = styled(Paragraph)(({ theme }) => ({
  marginBlockEnd: theme.spacing(1),
}));

const portraitPhotoStyles = {
  container: {
    "> span": {
      // NOTE: need to override the style applied directly to the element using
      // the `style` attribute
      overflow: "visible !important",
    },

    "::after": {
      display: "block",
      content: "''",
      paddingBlockStart: "56.5%",
    },
  },
  image: {
    transform: `scale(2.15) translate(-5%, 21%)`,
  },
};

// NOTE: next/image is comprised of many elements but only the innermost `img`
// can be styled. This results in clipped box-shadow of the image. Thus, those
// properties must be applied through a container.
const StyledHeroImageContainer = styled("div")(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: `${theme.shadow(0.5)} ${theme.color.shadow(0.3)}`,
  overflow: "hidden",
  marginBlockEnd: theme.spacing(2),
  gridColumn: 1,

  [mediaQueries.portraitPhotoMobile]: portraitPhotoStyles.container,
  [mediaQueries.desktop]: {
    ...portraitPhotoStyles.container,
    gridColumn: 2,
    gridRow: "1 / 3",
  },
}));

const StyledHeroImage = styled(Image)({
  transform: `scale(1.15) translate(-5%, -5%)`,

  [mediaQueries.portraitPhotoMobile]: portraitPhotoStyles.image,
  [mediaQueries.desktop]: portraitPhotoStyles.image,
});
