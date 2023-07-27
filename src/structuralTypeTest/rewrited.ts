import { matchWordCharacter } from "../matchers";
import { countLines, duplicateStringContent } from "../utils";

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
    override: (fullMatch: string, ...groups: string[]) => (ruleDefinition.handler.overrideContent ? ruleDefinition.handler.overrideContent(fullMatch, ...groups) : fullMatch) as ResultType
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
    overrideOpen: (fullMatch: string, ...groups: string[]) => (ruleDefinition.openHandler.overrideContent ? ruleDefinition.openHandler.overrideContent(fullMatch, ...groups) : fullMatch) as ResultType,
    overrideClose: (fullMatch: string, ...groups: string[]) => (ruleDefinition.closeHandler.overrideContent ? ruleDefinition.closeHandler.overrideContent(fullMatch, ...groups) : fullMatch) as ResultType
  };
}

function overrideRules<NewRules extends ParserEnclosedRule<string, unknown>|ParserRule<string, unknown>, RuleName extends string, ResultType extends unknown = string>(enclosedRule: ParserEnclosedRule<RuleName, ResultType>, newRules: NewRules[]) {
  return { ...enclosedRule, getRules: () => newRules, type: "override" as "override" };
}

type ParserRule<RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof defineRule<RuleName, ResultType>>;
type ParserEnclosedRule<RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof defineEnclosedRule<RuleName, ResultType>>;
type ParserEnclosedOverrideRule<NewRules extends ParserEnclosedRule<string, unknown>|ParserRule<string, unknown>, RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof overrideRules<NewRules, RuleName, ResultType>>;
type ParserAllRules = ParserEnclosedRule<string, unknown>|ParserRule<string, unknown>|ParserEnclosedOverrideRule<any, string, unknown>;

type ParseProps<T> = {
  ruleSet: T[];
  endPattern?: (i: number, t: string) => boolean;
}

type ParsedRule<Rules extends ParserAllRules> = TransformRule<Extract<Rules, { type: "rule" }>>;


type ParsedEnclosedRule<Rules extends ParserAllRules> = {
  type: "enclosed";
  name: Extract<Rules, { type: "enclosed" }>["name"];
  error: false;
  begin: ReturnType<Extract<Rules, { type: "enclosed" }>["overrideOpen"]>;
  content: ParsedResultType<Rules>[];
  end: ReturnType<Extract<Rules, { type: "enclosed" }>["overrideClose"]>;
  lastIndex: number;
} | {
  type: "enclosed";
  name: Extract<Rules, { type: "enclosed"; }>["name"];
  content: null;
  error: true;
  lastIndex: number;
};

type ParsedOverrideRule<Rules extends ParserAllRules> = TransformOverrideEnclosedRule<Extract<Rules, { type: "override" }>> | {
  type: "override",
  name: Extract<Rules, { type: "override" }>["name"];
  content: null;
  error: true;
  lastIndex: number;
}

type ParsedResultType<Rules extends ParserAllRules> = ParsedRule<Rules> | ParsedEnclosedRule<Rules> | ParsedOverrideRule<Rules>;

function parse<T extends ParserAllRules>(input: string, options: ParseProps<T>, i: number = 0) {
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
      switch(currentPattern.type) {
        case "enclosed":
          const enclosedRule = currentPattern.copy();
          if(enclosedRule.isPattern(i, input))
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
              const fetchResult = {
                type: "enclosed" as "enclosed",
                name: enclosedRule.name,
                error: false as false,
                begin,
                content: nestedElements.result,
                end,
                lastIndex: nestedElements.lastIndex + fullCloseMatch.length - 1
              } as unknown as TransformEnclosedRule<Extract<T, { type: "enclosed" }>, T>;
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
          }
          break;
        case "override":
          const overrideRule = currentPattern.copy();
          if(overrideRule.isPattern(i, input)) // It's the pattern, let's execute something
          {
            const enclosedOpen = overrideRule.openedFetched();
            const fullOpenMatch = enclosedOpen[0];
            const nestedElements = parse(input, {
              ruleSet: currentPattern.getRules() as ReturnType<Extract<T, { type: "override" }>["getRules"]>[number],
              endPattern: overrideRule.isPatternEnd
            }, i + fullOpenMatch.length);
            if(nestedElements.type === "endResult") {
              const enclosedClose = overrideRule.closedFetched();
              const fullCloseMatch = enclosedClose[0];
              const begin = overrideRule.overrideOpen(fullOpenMatch, ...enclosedOpen.splice(1, enclosedOpen.length)) as ReturnType<Extract<T, { type: "enclosed" }>["overrideOpen"]>;
              const end = overrideRule.overrideClose(fullCloseMatch, ...enclosedClose.splice(1, enclosedClose.length)) as ReturnType<Extract<T, { type: "enclosed" }>["overrideClose"]>;
              const fetchResult = {
                type: "override",
                name: overrideRule.name,
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
              } as unknown as TransformOverrideEnclosedRule<Extract<T, { type: "override" }>>);
            } else {
              const fetchResult = {
                type: "override" as "override",
                name: overrideRule.name as Extract<T, { type: "override" }>["name"],
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
          break;
        case "rule":
          if(currentPattern.isPattern(i, input)) // It's the pattern, let's execute something
          {
            const fetchedFromPattern = currentPattern.fetched();
            const fullMatch = fetchedFromPattern[0];
            const fetchResult = {
              type: "rule" as "rule",
              name: currentPattern.name,
              content: currentPattern.override(fullMatch, ...fetchedFromPattern.splice(1, fetchedFromPattern.length)),
              lastIndex: i + fullMatch.length - 1
            } as unknown as TransformRule<Extract<T, { type: "rule" }>>;
            const lineData = countLines(input, i);
            i = fetchResult.lastIndex;
            subdivided.push({
              ...fetchResult,
              ...lineData,
            });
            break; // No need to check more pattern, we've got one already
          }
          break;
      }
    }
  }
  return { // We've done it 'till the end, no pattern ended over here
    type: "result" as "result",
    result: subdivided,
    lastIndex: i - 1
  };
}

