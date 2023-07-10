export default function countLines(content: string, maxIndex?: number) {
  const result = {
    lines: 1,
    lineChar: 0
  };
  const lastIndex = maxIndex ?? content.length - 1;
  for(let i = 0; i <= lastIndex; i++) {
    result.lineChar++;
    if(content[i] === '\n') {
      result.lines++;
      result.lineChar = 0;
    }
  }
  return result;
}