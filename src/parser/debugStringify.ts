import { type ParsedContent, type ParsedEnclosedResult } from "../types";
import generateSpace from "../utils/generateSpace";

export function debugStringify(nodes: ParsedContent[], spacing: boolean = false, spaceAmount: number = 1, depth: number = 0) {
  const space = spacing ? generateSpace(spaceAmount * depth) : '';
  const lineReturn = spacing ? '\n' : '';
  let result = '';
  for(let i = 0; i < nodes.length; i++) {
    if((nodes[i] as ParsedEnclosedResult).nested) { // This node is a sub element (an array if nothing goes wrong)
      const nestedNode = nodes[i] as ParsedEnclosedResult;
      result = `${result}${space}[${nestedNode.name}][Nested]: ${nestedNode.begin}${lineReturn}`;
      if(!nestedNode.error) {
        result = `${result}${debugStringify(nestedNode.content ?? [], spacing, spaceAmount, depth + 1)}${space}${nestedNode.end}${lineReturn}`;
      }
    }
    else { // It's a string, ez pz let's write it with some spacing
      result = `${result}${space}[${nodes[i].name}]: ${nodes[i].content}${lineReturn}`;
    }
  }
  return result;
}