import IRule from "../interfaces/IRule";

export default function field(name: string, regex: RegExp, defaultValue: string): IRule {
  let regExpResult: RegExpExecArray;
  return {
    name,
    defaultValue,
    isPattern: (i: number, txt: string) => { 
      const result = regex.exec(txt.slice(i));
      if (result && result.index == 0) {
        regExpResult = result;
        return true;
      } else {
        return false;
      }
    },
    fetch: (index: number, txt: string) => {
      const result = {
        name: name,
        content: txt.substring(index, index + regExpResult[0].length),
        lastIndex: index + regExpResult[0].length - 1
      };
      return result;
    }
  }
}