import { type Rules } from "../types/rules";
import { type RegexHandler } from "./regexHandler";

export interface EnclosedRegexProps {
  name: string;
  openHandler: RegexHandler;
  closeHandler: RegexHandler;
  overridePatternSet?: Rules;
}