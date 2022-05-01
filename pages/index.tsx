import styled from "@emotion/styled";
import Link from "next/link";
import { Layout } from "../components/Layout";
import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../styles/layout";
import { rem, spacing } from "../styles/theme";

const Home = () => {
  return (
    <Layout>
      <StyledArticleContainer>
        <StyledArticleHeader>
          <StyledArticleTitle>Blog hosting decisions</StyledArticleTitle>

          <StyledArticleMetaContainer>
            <StyledArticleMetaItem>2022-04-09</StyledArticleMetaItem>
            <StyledArticleMetaItem>14 minute read</StyledArticleMetaItem>
            <StyledArticleMetaItem>
              <Tags names={["blog", "architecture", "frontend"]} />
            </StyledArticleMetaItem>
          </StyledArticleMetaContainer>
        </StyledArticleHeader>

        <StyledSection>
          <StyledParagraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex
            elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus
            a turpis sem. Curabitur viverra maximus luctus. Nullam id lacus non
            mauris iaculis sollicitudin quis nec sem. Cras maximus luctus augue
            sit amet porta. Curabitur id felis vel ligula rhoncus dictum sit
            amet sed lorem. Quisque lacinia faucibus purus, ac placerat urna
            tempus a. Maecenas porta tincidunt quam, eu volutpat nisi fermentum
            eget. Suspendisse in mauris finibus, efficitur ex nec, varius
            sapien. Nunc fermentum, nisl at interdum varius, odio diam sodales
            mi, ut mattis metus nibh vitae elit. Phasellus in ultrices ex. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum,
            dolor id tincidunt aliquet, eros orci pulvinar nisl, a bibendum eros
            quam et sem.
          </StyledParagraph>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeading>Some heading</StyledSectionHeading>
          <StyledParagraph>
            Pellentesque id justo vehicula, accumsan tellus eget, ultrices ante.
            Mauris ut turpis ut libero vehicula dapibus. Nunc eget dapibus{" "}
            <Link href="/abc" passHref>
              <StyledParagraphLink>massa</StyledParagraphLink>
            </Link>
            . Suspendisse potenti. Pellentesque venenatis rhoncus justo, id
            condimentum ante auctor at. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Praesent venenatis tortor sed sollicitudin
            fermentum. Vestibulum facilisis consectetur lorem, et mattis metus
            auctor ac. Fusce sit amet diam dictum, varius est quis, feugiat
            turpis. Aliquam et semper erat, sed pretium dolor. Nam fermentum
            orci in leo congue sollicitudin. Mauris imperdiet viverra velit.
          </StyledParagraph>
          <StyledParagraph>
            Nulla condimentum magna eu neque cursus pellentesque. Etiam orci
            enim, porta efficitur sagittis et, vestibulum nec ligula.
            Pellentesque sed tincidunt ligula, ut condimentum mauris. Sed nulla
            eros, varius id viverra a, malesuada et lorem. Curabitur turpis
            libero, elementum ut diam quis, gravida tempor leo. Suspendisse
            vestibulum convallis sem in tempus. Sed dolor lectus, ultrices quis
            pretium vitae, viverra sed nisi. Donec tincidunt nisi nec
            consectetur fringilla. Maecenas elementum quis ante maximus
            tincidunt. Aliquam varius sem a risus commodo, sed finibus mi
            tempor. Aliquam urna velit, scelerisque sit amet turpis vitae,
            varius laoreet nunc. Duis non leo vitae dolor mattis feugiat.
            Vestibulum in porta sem. Sed vehicula a elit vitae rhoncus. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla ut
            dui sed tincidunt.
          </StyledParagraph>
          <StyledParagraph>
            Morbi hendrerit id diam a cursus. Curabitur dapibus euismod tempus.
            Nunc tempus nulla vel pharetra sollicitudin. Praesent dictum risus
            sit amet tristique laoreet.
          </StyledParagraph>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeading>Some heading</StyledSectionHeading>
          <StyledParagraph>
            Pellentesque id justo vehicula, accumsan tellus eget, ultrices ante.
            Mauris ut turpis ut libero vehicula dapibus. Nunc eget dapibus{" "}
            <Link href="/abc" passHref>
              <StyledParagraphLink>massa</StyledParagraphLink>
            </Link>
            . Suspendisse potenti. Pellentesque venenatis rhoncus justo, id
            condimentum ante auctor at. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Praesent venenatis tortor sed sollicitudin
            fermentum. Vestibulum facilisis consectetur lorem, et mattis metus
            auctor ac. Fusce sit amet diam dictum, varius est quis, feugiat
            turpis. Aliquam et semper erat, sed pretium dolor. Nam fermentum
            orci in leo congue sollicitudin. Mauris imperdiet viverra velit.
          </StyledParagraph>
          <StyledParagraph>
            Nulla condimentum magna eu neque cursus pellentesque. Etiam orci
            enim, porta efficitur sagittis et, vestibulum nec ligula.
            Pellentesque sed tincidunt ligula, ut condimentum mauris. Sed nulla
            eros, varius id viverra a, malesuada et lorem. Curabitur turpis
            libero, elementum ut diam quis, gravida tempor leo. Suspendisse
            vestibulum convallis sem in tempus. Sed dolor lectus, ultrices quis
            pretium vitae, viverra sed nisi. Donec tincidunt nisi nec
            consectetur fringilla. Maecenas elementum quis ante maximus
            tincidunt. Aliquam varius sem a risus commodo, sed finibus mi
            tempor. Aliquam urna velit, scelerisque sit amet turpis vitae,
            varius laoreet nunc. Duis non leo vitae dolor mattis feugiat.
            Vestibulum in porta sem. Sed vehicula a elit vitae rhoncus. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla ut
            dui sed tincidunt.
          </StyledParagraph>
          <StyledParagraph>
            Morbi hendrerit id diam a cursus. Curabitur dapibus euismod tempus.
            Nunc tempus nulla vel pharetra sollicitudin. Praesent dictum risus
            sit amet tristique laoreet.
          </StyledParagraph>
        </StyledSection>
      </StyledArticleContainer>
    </Layout>
  );
};

