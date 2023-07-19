import { type EnclosedRegexProps } from "../interfaces/enclosedRegexProps";
import { parse } from "../parser/parse";
import { type Rules } from "../types/rules";

export type enclosedRegex<T> = typeof enclosedRegex<T>;
export function enclosedRegex<T>({ name, openHandler, closeHandler, overridePatternSet }: EnclosedRegexProps<T>) {
  let regExpResultA: RegExpExecArray;
  let regExpResultB: RegExpExecArray;
  return {
    type: "enclosed",
    name: name,
    begin: openHandler?.fallbackValue,
    end: closeHandler?.fallbackValue,
    copy: () => enclosedRegex<T>({
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
    fetch: (index: number, txt: string, endPattern: (i: number, txt: string) => boolean, patternSet: Rules<T>) => {
      const p = parse(txt, patternSet ?? [], index + regExpResultA[0].length, endPattern); // Let's look for nested pattern over here..
      // We could filter patternSet if we wanted to get rid of some functions for this case or use whatever we want anyway.
      if(p.isPatternEnd) // It's the end of our pattern
      {
        return {
          name: name,
          content: p.result,
          error: false,
          nested: true,
          begin: openHandler.overrideContent
            ? openHandler.overrideContent(regExpResultA[0], regExpResultA ? regExpResultA.splice(1, regExpResultA.length) : [])
            : txt.substring(index, index + regExpResultA[0].length),
          end: closeHandler.overrideContent
            ? closeHandler.overrideContent(regExpResultB[0], regExpResultB ? regExpResultB.splice(1, regExpResultB.length) : [])
            : txt.substring(p.lastIndex, p.lastIndex + regExpResultB[0].length),
          lastIndex: p.lastIndex + regExpResultB[0].length - 1
        }; // Return what we got
      }
      // Something went wrong with enclosed regex since it was never closed.
      return {
        name: name,
        content: null,
        nested: true,
        error: true,
        begin: openHandler.fallbackValue,
        end: closeHandler.fallbackValue,
        lastIndex: index
      };
    }
  };
}
