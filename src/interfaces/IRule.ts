import IDataResult from "@/interfaces/IDataResult";

/**
 * A basic rule to catch a pattern.
 */
export default interface IRule {
  /**
   * Name of the rule.
   */
  name?: string,
  /**
   * Default value of the rule in case something wrong happen.
   */
  defaultValue?: any,
  /**
   * The string that begin the charbox.
   */
  begin?: string,
  /**
   * The string that end the charbox.
   */
  end?: string,
  /**
   * Function predicate to know when a pattern start.
   */
  isPattern: (i: number, t: string) => boolean,
  /**
   * Function predicate to know when a pattern end.
   */
  isPatternEnd?: (i: number, t: string) => boolean,
  /**
   * A function to handle the data fetching.
   */
  fetch: (i: number, t: string, isPatternEnd?: (i: number, t: string) => boolean, patternSet?: IRule[]) => IDataResult,
  /**
   * Copy the rule for a clean regex check.
   */
  copy?: () => IRule
}