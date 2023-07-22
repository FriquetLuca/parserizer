import type { EnclosedRule, EnclosedRuleProps, CurrentEnclosedResult, CurrentErrorResult, ParserRules } from "../interfaces";
import { parse } from "../parser";

/**
 * Return an enclosed rule to handle nested content.
 * @param param0 The parameters to define an enclosed rule.
 * @returns An enclosed rule to handle nested content.
 */
export function enclosedRule<T extends unknown = string>({ name, openHandler, closeHandler, overridePatternSet }: EnclosedRuleProps<T>): EnclosedRule<T> {
  let regExpResultA: RegExpExecArray;
  let regExpResultB: RegExpExecArray;
  return {
    type: "enclosed",
    name: name,
    begin: openHandler?.fallbackValue,
    end: closeHandler?.fallbackValue,
    copy: () => enclosedRule<T>({
      name,
      openHandler: { ...openHandler },
      closeHandler: { ...closeHandler },
      overridePatternSet: overridePatternSet ? [ ...overridePatternSet ] : undefined
    }),
    isPattern: (i: number, txt: string) => {
      const result = openHandler.regex.exec(txt.slice(i));
      if (result && result.index == 0) {
          regExpResultA = result;
          return true;
      }
      return false;
    },
    isPatternEnd: (i: number, txt: string) => {
      const result = closeHandler.regex.exec(txt.slice(i));
      if (result && result.index == 0) {
        regExpResultB = result;
        return true;
      }
      return false;
    },
    fetch: (index: number, txt: string, endPattern: (i: number, txt: string) => boolean, patternSet: ParserRules<T>) => {
      const fullMatchA = regExpResultA[0];
      const p = parse<T>(txt, patternSet ?? [], index + fullMatchA.length, endPattern); // Let's look for nested pattern over here..
      // We could filter patternSet if we wanted to get rid of some functions for this case or use whatever we want anyway.
      if(p.type === "endResult") // It's the end of our pattern
      {
        const fullMatchB = regExpResultB[0];
        return {
          type: "enclosed",
          name: name,
          content: p.result,
          error: false,
          nested: true,
          begin: openHandler.overrideContent
            ? openHandler.overrideContent(fullMatchA, ...(regExpResultA ? regExpResultA.splice(1, regExpResultA.length) : []))
            : txt.substring(index, index + fullMatchA.length),
          end: closeHandler.overrideContent
            ? closeHandler.overrideContent(fullMatchB, ...(regExpResultB ? regExpResultB.splice(1, regExpResultB.length) : []))
            : txt.substring(p.lastIndex, p.lastIndex + fullMatchB.length),
          lastIndex: p.lastIndex + fullMatchB.length - 1
        } as CurrentEnclosedResult<T>; // Return what we got
      }
      // Something went wrong with enclosed regex since it was never closed.
      return {
        type: "enclosed",
        name: name,
        content: null,
        nested: false,
        error: true,
        begin: openHandler.fallbackValue,
        end: closeHandler.fallbackValue,
        lastIndex: index
      } as CurrentErrorResult<T>;
    }
  };
}
