import Link from "next/link";
import {
  ArticleHeader,
  StyledArticleContainer,
  StyledArticleParagraph,
  StyledArticleParagraphLink,
  StyledArticleSection,
  StyledArticleSectionHeading,
} from "../components/ArticlePage";
import { Layout } from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <StyledArticleContainer>
        <ArticleHeader
          title="Blog hosting decisions"
          readingDuration="14 minute read"
          createdDate="2022-04-09"
          tagNames={["blog", "architecture", "frontend"]}
        />

        <StyledArticleSection>
          <StyledArticleParagraph>
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
          </StyledArticleParagraph>
        </StyledArticleSection>

        <StyledArticleSection>
          <StyledArticleSectionHeading>
            Some heading
          </StyledArticleSectionHeading>
          <StyledArticleParagraph>
            Pellentesque id justo vehicula, accumsan tellus eget, ultrices ante.
            Mauris ut turpis ut libero vehicula dapibus. Nunc eget dapibus{" "}
            <Link href="/abc" passHref>
              <StyledArticleParagraphLink>massa</StyledArticleParagraphLink>
            </Link>
            . Suspendisse potenti. Pellentesque venenatis rhoncus justo, id
            condimentum ante auctor at. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Praesent venenatis tortor sed sollicitudin
            fermentum. Vestibulum facilisis consectetur lorem, et mattis metus
            auctor ac. Fusce sit amet diam dictum, varius est quis, feugiat
            turpis. Aliquam et semper erat, sed pretium dolor. Nam fermentum
            orci in leo congue sollicitudin. Mauris imperdiet viverra velit.
          </StyledArticleParagraph>
          <StyledArticleParagraph>
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
          </StyledArticleParagraph>
          <StyledArticleParagraph>
            Morbi hendrerit id diam a cursus. Curabitur dapibus euismod tempus.
            Nunc tempus nulla vel pharetra sollicitudin. Praesent dictum risus
            sit amet tristique laoreet.
          </StyledArticleParagraph>
        </StyledArticleSection>

        <StyledArticleSection>
          <StyledArticleSectionHeading>
            Some heading
          </StyledArticleSectionHeading>
          <StyledArticleParagraph>
            Pellentesque id justo vehicula, accumsan tellus eget, ultrices ante.
            Mauris ut turpis ut libero vehicula dapibus. Nunc eget dapibus{" "}
            <Link href="/abc" passHref>
              <StyledArticleParagraphLink>massa</StyledArticleParagraphLink>
            </Link>
            . Suspendisse potenti. Pellentesque venenatis rhoncus justo, id
            condimentum ante auctor at. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Praesent venenatis tortor sed sollicitudin
            fermentum. Vestibulum facilisis consectetur lorem, et mattis metus
            auctor ac. Fusce sit amet diam dictum, varius est quis, feugiat
            turpis. Aliquam et semper erat, sed pretium dolor. Nam fermentum
            orci in leo congue sollicitudin. Mauris imperdiet viverra velit.
          </StyledArticleParagraph>
          <StyledArticleParagraph>
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
          </StyledArticleParagraph>
          <StyledArticleParagraph>
            Morbi hendrerit id diam a cursus. Curabitur dapibus euismod tempus.
            Nunc tempus nulla vel pharetra sollicitudin. Praesent dictum risus
            sit amet tristique laoreet.
          </StyledArticleParagraph>
        </StyledArticleSection>
      </StyledArticleContainer>
    </Layout>
  );
};

export default Home;
