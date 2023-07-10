import { ParsedContent } from "./parsedContent";

export type ParsedEndResult = {
  isPatternEnd: boolean;
  result: ParsedContent[];
  lastIndex: number;
}