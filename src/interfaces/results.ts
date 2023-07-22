export interface CurrentResult<T> {
  type: "any",
  name: string,
  content: string | T,
  lastIndex: number
}

export interface CurrentCollapseResult<T> {
  type: "collapse",
  name: string,
  content: string | T | null,
  lastIndex: number
}

interface EnclosedResult {
  type: "enclosed",
  name: string
  lastIndex: number
}

export interface CurrentEnclosedResult<T> extends EnclosedResult {
  content: ParserContentResult<T>
  nested: true
  error: false
  begin: string | T
  end: string | T
}

export interface CurrentErrorResult<T> extends EnclosedResult {
  content: null
  nested: false
  error: true
  begin: T | undefined
  end: T | undefined
}

export type ParserAnyResult<T> = CurrentResult<T> | CurrentCollapseResult<T> | CurrentEnclosedResult<T> | CurrentErrorResult<T>;

export type ParserContentResult<T> = (ParserAnyResult<T> & {
  lines: number;
  lineChar: number;
})[];

export interface ParserResult<T> {
  type: "result" | "endResult",
  result: ParserContentResult<T>,
  lastIndex: number
};
