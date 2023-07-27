import { duplicateStringContent } from "../utils";
import { type ParsedResultType, type ParserAllRules } from "./parser";

export type StringifyOptions<T extends ParserAllRules, U extends ParsedResultType<T> = ParsedResultType<T>> = {
    refineElement?: (element: U | string | undefined) => string
    spacing?: boolean
    spaceAmount?: number
  }
  
export function stringify<T extends ParserAllRules, U extends ParsedResultType<T>>(nodes: U[], options?: StringifyOptions<T, U>, depth: number = 0): string {
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
