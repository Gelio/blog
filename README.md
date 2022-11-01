# My blog

The repository contains the content and code behind
[my blog](https://www.gregroz.me).

## Tech stack

The blog is a [Next.js](https://nextjs.org/) application. The content is written
in [MDX](https://mdxjs.com/) in [the content directory](./content).

The content is first indexed by [the content-indexer](./content-processing).
This prepares the indexes that the Next.js application later uses to quickly
serve the content.

## Development

Install the dependencies and start the development server:

```sh
npm install
npm run create-indexes
npm run dev
```

Modifying the content will not re-create the indexes or trigger live-reload
automatically. If you want these features, run:

```sh
npm run dev:content
```
