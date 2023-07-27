import { defineEnclosedRule } from "./defineEnclosedRule";
import { defineRule } from "./defineRule";

export type ParserRule<RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof defineRule<RuleName, ResultType>>;
export type ParserEnclosedRule<RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof defineEnclosedRule<RuleName, ResultType>>;


export function overrideRules<NewRules extends ParserEnclosedRule<string, unknown>|ParserRule<string, unknown>, RuleName extends string, ResultType extends unknown = string>(enclosedRule: ParserEnclosedRule<RuleName, ResultType>, newRules: NewRules[]) {
    return { ...enclosedRule, getRules: () => newRules, type: "override" as "override" };
  }