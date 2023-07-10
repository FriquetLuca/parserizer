export * from "./interfaces";
export * from "./types";
export * from "./utils";

import { EnclosedRegexProps, RegexProps } from "./interfaces";
import { parse as parser } from "./parser";

import { stringify, debugStringify } from "./parser";
import { enclosedRegex as encReg, regex as reg } from "./stack";
import { EnclosedRegexTemplate, RegexTemplate, Rules } from "./types";
import { type ParsedContent } from "./types/parsedContent";
import { type ParsedEndResult } from "./types/parsedEndResult";
import { versatileTypeof } from "./utils";

export function StringifyResult(parsedResult: ParsedEndResult | ParsedContent[], spacing: boolean = true) {
  return stringify(versatileTypeof(parsedResult) !== "array" ? (parsedResult as ParsedEndResult).result : parsedResult as ParsedContent[], spacing);
}

export function StringifyDebug(parsedResult: ParsedEndResult | ParsedContent[], spacing: boolean = true) {
  return debugStringify(versatileTypeof(parsedResult) !== "array" ? (parsedResult as ParsedEndResult).result : parsedResult as ParsedContent[], spacing);
}

export function enclosedRegex(props: EnclosedRegexProps) {
  return encReg(props) as EnclosedRegexTemplate;
}

export function regex(props: RegexProps) {
  return reg(props) as RegexTemplate;
}

export function parse(input: string, ruleSet: Rules) {
  return parser(input, ruleSet);
}