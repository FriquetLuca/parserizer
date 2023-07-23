import { matchWordCharacter } from "../matchers";
import { countLines } from "../utils";

type RegexHandler<ResultType extends unknown = string> = {
  regex: RegExp;
  overrideContent?: (fullMatch: string, ...groups: string[]) => ResultType;
};

type DefineRuleProps<RuleName extends string, ResultType extends unknown = string> = {
  name: RuleName;
  handler: RegexHandler<ResultType>
};

type DefineEnclosedRuleProps<RuleName extends string = "enclosedRule", ResultType extends unknown = string> = {
  name: RuleName;
  openHandler: RegexHandler<ResultType>;
  closeHandler: RegexHandler<ResultType>;
};

function defineRule<RuleName extends string = "rule", ResultType extends unknown = string>(ruleDefinition: DefineRuleProps<RuleName, ResultType>) {
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
    override: (fullMatch: string, ...groups: string[]) => ruleDefinition.handler.overrideContent ? ruleDefinition.handler.overrideContent(fullMatch, ...groups) : fullMatch
  }
}

function defineEnclosedRule<RuleName extends string = "enclosedRule", ResultType extends unknown = string>(ruleDefinition: DefineEnclosedRuleProps<RuleName, ResultType>) {
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
    overrideOpen: (fullMatch: string, ...groups: string[]) => ruleDefinition.openHandler.overrideContent ? ruleDefinition.openHandler.overrideContent(fullMatch, ...groups) : fullMatch,
    overrideClose: (fullMatch: string, ...groups: string[]) => ruleDefinition.closeHandler.overrideContent ? ruleDefinition.closeHandler.overrideContent(fullMatch, ...groups) : fullMatch
  };
}


type RuleResult<RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof defineRule<RuleName, ResultType>>;
type EnclosedRuleResult<RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof defineEnclosedRule<RuleName, ResultType>>;

type ParseProps<T> = {
  ruleSet: T[];
  endPattern?: (i: number, t: string) => boolean;
}

type ParsedResultType<T extends EnclosedRuleResult<string, unknown>|RuleResult<string, unknown>> = {
  type: "rule";
  name: Extract<T, { type: "rule" }>["name"];
  content: ReturnType<Extract<T, { type: "rule" }>["override"]>;
  lastIndex: number;
} | {
  type: "enclosed";
  name: Extract<T, { type: "enclosed" }>["name"];
  error: false;
  begin: ReturnType<Extract<T, { type: "enclosed" }>["overrideOpen"]>;
  content: ParsedResultType<T>[];
  end: ReturnType<Extract<T, { type: "enclosed" }>["overrideClose"]>;
  lastIndex: number;
} | {
  type: "enclosed";
  name: Extract<T, { type: "enclosed"; }>["name"];
  content: null;
  error: true;
  lastIndex: number;
}

function parse<T extends EnclosedRuleResult<string, unknown>|RuleResult<string, unknown>>(input: string, options: ParseProps<T>, i: number = 0) {
  const subdivided: ParsedResultType<T>[] = []; // A result called subdivided since it's the input subdivided in multiple pieces.
  for(; i < input.length; i++) // Let's navigate the input
  {
    if(options.endPattern && options.endPattern(i, input)) // We're in a nested pattern that just ended
    {
      return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
        type: "endResult" as "endResult",
        result: subdivided,
        lastIndex: i
      };
    }
    for(let j = 0; j < options.ruleSet.length; j++) // Let's check all the possible patterns
    {
      const currentPattern = options.ruleSet[j];
      if(currentPattern.type === "enclosed") {
        const enclosedRule = currentPattern.copy();
        if(enclosedRule.isPattern(i, input)) // It's the pattern, let's execute something
        {
          const enclosedOpen = enclosedRule.openedFetched();
          const fullOpenMatch = enclosedOpen[0];
          const nestedElements = parse(input, {
            ruleSet: options.ruleSet,
            endPattern: enclosedRule.isPatternEnd
          }, i + fullOpenMatch.length);
          if(nestedElements.type === "endResult") {
            const enclosedClose = enclosedRule.closedFetched();
            const fullCloseMatch = enclosedClose[0];
            const begin = enclosedRule.overrideOpen(fullOpenMatch, ...enclosedOpen.splice(1, enclosedOpen.length)) as ReturnType<Extract<T, { type: "enclosed" }>["overrideOpen"]>;
            const end = enclosedRule.overrideClose(fullCloseMatch, ...enclosedClose.splice(1, enclosedClose.length)) as ReturnType<Extract<T, { type: "enclosed" }>["overrideClose"]>;
            const fetchResult: {
              type: "enclosed",
              name: Extract<T, { type: "enclosed" }>["name"],
              error: false,
              begin: ReturnType<Extract<T, { type: "enclosed" }>["overrideOpen"]>,
              content: ParsedResultType<T>[],
              end: ReturnType<Extract<T, { type: "enclosed" }>["overrideClose"]>,
              lastIndex: number
            } = {
              type: "enclosed" as "enclosed",
              name: enclosedRule.name as Extract<T, { type: "enclosed" }>["name"],
              error: false as false,
              begin,
              content: nestedElements.result,
              end,
              lastIndex: (nestedElements.lastIndex) as number + fullCloseMatch.length - 1
            };
            const lineData = countLines(input, i);
            i = fetchResult.lastIndex;
            subdivided.push({
              ...fetchResult,
              ...lineData,
            });
          } else {
            const fetchResult = {
              type: "enclosed" as "enclosed",
              name: enclosedRule.name as Extract<T, { type: "enclosed" }>["name"],
              content: null,
              error: true as true,
              lastIndex: i
            };
            const lineData = countLines(input, i);
            i = fetchResult.lastIndex;
            subdivided.push({
              ...fetchResult,
              ...lineData,
            });
          }
          break; // No need to check more pattern, we've got one already
        }
      } else {
        if(currentPattern.isPattern(i, input)) // It's the pattern, let's execute something
        {
          const fetchedFromPattern = currentPattern.fetched();
          const fullMatch = fetchedFromPattern[0];
          const fetchResult = {
            type: "rule" as "rule",
            name: currentPattern.name as Extract<T, { type: "rule" }>["name"],
            content: currentPattern.override(fullMatch, ...fetchedFromPattern.splice(1, fetchedFromPattern.length)) as ReturnType<Extract<T, { type: "rule" }>["override"]>,
            lastIndex: i + fullMatch.length - 1
          };
          const lineData = countLines(input, i);
          i = fetchResult.lastIndex;
          subdivided.push({
            ...fetchResult,
            ...lineData,
          });
          break; // No need to check more pattern, we've got one already
        }
      }      
    }
  }
  return { // We've done it 'till the end, no pattern ended over here
    type: "result" as "result",
    result: subdivided,
    lastIndex: i - 1
  };
}

const grabWord = defineRule({
  name: "word",
  handler: {
    regex: matchWordCharacter("letters", true)
  }
})

const grabInt = defineRule({
  name: "int",
  handler: {
    regex: matchWordCharacter("digits", true)
  }
})

const rulesPrt = [
  grabInt
];

const prts = defineEnclosedRule({
  name: "parenthesis",
  openHandler: {
    regex: /^\{/
  },
  closeHandler: {
    regex: /^\}/
  }
});

const rules = [
  grabWord,
  grabInt,
  prts
];


const parsedResult = parse("hello world, nice to meet you!", {
  ruleSet: rules
});
if(parsedResult.result[0].type === "enclosed") {
  const prr = parsedResult.result[0]
  if(prr.name === "parenthesis") {
    prr.content
  } else {
    prr.content
  }
}