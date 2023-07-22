export * from "./interfaces";
export * as utils from "./utils";
export * as matchers from "./matchers";

import type { ParserContentResult, ParserResult, ParserRules, StringifyOptions } from "./interfaces";
import { parse as parser, stringify as strgfy, debugStringify as debugstrgfy } from "./parser";
import { getTypeof } from "./utils";
export { rule, enclosedRule } from "./rules";

/**
 * Stringify a parsed result or parsed content as a string.
 * @param parsedResult The parsed result or the parsed content to stringify.
 * @param options Options for how to handle the stringifization of elements.
 * @param debug Allow for a debugging visualisation of the elements as a string.
 * @returns The stringified content of the parsed content.
 */
export function stringify<T>(parsedResult: ParserResult<T> | ParserContentResult<T> | null, options?: StringifyOptions<T>, debug: boolean = false) {
  if(parsedResult === null) {
    return "";
  }
  if(debug) {
    return debugstrgfy(getTypeof(parsedResult) !== "array" ? (parsedResult as ParserResult<T>).result : parsedResult as ParserContentResult<T>, options);
  }
  return strgfy(getTypeof(parsedResult) !== "array" ? (parsedResult as ParserResult<T>).result : parsedResult as ParserContentResult<T>, options);
}
/**
 * Parse the content of the input string.
 * @param input The string to parse.
 * @param ruleSet The rules to apply to the input string.
 * @returns The parsed result of the content of the input string.
 */
export function parse<T>(input: string, ruleSet: ParserRules<T>) {
  return parser(input, ruleSet);
}
