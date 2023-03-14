/**
 * A pattern founded with some datas.
 */
export default interface IDataResult {
  /**
   * The name of the pattern.
   */
  name?: string,
  /**
   * The current name of the pattern, in case it was renamed.
   */
  currentName?: string,
  /**
   * The beggining of the pattern.
   */
  begin?: string,
  /**
   * The end of the pattern.
   */
  end?: string,
  /**
   * If the pattern is nested.
   */
  nested?: boolean,
  /**
   * The content of the pattern.
   */
  content?: any,
  /**
   * If the pattern has gotten any errors on the way.
   */
  error?: boolean,
  /**
   * The line of the pattern.
   */
  line?: number,
  /**
   * The line of the character.
   */
  lineChar?: number,
  /**
   * The last index of the pattern.
   */
  lastIndex?: number
}