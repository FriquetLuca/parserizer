import { ParsedContent } from "./parsedContent";

export type ParsedEnclosedResult = {
  name: string;
  content: ParsedContent[]|null;
  nested: boolean;
  error: boolean;
  begin?: string;
  end?: string;
  lastIndex: number;
}