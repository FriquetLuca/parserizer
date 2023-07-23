import { matchWordCharacter } from "../matchers";
import { countLines } from "../utils";

type RuleProps<ResultType extends unknown = string, RuleName extends string = "rule"> = {
  name: RuleName;
  handler: {
    regex: RegExp;
    overrideContent?: (fullMatch: string, ...groups: string[]) => ResultType;
  }
}

type Rule<ResultType extends unknown = string, RuleName extends string = "rule"> = {
  type: "rule";
  name: RuleName;
  isPattern: (i: number, txt: string) => boolean;
  fetch: (index: number, txt: string) => {
    type: "rule";
    name: RuleName;
    content: string | ResultType;
    lastIndex: number;
  }
}

function rule<ResultType extends unknown = string, RuleName extends string = "rule">({
    name, handler
  }: RuleProps<ResultType, RuleName>): Rule<ResultType, RuleName> {
  let regExpResult: RegExpExecArray;
  return {
    type: "rule",
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
        type: "rule",
        name,
        content: handler.overrideContent ? handler.overrideContent(fullMatch, ...(regExpResult ? regExpResult.splice(1, regExpResult.length) : [])) : txt.substring(index, index + fullMatch.length),
        lastIndex: index + fullMatch.length - 1
      }
    }
  }
}

type EnclosedRuleProps<ResultType extends unknown = string, RuleName extends string = "enclosedRule", NewRules = (Rule<unknown, any>|EnclosedRule<unknown, any, unknown>)[]|undefined> = {
  name: RuleName;
  openHandler: {
    regex: RegExp;
    fallbackValue?: ResultType;
    overrideContent?: (fullMatch: string, ...groups: string[]) => ResultType;
  };
  closeHandler: {
    regex: RegExp;
    fallbackValue?: ResultType;
    overrideContent?: (fullMatch: string, ...groups: string[]) => ResultType;
  };
  overridePatternSet?: NewRules[];
  collapse?: (begin: string | ResultType, content: unknown[], end: string | ResultType) => string | ResultType;
}

type EnclosedRule<ResultType extends unknown = string, RuleName extends string = "enclosedRule", NewRules = (Rule<unknown, any>|EnclosedRule<unknown, any, unknown>)[]|undefined> = {
  type: "enclosed";
  name: RuleName;
  begin: ResultType | undefined;
  end: ResultType | undefined;
  copy: () => EnclosedRule<ResultType, RuleName, NewRules>;
  isPattern: (i: number, txt: string) => boolean;
  isPatternEnd: (i: number, txt: string) => boolean;
  fetch: (index: number, txt: string, endPattern: (i: number, txt: string) => boolean, patternSet: (Rule<unknown, any>|EnclosedRule<unknown, any, unknown>)[]) => {
    type: "collapse";
    name: RuleName;
    content: string | ResultType;
    lastIndex: number;
  } | {
    type: "enclosed",
    name: RuleName;
    error: false;
    nested: true;
    begin: string | ResultType;
    content: ReturnType<Rules["fetch"]>[];
    end: string | ResultType;
    lastIndex: number;
  } | {
    type: "enclosed",
    name: RuleName;
    error: true;
    nested: false;
    begin: ResultType | undefined;
    content: null;
    end: ResultType | undefined;
    lastIndex: number;
  }
}

