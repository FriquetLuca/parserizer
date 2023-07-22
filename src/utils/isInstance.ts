/**
 * Return true if an object is an instance of a specified class, false otherwise.
 * @param obj The object to test.
 * @param constructor The class.
 * @returns True if an object is an instance of a specified class, false otherwise.
 */
export function isInstance<T>(obj: any, constructor: new (...args: any[]) => T): obj is T {
  return obj instanceof constructor;
}
