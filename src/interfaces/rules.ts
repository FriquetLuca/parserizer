import type { CurrentCollapseResult, CurrentEnclosedResult, CurrentErrorResult, CurrentResult, ParserContentResult } from "./results"

export interface Rule<T> {
  type: "any",
  name: string,
  isPattern: (i: number, txt: string) => boolean,
  fetch: (index: number, txt: string) => CurrentResult<T>
}

export interface EnclosedRule<T> {
  type: "enclosed"
  name: string
  begin: T | undefined
  end: T | undefined
  copy: () => EnclosedRule<T>
  isPattern: (i: number, txt: string) => boolean
  isPatternEnd: (i: number, txt: string) => boolean
  fetch: (index: number, txt: string, endPattern: (i: number, txt: string) => boolean, patternSet: ParserRules<T>) => CurrentCollapseResult<T> | CurrentEnclosedResult<T> | CurrentErrorResult<T>
  collapse?: (begin: string | T, content: ParserContentResult<T>, end: string | T) => string | T
}

export type ParserRule<T> = Rule<T> | EnclosedRule<T>;
export type ParserRules<T> = ParserRule<T>[];