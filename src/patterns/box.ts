import parse from "@/patterns/parse";
import type IRule from "@/interfaces/IRule";

export default function box(name: string, beginRegex: RegExp, endRegex: RegExp, defaultBegin: string, defaultEnd: string, overridePatternSet?: IRule[]): IRule {
  let regExpResultA: RegExpExecArray;
  let regExpResultB: RegExpExecArray;
  return {
      name: name,
      defaultValue: defaultBegin,
      begin: defaultBegin,
      end: defaultEnd,
      isPattern: (i, txt) => { 
        const result = beginRegex.exec(txt.slice(i));
        if (result && result.index == 0) {
            regExpResultA = result;
            return true;
        } else {
            return false;
        }
      },
      isPatternEnd: (i, txt) => {
        const result = endRegex.exec(txt.slice(i));
        if (result && result.index == 0) {
          regExpResultB = result;
          return true;
        } else {
          return false;
        }
      },
      fetch: (index, txt, endPattern, patternSet) => {
          const p = parse(txt, overridePatternSet ? (overridePatternSet.length == 0 ? (patternSet ?? []) : overridePatternSet) : (patternSet ?? []), index + defaultBegin.length, endPattern); // Let's look for nested pattern over here..
          // We could filter patternSet if we wanted to get rid of some functions for this case or use whatever we want anyway.
          if(p.isPatternEnd) // It's the end of our pattern
          {
              return {
                  name: name,
                  content: p.result,
                  error: false,
                  nested: true,
                  begin: txt.substring(index, index + regExpResultA[0].length),
                  end: txt.substring(p.lastIndex, p.lastIndex + regExpResultB[0].length),
                  lastIndex: p.lastIndex + regExpResultB[0].length - 1
              }; // Return what we got
          }
          else // Something went wrong with box since it was never closed.
          {
              return {
                  name: name,
                  content: defaultBegin,
                  nested: true,
                  error: true,
                  begin: defaultBegin,
                  end: defaultEnd,
                  lastIndex: index
              };
          }
      }
  };
}