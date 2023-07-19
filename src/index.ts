export * from "./interfaces";
export * from "./types";
export * from "./utils";

import { type EnclosedRegexProps, type RegexProps } from "./interfaces";
import { parse as parser } from "./parser";

import { stringify, debugStringify } from "./parser";
import { enclosedRegex as encReg, regex as reg } from "./stack";
import { type EnclosedRegexTemplate, type RegexTemplate, type Rules } from "./types";
import { type ParsedContent } from "./types/parsedContent";
import { type ParsedEndResult } from "./types/parsedEndResult";
import { versatileTypeof } from "./utils";

export function StringifyResult<T>(parsedResult: ParsedEndResult<T> | ParsedContent<T>[], refineElement?: ((element: string | T | undefined) => string) | undefined, spacing: boolean = true) {
  return stringify(versatileTypeof(parsedResult) !== "array" ? (parsedResult as ParsedEndResult<T>).result : parsedResult as ParsedContent<T>[], refineElement, spacing);
}

export function StringifyDebug<T>(parsedResult: ParsedEndResult<T> | ParsedContent<T>[], refineElement?: ((element: string | T | undefined) => string) | undefined, spacing: boolean = true) {
  return debugStringify(versatileTypeof(parsedResult) !== "array" ? (parsedResult as ParsedEndResult<T>).result : parsedResult as ParsedContent<T>[], refineElement, spacing);
}

export function enclosedRegex<T>(props: EnclosedRegexProps<T>) {
  return encReg(props) as EnclosedRegexTemplate<T>;
}

export function regex<T>(props: RegexProps<T>) {
  return reg(props) as RegexTemplate<T>;
}

export function parse<T>(input: string, ruleSet: Rules<T>) {
  return parser(input, ruleSet);
}