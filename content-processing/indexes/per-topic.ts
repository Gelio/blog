import { array, either, string, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import path from "path";
import { z } from "zod";
import { ArticleWithMetadata } from "../parse-articles";
import { safeParseSchema } from "../utils";
import {
  articleWithMetadataSchema,
  ensureParentDirectoryExists,
  FileWriteError,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

const topicsIndexesDirectoryName = "topics";
const topicsIndexFileName = "topics.json";

// TODO: add topic descriptions to indexes

type TopicsWithArticlesMap = Map<string, ArticleWithMetadata[]>;

export const createTopicIndexes = (
  articlesWithMetadata: readonly ArticleWithMetadata[]
) =>
  pipe(
    taskEither.rightIO(() => {
      const topicsWithArticlesMap: TopicsWithArticlesMap = new Map();

      articlesWithMetadata.forEach((articleWithMetadata) => {
        articleWithMetadata.articleMetadata.tags.forEach((tag) => {
          const articlesForTopic = topicsWithArticlesMap.get(tag);
          if (articlesForTopic) {
            articlesForTopic.push(articleWithMetadata);
          } else {
            topicsWithArticlesMap.set(tag, [articleWithMetadata]);
          }
        });
      });

      return topicsWithArticlesMap;
    }),
    taskEither.chainW((topicsWithArticleMap) =>
      pipe(
        createPerTopicIndexes(topicsWithArticleMap),
        taskEither.apFirstW(createTopicsSummary(topicsWithArticleMap))
      )
    ),
    taskEither.map(() => undefined)
  );

const getTopicIndexPath = (topicName: string) =>
  getIndexFilePath(path.join(topicsIndexesDirectoryName, `${topicName}.json`));

const createPerTopicIndexes = (topicsWithArticlesMap: TopicsWithArticlesMap) =>
  pipe(
    taskEither.rightIO(getTopicIndexPath("any")),
    taskEither.chainW(ensureParentDirectoryExists),
    taskEither.mapLeft(
      (error) =>
        ({
          type: "cannot-create-indexes-parent-directory",
          error,
        } as const)
    ),
    taskEither.chainW(() =>
      pipe(
        Array.from(topicsWithArticlesMap.entries()).map(([topic, articles]) =>
          pipe(
            taskEither.rightIO(getTopicIndexPath(topic)),
            taskEither.chain((indexFilePath) =>
              safeWriteIndex(indexFilePath, articles)
            ),
            taskEither.mapLeft((error): [TopicIndexWriteError] => [
              {
                type: "cannot-write-topic-index",
                topic,
                error,
              },
            ])
          )
        ),
        array.sequence(
          taskEither.getApplicativeTaskValidation(
            task.ApplyPar,
            array.getSemigroup<TopicIndexWriteError>()
          )
        ),
        taskEither.bimap(
          (errors) =>
            ({
              type: "cannot-write-topic-indexes",
              errors,
            } as const),
          () => undefined
        )
      )
    )
  );

const topicIndexSchema = z.array(articleWithMetadataSchema);

export type TopicIndex = z.infer<typeof topicIndexSchema>;

type ExtractLeftFromEither<T> = T extends either.Left<infer E> ? E : never;
export type ReadTopicIndexError = ExtractLeftFromEither<
  Awaited<ReturnType<ReturnType<typeof readTopicIndex>>>
>;

export const readTopicIndex = (topicName: string) =>
  pipe(
    taskEither.rightIO(getTopicIndexPath(topicName)),
    taskEither.chainW(safeReadIndex),
    taskEither.chainEitherKW((rawTopicIndex) =>
      pipe(
        safeParseSchema(topicIndexSchema, rawTopicIndex),
        either.mapLeft(
          (error) =>
            ({
              type: "topic-index-parse-error",
              topicName,
              error,
            } as const)
        )
      )
    )
  );

export const readTopicsSummaryIndex = pipe(
  taskEither.rightIO(getIndexFilePath(topicsIndexFileName)),
  taskEither.chainW(safeReadIndex),
  taskEither.map((data) => data as string[])
);

const createTopicsSummary = (topicsWithArticlesMap: TopicsWithArticlesMap) =>
  pipe(
    taskEither.rightIO(getIndexFilePath(topicsIndexFileName)),
    taskEither.chainFirstW(ensureParentDirectoryExists),
    taskEither.mapLeft(
      (error) =>
        ({
          type: "cannot-create-topics-summary-parent-directory",
          error,
        } as const)
    ),
    taskEither.chainW((topicsIndexFilePath) =>
      pipe(
        safeWriteIndex(
          topicsIndexFilePath,
          pipe(Array.from(topicsWithArticlesMap.keys()), array.sort(string.Ord))
        ),
        taskEither.mapLeft(
          (error) =>
            ({
              type: "cannot-write-topic-summary-index",
              error,
            } as const)
        )
      )
    )
  );

interface TopicIndexWriteError {
  type: "cannot-write-topic-index";
  topic: string;
  error: FileWriteError;
}
