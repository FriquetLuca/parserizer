import { type ParsedResult, type ParsedContent, type ParsedEnclosedResult } from "../types";
import { generateSpace } from "../utils/generateSpace";

export function debugStringify<T>(nodes: ParsedContent<T>[], refineElement?: (element: T | string | undefined) => string, spacing: boolean = false, spaceAmount: number = 1, depth: number = 0) {
  const space = spacing ? generateSpace(spaceAmount * depth) : '';
  const lineReturn = spacing ? '\n' : '';
  let result = '';
  for(let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if((node as ParsedEnclosedResult<T>).nested) { // This node is a sub element (an array if nothing goes wrong)
      result = `${result}${space}[${node.name}][Nested]: ${(refineElement && refineElement((node as ParsedEnclosedResult<T>).begin)) ?? (node as ParsedEnclosedResult<T>).begin}${lineReturn}`;
      if(!(node as ParsedEnclosedResult<T>).error) {
        result = `${result}${debugStringify((node as ParsedEnclosedResult<T>).content ?? [], refineElement, spacing, spaceAmount, depth + 1)}${space}${(refineElement && refineElement((node as ParsedEnclosedResult<T>).end)) ?? (node as ParsedEnclosedResult<T>).end}${lineReturn}`;
      }
    }
    else { // It's a string, ez pz let's write it with some spacing
      result = `${result}${space}[${node.name}]: ${(refineElement && refineElement((node as ParsedResult<T>).content)) ?? (node as ParsedResult<T>).content}${lineReturn}`;
    }
  }
  return result;
}