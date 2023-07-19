import { type Rules } from "../types/rules";
import { type RegexHandler } from "./regexHandler";

export interface EnclosedRegexProps<T> {
  name: string;
  openHandler: RegexHandler<T>;
  closeHandler: RegexHandler<T>;
  overridePatternSet?: Rules<T>;
}