type Unpack<T> = T extends (infer A)[] ? A : T;

type TransformRule<T> = T extends {
    type: "rule";
    name: infer Name;
    override: infer Override;
  }
    ? Override extends (...args: any[]) => infer Return
      ? { type: "rule"; name: Name; content: Return; lastIndex: number }
      : never
    : never;
type TransformEnclosedRule<T, Rules extends ParserAllRules> = T extends {
    type: "enclosed";
    name: infer Name;
    overrideOpen: infer OverrideOpen;
    overrideClose: infer OverrideClose;
  }
    ? OverrideOpen extends (...args: any[]) => infer Return
      ? OverrideClose extends (...args: any[]) => infer ReturnBis
        ? { type: "enclosed"; name: Name; begin: Return; content: ParsedResultType<Rules>[]; end: ReturnBis; lastIndex: number }
        : never
      : never
    : never;
type TransformOverrideEnclosedRule<T> = T extends {
    type: "override";
    name: infer Name;
    getRules: (...args: any[]) => infer CustomRules;
    overrideOpen: (...args: any[]) => infer OverrideOpen;
    overrideClose: (...args: any[]) => infer OverrideClose;
  }
    ? CustomRules extends (infer A)[]
      ? A extends ParserAllRules
        ? { type: "override"; error: false; name: Name; begin: OverrideOpen; content: ParsedResultType<A>[]; end: OverrideClose; lastIndex: number }
        : never
      : never
    : never;

type StringifyOptions<T extends ParserAllRules, U extends ParsedResultType<T> = ParsedResultType<T>> = {
  refineElement?: (element: U | string | undefined) => string
  spacing?: boolean
  spaceAmount?: number
}

function stringify<T extends ParserAllRules, U extends ParsedResultType<T>>(nodes: U[], options?: StringifyOptions<T, U>, depth: number = 0): string {
  const space = options?.spacing ? duplicateStringContent("\t", (options?.spaceAmount ?? 1) * depth) : '';
  const lineReturn = options?.spacing ? '\r\n' : '';
  let result = '';
  for(let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if(node.type === "enclosed" || node.type === "override") { // This node is a sub element (an array if nothing goes wrong)
      if(!node.error) {
        result = `${result}${space}${(options?.refineElement && options.refineElement(node.begin as U)) ?? node.begin}${lineReturn}${stringify(node.content as U[] ?? [], options, depth + 1)}${lineReturn}${space}${(options?.refineElement && options.refineElement(node.end as U)) ?? node.end}${lineReturn}`;
      }
    }
    else { // It's a T or string, ez pz let's write it with some spacing
      result = `${result}${space}${(options?.refineElement && options.refineElement(node.content as U)) ?? node.content}${lineReturn}`;
    }
  }
  return result;
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
    regex: matchWordCharacter("digits", true),
    overrideContent: (fullMatch) => Number(fullMatch)
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

const prtsWithRules = overrideRules(prts, rulesPrt);

const rules = [
  grabWord,
  grabInt,
  prts,
  prtsWithRules
];
type usedRulesType = Unpack<typeof rules>

const parsedResult = parse<usedRulesType>("hello world, nice to meet you!", {
  ruleSet: rules
});

console.log(stringify<usedRulesType, ParsedResultType<usedRulesType>>(parsedResult.result, {
  refineElement: (element) => {
    if(typeof element === "string") {
      return element;
    }
    if(element?.type === "enclosed" || element?.type === "override") {
      return "enclosed something..."
    }
    return "";
  }
}))
if(parsedResult.result[0].type === "rule") {
  const prr = parsedResult.result[0]
  if(prr.name === "word") {
    prr.content
  } else {
    prr.content
  }
}
if(parsedResult.result[0].type === "enclosed") {
  const prr = parsedResult.result[0]
  if(prr.name === "parenthesis") {
    prr.content
  } else {
    if(prr.content) {
      const owo = prr.content[0]
      if(owo.name === "int") {
        owo.content
      }
    }
  }
}
if(parsedResult.result[0].type === "override") {
  const prr = parsedResult.result[0]
  if(prr.name === "parenthesis") {
    prr.content
  } else {
    prr.content
  }
}