const StyledArticleContainer = styled("article")({
  marginBlockStart: rem(spacing(2)),
});

const StyledArticleHeader = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  {
    marginBlockEnd: rem(spacing(2)),
  }
);

const StyledArticleTitle = styled("h1")({
  fontWeight: "normal",
  fontSize: rem(28),
  // NOTE: reset the default margin-block-start
  marginBlockStart: 0,
  marginBlockEnd: rem(spacing(1)),
});

const StyledArticleMetaContainer = styled("div")({
  display: "flex",
  columnGap: rem(spacing(4)),
  rowGap: rem(spacing(1)),
  flexWrap: "wrap",
});

const StyledArticleMetaItem = styled("span")(({ theme }) => ({
  color: theme.color.text.desaturated,
  fontSize: rem(16),
}));

const StyledTagLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  transition: "color 200ms ease-in-out",
  ":hover": {
    color: theme.color.primary.main,
  },
}));

const Tag = ({ name }: { name: string }) => (
  <Link href={`/topic/${name}`} passHref>
    <StyledTagLink>{name}</StyledTagLink>
  </Link>
);

const Tags = ({ names }: { names: string[] }) => (
  <>
    {names
      .flatMap((name) => [
        <Tag key={name} name={name} />,
        <span key={`${name}-separator`}>, </span>,
      ])
      // NOTE: trim the final comma
      .slice(0, -1)}
  </>
);

const StyledSection = styled("section")(
  responsiveContainer,
  responsiveContainerInlinePadding
);
const StyledParagraph = styled("p")({
  lineHeight: 1.5,
  marginBlockStart: 0,
});

const StyledSectionHeading = styled("h2")({
  fontSize: rem(20),
  marginBlockStart: rem(spacing(4)),
  marginBlockEnd: rem(spacing(1)),
  fontWeight: "normal",
});

const StyledParagraphLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.color.primary.main,
}));

export default Home;
