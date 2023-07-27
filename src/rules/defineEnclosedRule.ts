import type { RegexHandler } from "./regexHandler";

export type DefineEnclosedRuleProps<RuleName extends string = "enclosedRule", ResultType extends unknown = string> = {
    name: RuleName;
    openHandler: RegexHandler<ResultType>;
    closeHandler: RegexHandler<ResultType>;
};

export function defineEnclosedRule<RuleName extends string = "enclosedRule", ResultType extends unknown = string>(ruleDefinition: DefineEnclosedRuleProps<RuleName, ResultType>) {
    let regExpResultA: RegExpExecArray;
    let regExpResultB: RegExpExecArray;
    return {
      type: "enclosed" as "enclosed",
      name: ruleDefinition.name,
      copy: () => defineEnclosedRule({ ...ruleDefinition }),
      isPattern: (i: number, txt: string) => {
        const result = ruleDefinition.openHandler.regex.exec(txt.slice(i));
        if (result && result.index == 0) {
            regExpResultA = result;
            return true;
        }
        return false;
      },
      isPatternEnd: (i: number, txt: string) => {
        const result = ruleDefinition.closeHandler.regex.exec(txt.slice(i));
        if (result && result.index == 0) {
          regExpResultB = result;
          return true;
        }
        return false;
      },
      openedFetched: () => regExpResultA,
      closedFetched: () => regExpResultB,
      overrideOpen: (fullMatch: string, ...groups: string[]) => (ruleDefinition.openHandler.overrideContent ? ruleDefinition.openHandler.overrideContent(fullMatch, ...groups) : fullMatch) as ResultType,
      overrideClose: (fullMatch: string, ...groups: string[]) => (ruleDefinition.closeHandler.overrideContent ? ruleDefinition.closeHandler.overrideContent(fullMatch, ...groups) : fullMatch) as ResultType
    };
  }
  