import { RegexProps } from "../interfaces/regexProps";

export function regex({ name, handler }: RegexProps) {
  let regExpResult: RegExpExecArray;
  return {
    type: "any",
    name,
    defaultValue: handler?.fallbackValue,
    isPattern: (i: number, txt: string) => { 
      const result = handler.regex.exec(txt.slice(i));
      if (result && result.index == 0) {
        regExpResult = result;
        return true;
      }
      return false;
    },
    fetch: (index: number, txt: string) => {
      const result = {
        name: name,
        content: handler.overrideContent ? handler.overrideContent(regExpResult[0], regExpResult ? regExpResult.splice(1, regExpResult.length) : []) : txt.substring(index, index + regExpResult[0].length),
        lastIndex: index + regExpResult[0].length - 1
      };
      return result;
    }
  }
}

