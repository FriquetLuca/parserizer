import { overrideRules, type ParserEnclosedRule, type ParserRule } from "../rules";
import { countLines } from "../utils";

type ParserEnclosedOverrideRule<NewRules extends ParserEnclosedRule<string, unknown>|ParserRule<string, unknown>, RuleName extends string, ResultType extends unknown = string> = ReturnType<typeof overrideRules<NewRules, RuleName, ResultType>>;
export type ParserAllRules = ParserEnclosedRule<string, unknown>|ParserRule<string, unknown>|ParserEnclosedOverrideRule<any, string, unknown>;

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

type ParseProps<T> = {
  ruleSet: T[];
  endPattern?: (i: number, t: string) => boolean;
}

export type ParsedRule<Rules extends ParserAllRules> = TransformRule<Extract<Rules, { type: "rule" }>>;

type GetNameProp<T> = T extends { name: infer Name } ? Name extends never ? never : T : T;

export type MergeProperties<T> =
  GetNameProp<T extends object
    ? { [K in keyof T]: MergeProperties<T[K]> }
    : T>

export type ParsedEnclosedRule<Rules extends ParserAllRules> = {
  type: "enclosed";
  name: Extract<Rules, { type: "enclosed" }>["name"];
  error: false;
  begin: ReturnType<Extract<Rules, { type: "enclosed" }>["overrideOpen"]>;
  content: MergeProperties<ParsedResultType<Rules>>[];
  end: ReturnType<Extract<Rules, { type: "enclosed" }>["overrideClose"]>;
  lastIndex: number;
  lines: number;
  lineChar: number;
} | {
  type: "enclosed";
  name: Extract<Rules, { type: "enclosed"; }>["name"];
  content: null;
  error: true;
  lastIndex: number;
  lines: number;
  lineChar: number;
};

export type ParsedOverrideRule<Rules extends ParserAllRules> = TransformOverrideEnclosedRule<Extract<Rules, { type: "override" }>> | {
  type: "override",
  name: Extract<Rules, { type: "override" }>["name"];
  content: null;
  error: true;
  lastIndex: number;
  lines: number;
  lineChar: number;
}

export type ParsedResultType<Rules extends ParserAllRules> = ParsedRule<Rules> | ParsedEnclosedRule<Rules> | ParsedOverrideRule<Rules>;

export type Parsed<T extends ParserAllRules> = {
  type: "result"
  result: MergeProperties<ParsedResultType<T>>[]
  lastIndex: number
  lines: number;
  lineChar: number;
} | {
  type: "endResult"
  result: MergeProperties<ParsedResultType<T>>[]
  lastIndex: number
  lines: number;
  lineChar: number;
};

export function parse<T extends ParserAllRules>(input: string, options: ParseProps<T>, i: number = 0): MergeProperties<Parsed<T>> {
    const subdivided: MergeProperties<ParsedResultType<T>>[] = []; // A result called subdivided since it's the input subdivided in multiple pieces.
    for(; i < input.length; i++) // Let's navigate the input
    {
      if(options.endPattern && options.endPattern(i, input)) // We're in a nested pattern that just ended
      {
        return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
          type: "endResult" as "endResult",
          result: subdivided,
          lastIndex: i
        } as MergeProperties<Parsed<T>>;
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
                  lastIndex: nestedElements.lastIndex + fullCloseMatch.length
                } as unknown as TransformEnclosedRule<Extract<T, { type: "enclosed" }>, T>;
                const lineData = countLines(input, i);
                i = fetchResult.lastIndex;
                subdivided.push({
                  ...fetchResult,
                  ...lineData,
                } as MergeProperties<typeof fetchResult & typeof lineData>);
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
                } as MergeProperties<typeof fetchResult & typeof lineData>);
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
                  lastIndex: (nestedElements.lastIndex) as number + fullCloseMatch.length
                };
                const lineData = countLines(input, i);
                i = fetchResult.lastIndex;
                subdivided.push({
                  ...fetchResult,
                  ...lineData,
                } as unknown as MergeProperties<TransformOverrideEnclosedRule<Extract<T, { type: "override" }>>>);
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
                } as MergeProperties<typeof fetchResult & typeof lineData>);
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
              } as MergeProperties<typeof fetchResult & typeof lineData>);
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
    } as MergeProperties<Parsed<T>>;
  }
  