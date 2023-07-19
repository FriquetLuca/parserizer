import { type EnclosedRegexTemplate } from "./enclosedRegexTemplate";
import { type RegexTemplate } from "./regexTemplate";

export type Rule<T> = EnclosedRegexTemplate<T> | RegexTemplate<T>;
export type Rules<T> = Rule<T>[];