import { apply, array, option, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import path from "path";
import { readAllArticlesIndex, ReadAllArticlesIndexError } from "./indexes";
import { safeWriteFile } from "./indexes/utils";
import { getSiteURL } from "./utils";

const rssFeedFilePath = () => path.join("public", "rss.xml");

const createRSSFeed = pipe(
  apply.sequenceT(taskEither.ApplyPar)(
    readAllArticlesIndex,
    taskEither.fromIO<
      // NOTE: need manual type annotations because otherwise type inference
      // infers incompatible error type
      URL,
      ReadAllArticlesIndexError
    >(getSiteURL)
  ),
  taskEither.map(([allArticles, siteURL]) => {
    const rssItems = allArticles.map((article) =>
      getRSSItem({
        title: article.title,
        date: new Date(article.date),
        // TODO: possibly strip out Markdown
        description: article.summary,
        url: `${siteURL}article/${article.slug}`,
      })
    );

    const latestArticleDate = pipe(
      array.head(allArticles),
      option.map((article) => new Date(article.date))
    );

    const rssChannel = getRSSChannel({
      url: siteURL.toString(),
      latestArticleDate,
      items: rssItems,
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
${rssChannel}
</rss>`;
  }),
  taskEither.bindTo("rssFeedContent"),
  taskEither.apS("rssFeedFilePath", taskEither.fromIO(rssFeedFilePath)),
  taskEither.chainFirstW(({ rssFeedFilePath, rssFeedContent }) =>
    safeWriteFile(rssFeedFilePath, rssFeedContent)
  )
);

pipe(
  createRSSFeed,
  taskEither.match(
    (error) => {
      console.log("Error while creating an RSS feed");
      console.log(error);
    },
    ({ rssFeedFilePath }) =>
      console.log("RSS feed created successfully at ", rssFeedFilePath)
  )
)();

/**
 * Prepare the `channel` XML tag for the RSS feed.
 * The channel corresponds to the entire blog.
 *
 * @see https://validator.w3.org/feed/docs/rss2.html
 */
const getRSSChannel = ({
  url,
  latestArticleDate: maybeLatestArticleDate,
  items,
}: {
  url: string;
  /** `None` if there are no articles */
  latestArticleDate: option.Option<Date>;
  items: string[];
}) => `<channel>
<title>Greg Rozdzialik's blog</title>
<link>${url}</link>
<description>Articles about stuff I find interesting. Mostly frontend and tech-related.</description>
<language>en-us</language>
<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
<atom:link href="${url}rss.xml" rel="self" type="application/rss+xml" />
${pipe(
  maybeLatestArticleDate,
  option.match(
    () => "",
    (latestArticleDate) =>
      `<pubDate>${latestArticleDate.toUTCString()}</pubDate>`
  )
)}

${items.join("\n")}
</channel>
`;

/**
 * Prepare the `item` XML tag for the RSS feed.
 * One item corresponds to one article.
 *
 * @see https://validator.w3.org/feed/docs/rss2.html
 */
const getRSSItem = ({
  title,
  date,
  description,
  url,
}: {
  title: string;
  date: Date;
  description: string;
  url: string;
}) => `<item>
  <title>${title}</title>
  <link>${url}</link>
  <description>${description}</description>
  <pubDate>${date.toUTCString()}</pubDate>
  <guid>${url}</guid>
</item>`;
