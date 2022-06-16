import { array, either, string, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import path from "path";
import { z } from "zod";
import { ExtractLeftFromEither, ExtractResultFromTask } from "../../lib/fp-ts";
import type { ParsedArticleWithMetadata } from "../parse-articles";
import { safeParseSchema } from "../utils";
import { indexedArticleMetadataSchema } from "./schema";
import {
  ensureParentDirectoryExists,
  FileWriteError,
  getIndexFilePath,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

const topicsIndexesDirectoryName = "topics";
const topicsIndexFileName = "topics.json";

// TODO: add topic descriptions to indexes

type TopicsWithParsedArticlesMap = Map<string, ParsedArticleWithMetadata[]>;

const getTopicsWithParsedArticlesMap = (
  articlesWithMetadata: readonly ParsedArticleWithMetadata[]
) => {
  const topicsWithArticlesMap: TopicsWithParsedArticlesMap = new Map();

  articlesWithMetadata.forEach((articleWithMetadata) => {
    articleWithMetadata.metadata.tags.forEach((tag) => {
      const articlesForTopic = topicsWithArticlesMap.get(tag);
      if (articlesForTopic) {
        articlesForTopic.push(articleWithMetadata);
      } else {
        topicsWithArticlesMap.set(tag, [articleWithMetadata]);
      }
    });
  });

  return topicsWithArticlesMap;
};

export const createTopicIndexes = flow(
  getTopicsWithParsedArticlesMap,
  (topicsWithArticleMap) =>
    pipe(
      createPerTopicIndexes(topicsWithArticleMap),
      taskEither.apFirstW(createTopicsSummary(topicsWithArticleMap))
    ),
  taskEither.map(() => undefined)
);

const getTopicIndexPath = (topicName: string) =>
  getIndexFilePath(path.join(topicsIndexesDirectoryName, `${topicName}.json`));

const createPerTopicIndexes = (
  topicsWithArticlesMap: TopicsWithParsedArticlesMap
) =>
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
              safeWriteIndex(
                indexFilePath,
                articles.map(({ metadata }) => metadata)
              )
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

const topicIndexSchema = z.array(indexedArticleMetadataSchema);
export type TopicIndex = z.infer<typeof topicIndexSchema>;

export type ReadTopicIndexError = ExtractLeftFromEither<
  ExtractResultFromTask<ReturnType<typeof readTopicIndex>>
>;

export const readTopicIndex = (topicName: string) =>
  pipe(
    taskEither.rightIO(getTopicIndexPath(topicName)),
    taskEither.chainW(safeReadIndex),
    taskEither.chainEitherKW(
      flow(
        safeParseSchema(topicIndexSchema),
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

const topicsSummaryIndexSchema = z.array(z.string());

export const readTopicsSummaryIndex = pipe(
  taskEither.rightIO(getIndexFilePath(topicsIndexFileName)),
  taskEither.chainW(safeReadIndex),
  taskEither.chainEitherKW(
    flow(
      safeParseSchema(topicsSummaryIndexSchema),
      either.mapLeft(
        (error) =>
          ({
            type: "topics-summary-index-parse-error",
            error,
          } as const)
      )
    )
  )
);

const createTopicsSummary = (
  topicsWithArticlesMap: TopicsWithParsedArticlesMap
) =>
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
