import type { ParserContentResult, ParserResult, ParserRules } from "../interfaces";
import { countLines } from "../utils";

export function parse<T extends unknown = string>(txtContent: string, patternSet: ParserRules<T>, i: number = 0, endPattern: (i: number, t: string) => boolean = () => { return false; }) {
  const subdivided: ParserContentResult<T> = []; // A result called subdivided since it's the input subdivided in multiple pieces.
  for(; i < txtContent.length; i++) // Let's navigate the input
  {
    if(endPattern(i, txtContent)) // We're in a nested pattern that just ended
    {
      return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
        type: "endResult",
        result: subdivided,
        lastIndex: i
      } as ParserResult<T>;
    }
    for(let j = 0; j < patternSet.length; j++) // Let's check all the possible patterns
    {
      const currentPattern = patternSet[j];
      if(currentPattern.type === "enclosed") {
        const enclosedRule = currentPattern.copy() as typeof currentPattern;
        if(enclosedRule.isPattern(i, txtContent)) // It's the pattern, let's execute something
        {
          const fetchResult = enclosedRule.fetch(i, txtContent, enclosedRule.isPatternEnd, patternSet); // Execute something then return the fetched result
          if(fetchResult.lastIndex === undefined) {
            throw new Error('Missing returned lastIndex in a fetch.');
          }
          const lineData = countLines(txtContent, i);
          i = fetchResult.lastIndex; // Assign the new index else
          subdivided.push({
            ...fetchResult,
            ...lineData
          }); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
          break; // No need to check more pattern, we've got one already
        }
      } else {
        if(currentPattern.isPattern(i, txtContent)) // It's the pattern, let's execute something
        {
          const fetchResult = currentPattern.fetch(i, txtContent); // Execute something then return the fetched result
          if(fetchResult.lastIndex === undefined) {
            throw new Error('Missing returned lastIndex in a fetch.');
          }
          const lineData = countLines(txtContent, i);
          i = fetchResult.lastIndex; // Assign the new index
          subdivided.push({
            ...fetchResult,
            ...lineData,
          }); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
          break; // No need to check more pattern, we've got one already
        }
      }      
    }
  }
  return { // We've done it 'till the end, no pattern ended over here
    type: "result",
    result: subdivided,
    lastIndex: i - 1
  } as ParserResult<T>;
}
