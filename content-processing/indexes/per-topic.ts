import { array, either, string, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import path from "path";
import { z } from "zod";
import { ContentWithMetadata } from "../parse-content";
import { safeParseSchema } from "../utils";
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

type TopicsWithContentMap = Map<string, ContentWithMetadata[]>;

export const createTopicIndexes = (
  contentWithMetadata: readonly ContentWithMetadata[]
) =>
  pipe(
    taskEither.rightIO(() => {
      const topicsWithContentMap: TopicsWithContentMap = new Map();

      contentWithMetadata.forEach((singleContentWithMetadata) => {
        singleContentWithMetadata.contentMetadata.tags.forEach((tag) => {
          const contentForTopic = topicsWithContentMap.get(tag);
          if (contentForTopic) {
            contentForTopic.push(singleContentWithMetadata);
          } else {
            topicsWithContentMap.set(tag, [singleContentWithMetadata]);
          }
        });
      });

      return topicsWithContentMap;
    }),
    taskEither.chainW((topicsWithContentMap) =>
      pipe(
        createPerTopicIndexes(topicsWithContentMap),
        taskEither.apFirstW(createTopicsSummary(topicsWithContentMap))
      )
    ),
    taskEither.map(() => undefined)
  );

const getTopicIndexPath = (topicName: string) =>
  getIndexFilePath(path.join(topicsIndexesDirectoryName, `${topicName}.json`));

const createPerTopicIndexes = (topicsWithContentMap: TopicsWithContentMap) =>
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
        Array.from(topicsWithContentMap.entries()).map(([topic, contents]) =>
          pipe(
            taskEither.rightIO(getTopicIndexPath(topic)),
            taskEither.chain((indexFilePath) =>
              safeWriteIndex(indexFilePath, contents)
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

const contentMetadataSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
});

const topicIndexSchema = z.array(
  z.object({
    contentFilePath: z.string(),
    contentMetadata: contentMetadataSchema,
  })
);

export type TopicIndex = z.infer<typeof topicIndexSchema>;

export const readTopicIndex = (topicName: string) =>
  pipe(
    taskEither.rightIO(getTopicIndexPath(topicName)),
    taskEither.chainW(safeReadIndex),
    taskEither.chainEitherKW((rawTopicIndex) =>
      pipe(
        safeParseSchema(topicIndexSchema, rawTopicIndex),
        either.mapLeft((error) => ({
          type: "topic-index-parse-error",
          topicName,
          error,
        }))
      )
    )
  );

export const readTopicsSummaryIndex = pipe(
  taskEither.rightIO(getIndexFilePath(topicsIndexFileName)),
  taskEither.chainW(safeReadIndex),
  taskEither.map((data) => data as string[])
);

const createTopicsSummary = (topicsWithContentMap: TopicsWithContentMap) =>
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
          pipe(Array.from(topicsWithContentMap.keys()), array.sort(string.Ord))
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
