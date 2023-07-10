import { type EnclosedRegexTemplate } from "./enclosedRegexTemplate";
import { type RegexTemplate } from "./regexTemplate";

export type Rule = EnclosedRegexTemplate | RegexTemplate;
export type Rules = Rule[];