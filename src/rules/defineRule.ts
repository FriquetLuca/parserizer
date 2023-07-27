import type { RegexHandler } from "./regexHandler";

export type DefineRuleProps<RuleName extends string, ResultType extends unknown = string> = {
  name: RuleName;
  handler: RegexHandler<ResultType>
};

export function defineRule<RuleName extends string = "rule", ResultType extends unknown = string>(ruleDefinition: DefineRuleProps<RuleName, ResultType>) {
  let regExpResult: RegExpExecArray;
  return {
    type: "rule" as "rule",
    name: ruleDefinition.name,
    isPattern: (i: number, txt: string) => { 
      const result = ruleDefinition.handler.regex.exec(txt.slice(i));
      if (result && result.index == 0) {
        regExpResult = result;
        return true;
      }
      return false;
    },
    fetched: () => regExpResult,
    override: (fullMatch: string, ...groups: string[]) => (ruleDefinition.handler.overrideContent ? ruleDefinition.handler.overrideContent(fullMatch, ...groups) : fullMatch) as ResultType
  }
}
