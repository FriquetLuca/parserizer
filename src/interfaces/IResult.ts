import IDataResult from "./IDataResult";
/**
 * A representation of the result of a pattern.
 */
export default interface IResult {
  /**
   * If the pattern is an ending pattern.
   */
  isPatternEnd: boolean;
  /**
   * The pattern founded.
   */
  result: IDataResult[];
  /**
   * The last index of the pattern.
   */
  lastIndex: number;
}