export * from "./interfaces";
export * from "./stack";
export * from "./types";
export * from "./utils";

import { parse } from "./parser";
export default parse;

import { stringify, debugStringify } from "./parser";
import { type ParsedContent } from "./types/parsedContent";
import { type ParsedEndResult } from "./types/parsedEndResult";
import { versatileTypeof } from "./utils";

export function StringifyResult(parsedResult: ParsedEndResult | ParsedContent[], spacing: boolean = true) {
  return stringify(versatileTypeof(parsedResult) !== "array" ? (parsedResult as ParsedEndResult).result : parsedResult as ParsedContent[], spacing);
}

export function StringifyDebug(parsedResult: ParsedEndResult | ParsedContent[], spacing: boolean = true) {
  return debugStringify(versatileTypeof(parsedResult) !== "array" ? (parsedResult as ParsedEndResult).result : parsedResult as ParsedContent[], spacing);
}
