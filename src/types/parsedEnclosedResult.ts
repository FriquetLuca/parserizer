import { ParsedContent } from "./parsedContent";

type EnclosedResult<T, Error extends boolean = boolean> = Error extends true ? {
  content: null;
  begin: T | undefined;
  end: T | undefined;
} : {
  content:ParsedContent<T>[];
  begin: T | string;
  end: T | string;
}
export type ParsedEnclosedResult<T, Error extends boolean = boolean> = {
  name: string;
  nested: true;
  error: Error;
  lastIndex: number;
} & EnclosedResult<T, Error>;