import Link from "next/link";
import {
  ArticleHeader,
  StyledArticleContainer,
  StyledArticleParagraph,
  StyledArticleParagraphLink,
  StyledArticleSection,
  StyledArticleSectionHeading,
} from "../../components/ArticlePage";
import { Layout } from "../../components/Layout";
import Post from "../../content/2022/06/11-simple-post.mdx";

const ArticlePage = () => {
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
          <Post
            components={{
              a: (props) =>
                props.href ? (
                  <Link href={props.href} passHref>
                    <StyledArticleParagraphLink {...props} />
                  </Link>
                ) : (
                  (() => {
                    throw new Error("Link does not have a href");
                  })()
                ),
              p: StyledArticleParagraph,
              h2: StyledArticleSectionHeading,
            }}
          />
        </StyledArticleSection>
      </StyledArticleContainer>
    </Layout>
  );
};

export default ArticlePage;