function enclosedRule<ResultType extends unknown = string, RuleName extends string = "enclosedRule", NewRules extends Rule<unknown, string>|EnclosedRule<unknown, string, unknown>|undefined = undefined>({ name, openHandler, closeHandler, overridePatternSet, collapse }: EnclosedRuleProps<ResultType, RuleName, NewRules>): EnclosedRule<ResultType, RuleName, NewRules> {
  let regExpResultA: RegExpExecArray;
  let regExpResultB: RegExpExecArray;
  return {
    type: "enclosed",
    name,
    begin: openHandler?.fallbackValue,
    end: closeHandler?.fallbackValue,
    copy: () => enclosedRule<ResultType, RuleName, NewRules>({
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
    fetch: (index: number, txt: string, endPattern: (i: number, txt: string) => boolean, patternSet: (Rule<unknown, any>|EnclosedRule<unknown, any, unknown>)[]) => {
      const fullMatchA = regExpResultA[0];
      const p = parse(txt, patternSet ?? [], index + fullMatchA.length, endPattern);
      if(p.type === "endResult") // It's the end of our pattern
      {
        const fullMatchB = regExpResultB[0];
        const beginEnclose = openHandler.overrideContent
          ? openHandler.overrideContent(fullMatchA, ...(regExpResultA ? regExpResultA.splice(1, regExpResultA.length) : []))
          : txt.substring(index, index + fullMatchA.length);
        const endEnclose = closeHandler.overrideContent
          ? closeHandler.overrideContent(fullMatchB, ...(regExpResultB ? regExpResultB.splice(1, regExpResultB.length) : []))
          : txt.substring(p.lastIndex, p.lastIndex + fullMatchB.length);
        if(collapse) {
          return {
            type: "collapse",
            name,
            content: collapse(beginEnclose, p.result, endEnclose),
            lastIndex: p.lastIndex + fullMatchB.length - 1
          }
        }
        return {
          type: "enclosed",
          name: name,
          content: p.result,
          error: false,
          nested: true,
          begin: beginEnclose,
          end: endEnclose,
          lastIndex: p.lastIndex + fullMatchB.length - 1
        }
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
      }
    }
  };
}

function parse<Names extends string, Rules extends Rule<unknown, Names>|EnclosedRule<unknown, Names, unknown>>(txtContent: string, patternSet: Rules[], i: number = 0, endPattern: (i: number, t: string) => boolean = () => { return false; }): {
  type: "endResult" | "result";
  result: ReturnType<Rules["fetch"]>[];
  lastIndex: number;
} {
  const subdivided: (ReturnType<Rules["fetch"]>)[] = []; // A result called subdivided since it's the input subdivided in multiple pieces.
  for(; i < txtContent.length; i++) // Let's navigate the input
  {
    if(endPattern(i, txtContent)) // We're in a nested pattern that just ended
    {
      return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
        type: "endResult",
        result: subdivided,
        lastIndex: i
      };
    }
    for(let j = 0; j < patternSet.length; j++) // Let's check all the possible patterns
    {
      const currentPattern = patternSet[j];
      if(currentPattern.type === "enclosed") {
        const enclosedRule = currentPattern.copy();
        if(enclosedRule.isPattern(i, txtContent)) // It's the pattern, let's execute something
        {
          const fetchResult = enclosedRule.fetch(i, txtContent, enclosedRule.isPatternEnd, patternSet) as ReturnType<Rules["fetch"]>; // Execute something then return the fetched result
          if(fetchResult.lastIndex === undefined) {
            throw new Error('Missing returned lastIndex in a fetch.');
          }
          const lineData = countLines(txtContent, i);
          i = fetchResult.lastIndex; // Assign the new index else
          subdivided.push({
            ...fetchResult,
            ...lineData
          }); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
          break; // No need to check more pattern, we've got one already
        }
      } else {
        if(currentPattern.isPattern(i, txtContent)) // It's the pattern, let's execute something
        {
          const fetchResult = currentPattern.fetch(i, txtContent) as ReturnType<Rules["fetch"]>; // Execute something then return the fetched result
          if(fetchResult.lastIndex === undefined) {
            throw new Error('Missing returned lastIndex in a fetch.');
          }
          const lineData = countLines(txtContent, i);
          i = fetchResult.lastIndex; // Assign the new index
          subdivided.push({
            ...fetchResult,
            ...lineData,
          }); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
          break; // No need to check more pattern, we've got one already
        }
      }      
    }
  }
  return { // We've done it 'till the end, no pattern ended over here
    type: "result",
    result: subdivided,
    lastIndex: i - 1
  };
}

const grabWord = rule({
  name: "word",
  handler: {
    regex: matchWordCharacter("letters", true)
  }
})

const grabInt = rule({
  name: "int",
  handler: {
    regex: matchWordCharacter("digits", true)
  }
})

const rulesPrt = [
  grabInt
];

const prts = enclosedRule({
  name: "parenthesis",
  openHandler: {
    regex: /^\{/
  },
  closeHandler: {
    regex: /^\}/
  },
  overridePatternSet: rulesPrt
});

const rules = [
  grabWord,
  grabInt,
  prts
];

const parsedResult = parse("hello world, nice to meet you!", rules);
if(parsedResult.result[0].type === "enclosed") {
  const prr = parsedResult.result[0]
}

/*
const parsedResult: {
    type: "endResult" | "result";
    result: ({
        type: "rule";
        name: "word";
        content: string;
        lastIndex: number;
    } | {
        type: "rule";
        name: "int";
        content: string;
        lastIndex: number;
    } | {
        type: "collapse";
        name: "parenthesis";
        content: string;
        lastIndex: number;
    } | {
        type: "enclosed";
        name: "parenthesis";
        ... 5 more ...;
        lastIndex: number;
    } | {
        ...;
    })[];
    lastIndex: number;
}
const prr: {
    type: "enclosed";
    name: "parenthesis";
    error: false;
    nested: true;
    begin: string;
    content: ReturnType<Rules["fetch"]>[];
    // content should be of type: {
    //  type: "endResult" | "result";
    //  result: ({
    //      type: "rule";
    //      name: "int";
    //      content: string;
    //      lastIndex: number;
    //  })[];
    //  lastIndex: number;
    // }
    end: string;
    lastIndex: number;
} | {
    type: "enclosed";
    name: "parenthesis";
    error: true;
    nested: false;
    begin: string | undefined;
    content: null;
    end: string | undefined;
    lastIndex: number;
}

prr.content // but instead content is of type: content: any[] | null
*/