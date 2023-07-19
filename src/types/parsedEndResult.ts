import { ParsedContent } from "./parsedContent";

export type ParsedEndResult<T> = {
  nested?: false;
  isPatternEnd: boolean;
  result: ParsedContent<T>[];
  lastIndex: number;
}