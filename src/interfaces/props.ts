import type { EnclosedRuleHandler, RuleHandler } from "./handlers";
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
}