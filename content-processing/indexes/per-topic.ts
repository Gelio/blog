import { array, either, io, string, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import path from "path";
import { z } from "zod";
import { ExtractLeftFromEither, ExtractResultFromTask } from "../../lib/fp-ts";
import type { ParsedArticleWithMetadata } from "../parse-articles";
import { safeParseSchema } from "../utils";
import { indexedArticleMetadataSchema } from "./schema";
import {
  ensureParentDirectoryExists,
  getIndexFilePath,
  getRepositoryRootDirectoryPath,
  safeReadFile,
  safeReadIndex,
  safeWriteIndex,
} from "./utils";

const topicsIndexesDirectoryName = "topics";
const topicsIndexFileName = "topics.json";

/** Keys are topic names */
type TopicsWithParsedArticlesMap = Map<string, ParsedArticleWithMetadata[]>;

const getTopicsWithParsedArticlesMap = (
  articlesWithMetadata: readonly ParsedArticleWithMetadata[]
) => {
  const topicsWithArticlesMap: TopicsWithParsedArticlesMap = new Map();

  articlesWithMetadata.forEach((articleWithMetadata) => {
    articleWithMetadata.metadata.tags.forEach((topic) => {
      const articlesForTopic = topicsWithArticlesMap.get(topic);
      if (articlesForTopic) {
        articlesForTopic.push(articleWithMetadata);
      } else {
        topicsWithArticlesMap.set(topic, [articleWithMetadata]);
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
        Array.from(topicsWithArticlesMap.entries()).map(
          ([topicName, articles]) =>
            pipe(
              taskEither.Do,
              taskEither.apSW(
                "description",
                pipe(
                  getTopicDescription(topicName),
                  taskEither.mapLeft(
                    (error) =>
                      ({
                        type: "cannot-read-topic-description",
                        topic: topicName,
                        error,
                      } as const)
                  )
                )
              ),
              taskEither.apS(
                "indexFilePath",
                taskEither.rightIO(getTopicIndexPath(topicName))
              ),
              taskEither.chainW(({ indexFilePath, description }) =>
                pipe(
                  safeWriteIndex(indexFilePath, {
                    articles: articles.map(({ metadata }) => metadata),
                    description,
                  }),
                  taskEither.mapLeft(
                    (error) =>
                      ({
                        type: "cannot-write-topic-index",
                        topic: topicName,
                        error,
                      } as const)
                  )
                )
              )
            )
        ),
        (tasks) => {
          type TopicProcessingError = ExtractLeftFromEither<
            ExtractResultFromTask<typeof tasks[number]>
          >;

          return pipe(
            tasks,
            array.map(taskEither.mapLeft((error) => [error])),
            array.sequence(
              taskEither.getApplicativeTaskValidation(
                task.ApplyPar,
                array.getSemigroup<TopicProcessingError>()
              )
            )
          );
        },
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

const getTopicDescription = (topicName: string) =>
  pipe(
    getRepositoryRootDirectoryPath,
    io.map((repositoryRootDirectoryPath) =>
      path.join(
        repositoryRootDirectoryPath,
        "content",
        "topics",
        // NOTE: no support for Markdown in topic summaries
        `${topicName}.txt`
      )
    ),
    taskEither.rightIO,
    taskEither.chainW(safeReadFile)
  );

const topicIndexSchema = z.object({
  articles: z.array(indexedArticleMetadataSchema),
  description: z.string(),
});
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
