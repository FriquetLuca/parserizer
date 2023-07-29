import type { MergeProperties, ParsedRule, ParsedResultType, ParserAllRules, ParsedEnclosedRule, ParsedOverrideRule, Parsed } from "./parser";
import { duplicateStringContent } from "../utils";

type ExtractEnclosedErrors<T, U extends boolean> = T extends { error: U } ? T : never;

type DepthData = {
  depth: number;
  depthSpace: string;
  lineReturn: string;
};
export type StringifyOptions<T extends ParserAllRules, U extends MergeProperties<ParsedResultType<T>>> = {
  refineEnclosedRules?: (element: MergeProperties<ExtractEnclosedErrors<ParsedEnclosedRule<T>|ParsedOverrideRule<T>, false>>, depth: DepthData, options?: StringifyOptions<T, U>) => string
  refineErrors?: (element: MergeProperties<ExtractEnclosedErrors<ParsedEnclosedRule<T>|ParsedOverrideRule<T>, true>>, depth: DepthData, options?: StringifyOptions<T, U>) => string
  refineRules?: (element: MergeProperties<ParsedRule<T>>) => string
  newLine?: boolean
  spacing?: boolean
  spaceAmount?: number
}

export function stringify<T extends ParserAllRules, U extends MergeProperties<ParsedResultType<T>> = MergeProperties<ParsedResultType<T>>>(nodes: (U[])|MergeProperties<Parsed<T>>, options?: StringifyOptions<T, U>, depth: number = 0): string {
    if(!Array.isArray(nodes)) {
      return stringify<T, U>(nodes.result as U[], options, depth);
    }
    const space = options?.spacing ? duplicateStringContent("\t", (options?.spaceAmount ?? 1) * depth) : '';
    const lineReturn = options?.newLine ? '\r\n' : '';
    let result = '';
    for(let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if(node.type === "enclosed" || node.type === "override") { // This node is a sub element (an array if nothing goes wrong)
        if(node.error) {
          if(options?.refineErrors) {
            result = `${result}${space}${options.refineErrors(node as MergeProperties<ExtractEnclosedErrors<ParsedEnclosedRule<T>|ParsedOverrideRule<T>, true>>, {
              depth,
              depthSpace: space,
              lineReturn
            }, options)}${lineReturn}`;
          }
        } else {
          if(options?.refineEnclosedRules) {
            result = `${result}${space}${options.refineEnclosedRules(node as MergeProperties<ExtractEnclosedErrors<ParsedEnclosedRule<T>|ParsedOverrideRule<T>, false>>, {
              depth,
              depthSpace: space,
              lineReturn
            }, options)}${lineReturn}`;
          } else {
            result = `${result}${space}${node.begin}${lineReturn}${stringify(node.content as U[] ?? [], options, depth + 1)}${lineReturn}${space}${node.end}${lineReturn}`;
          }
        }
      }
      else { // It's a T or string, ez pz let's write it with some spacing
        result = `${result}${space}${(
          options?.refineRules
          && options.refineRules(node as MergeProperties<ParsedRule<T>>))
          ?? node.content
        }${lineReturn}`;
      }
    }
    return result;
  }
