import type { EnclosedRuleHandler, RuleHandler } from "./handlers";
import type { ParserContentResult } from "./results";
import type { ParserRules } from "./rules";

export interface RuleProps<T> {
  name: string;
  handler: RuleHandler<T>;
}

export interface EnclosedRuleProps<T> {
  name: string;
  openHandler: EnclosedRuleHandler<T>;
  closeHandler: EnclosedRuleHandler<T>;
  overridePatternSet?: ParserRules<T>;
  collapse?: (begin: string | T, content: ParserContentResult<T>, end: string | T) => string | T;
}