import type { CurrentEnclosedResult, CurrentErrorResult, CurrentResult, ParserContentResult, StringifyOptions } from "../interfaces";
import { duplicateStringContent } from "../utils/duplicateStringContent";

export function stringify<T>(nodes: ParserContentResult<T>, options?: StringifyOptions<T>, depth: number = 0) {
  const space = options?.spacing ? duplicateStringContent("\t", (options?.spaceAmount ?? 1) * depth) : '';
  const lineReturn = options?.spacing ? '\r\n' : '';
  let result = '';
  for(let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if((node as CurrentEnclosedResult<T>).nested) { // This node is a sub element (an array if nothing goes wrong)
      result = `${result}${space}${(options?.refineElement && options.refineElement((node as CurrentEnclosedResult<T>).begin)) ?? (node as CurrentEnclosedResult<T>).begin}${lineReturn}`;
      if(!(node as CurrentErrorResult<T>).error) {
        result = `${result}${stringify((node as CurrentEnclosedResult<T>).content ?? [], options, depth + 1)}${lineReturn}${space}${(options?.refineElement && options.refineElement((node as CurrentEnclosedResult<T>).end)) ?? (node as CurrentEnclosedResult<T>).end}${lineReturn}`;
      }
    }
    else { // It's a T or string, ez pz let's write it with some spacing
      result = `${result}${space}${(options?.refineElement && options.refineElement((node as CurrentResult<T>).content)) ?? (node as CurrentResult<T>).content}${lineReturn}`;
    }
  }
  return result;
}
