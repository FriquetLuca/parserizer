import countLines from "@/utils/countLines";
import type IDataResult from "@/interfaces/IDataResult";
import type IResult from "@/interfaces/IResult";
import type IRule from "@/interfaces/IRule";

export default function parse(txtContent: string, patternSet: IRule[], i: number = 0, endPattern: (i: number, t: string) => boolean = (i: number, t: string) => { return false; }): IResult {
  const subdivided: IDataResult[] = []; // A result called subdivided since it's the input subdivided in multiple pieces.
  for(; i < txtContent.length; i++) // Let's navigate the input
  {
    if(endPattern(i, txtContent)) // We're in a nested pattern that just ended
    {
      return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
        isPatternEnd: true,
        result: subdivided,
        lastIndex: i
      };
    }
    for(let j = 0; j < patternSet.length; j++) // Let's check all the possible patterns
    {
      const currentPattern = patternSet[j];
      const currentRule = currentPattern.copy ? currentPattern.copy() : currentPattern;
      if(currentRule.isPattern(i, txtContent)) // It's the pattern, let's execute something
      {
        const lineData = countLines(txtContent, i);
        const fetchResult = currentRule.fetch(i, txtContent, currentRule.isPatternEnd, patternSet); // Execute something then return the fetched result
        if(fetchResult.lastIndex !== undefined) {
          i = fetchResult.lastIndex; // Assign the new index
        } else {
          throw new Error('Missing returned lastIndex in a fetch.');
        }
        let resultObject: IDataResult = {
          name: currentRule?.name,
          currentName: fetchResult?.name,
          begin: fetchResult?.begin,
          end: fetchResult?.end,
          nested: fetchResult?.nested,
          content: fetchResult?.content,
          error: fetchResult?.error,
          line: lineData?.lines,
          lineChar: lineData?.lineChar
        };
        subdivided.push(resultObject); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
        break; // No need to check more pattern, we've got one already
      }
    }
  }
  return { // We've done it 'till the end, no pattern ended over here
    isPatternEnd: false,
    result: subdivided,
    lastIndex: i - 1
  };
}
