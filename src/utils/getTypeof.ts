/**
 * Get the type of the parameter, extending `typeof` to support `class`, `array` and "null" as native options.
 * @param parameter An unknown parameter that we want the type from.
 * @returns The type the parameter is from.
 */
export function getTypeof(parameter: any) {
  if(parameter === null) {
    return "null";
  }
  if(Array.isArray(parameter)) {
    return "array";
  }
  if(typeof parameter === "function" && /^\s*class\s+/.test(parameter.toString())) {
    return "class";
  }
  return typeof parameter;
}
