/**
 * Count the number of lines and gives the character position at a specified index.
 * @param content The string content where we want to count the lines and the character position.
 * @param specifiedIndex The index which we want to get the character position in the line and the line from.
 * @returns The character position and the line of the specified Index.
 */
export function countLines(content: string, specifiedIndex?: number) {
  const result = {
    lines: 1,
    lineChar: 0
  };
  const lastIndex = specifiedIndex ?? content.length - 1;
  for(let i = 0; i <= lastIndex; i++) {
    result.lineChar++;
    if(content[i] === '\n') {
      result.lines++;
      result.lineChar = 0;
    }
  }
  return result;
}
