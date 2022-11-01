import styled from "@emotion/styled";
import Link from "next/link";
import { getTopicPagePath } from "../TopicPage";

interface TagsProps {
  names: string[];
}

export const Tags = ({ names }: TagsProps) => (
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

const Tag = ({ name }: { name: string }) => (
  <StyledTagLink href={getTopicPagePath(name)} aria-label={`Topic: ${name}`}>
    {name}
  </StyledTagLink>
);

const StyledTagLink = styled(Link)(({ theme }) => ({
  textDecoration: "underline",
  transition: "color 200ms ease-in-out",
  ":hover": {
    color: theme.color.primary.main,
  },
}));
