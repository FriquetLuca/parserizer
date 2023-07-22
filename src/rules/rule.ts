import type { CurrentResult, RuleProps, Rule } from "../interfaces";

/**
 * Return a rule to handle the parsing of some content.
 * @param param0 The parameters to define a rule.
 * @returns A rule to handle the parsing of some content.
 */
export function rule<T extends unknown = string>({ name, handler }: RuleProps<T>) {
  let regExpResult: RegExpExecArray;
  return {
    type: "any",
    name,
    isPattern: (i: number, txt: string) => { 
      const result = handler.regex.exec(txt.slice(i));
      if (result && result.index == 0) {
        regExpResult = result;
        return true;
      }
      return false;
    },
    fetch: (index: number, txt: string) => {
      const fullMatch = regExpResult[0];
      return {
        type: "any",
        name: name,
        content: handler.overrideContent ? handler.overrideContent(fullMatch, ...(regExpResult ? regExpResult.splice(1, regExpResult.length) : [])) : txt.substring(index, index + fullMatch.length),
        lastIndex: index + fullMatch.length - 1
      } as CurrentResult<T>;
    }
  } as Rule<T>
}

