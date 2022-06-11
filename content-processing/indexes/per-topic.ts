import { array, task, taskEither } from "fp-ts/es6";
import { pipe } from "fp-ts/es6/function";
import path from "node:path";
import { ContentWithMetadata } from "../parse-content";
import {
  ensureParentDirectoryExists,
  FileWriteError,
  getIndexFilePath,
  safeWriteIndex,
} from "./utils";

export type AllContentIndex = ContentWithMetadata[];

const topicsIndexesDirectoryName = "topics";
const topicsIndexFileName = "topics.json";

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

const createPerTopicIndexes = (topicsWithContentMap: TopicsWithContentMap) =>
  pipe(
    taskEither.rightIO(
      getIndexFilePath(path.join(topicsIndexesDirectoryName, "any"))
    ),
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
            taskEither.rightIO(
              getIndexFilePath(
                path.join(topicsIndexesDirectoryName, `${topic}.json`)
              )
            ),
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
          Array.from(topicsWithContentMap.keys())
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