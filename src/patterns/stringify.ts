import IDataResult from "../interfaces/IDataResult";
function generateSpace(d: number): string {
  let spacing = '';
  for(let i = 0; i < d; i++) {
    spacing = `${spacing}\t`;
  }
  return spacing;
}
export function debugResult(nodes: IDataResult[], spacing: boolean = false, depth: number = 0) {
  const space = spacing ? generateSpace(depth) : '';
  const lineReturn = spacing ? '\n' : '';
  let result = '';
  for(let i = 0; i < nodes.length; i++) {
    if(nodes[i].nested) { // This node is a sub element (an array if nothing goes wrong)
      result = `${result}${space}[${nodes[i].name}][Nested]: ${nodes[i].begin}${lineReturn}`;
      if(!nodes[i].error) {
        result = `${result}${debugResult(nodes[i].content, spacing, depth + 1)}${space}${nodes[i].end}${lineReturn}`;
      }
    }
    else { // It's a string, ez pz let's write it with some spacing
      result = `${result}${space}[${nodes[i].name}]: ${nodes[i].content}${lineReturn}`;
    }
  }
  return result;
}
export function stringify(nodes: IDataResult[], spacing: boolean = false, depth: number = 0)
{
  const space = spacing ? generateSpace(depth) : '';
  const lineReturn = spacing ? '\r\n' : '';
  let result = '';
  for(let i = 0; i < nodes.length; i++) {
    if(nodes[i].nested) { // This node is a sub element (an array if nothing goes wrong)
      result = `${result}${space}${nodes[i].begin}${lineReturn}`;
      if(!nodes[i].error) {
        result = `${result}${stringify(nodes[i].content, spacing, depth + 1)}${lineReturn}${space}${nodes[i].end}${lineReturn}`;
      }
    }
    else { // It's a string, ez pz let's write it with some spacing
      result = `${result}${space}${nodes[i].content}${lineReturn}`;
    }
  }
  return result;
}