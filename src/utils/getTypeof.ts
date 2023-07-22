/**
 * Get the type of the parameter, extending `typeof` to support `class` and `array` as native options.
 * @param parameter An unknown parameter that we want the type from.
 * @returns The type the parameter is from.
 */
export function getTypeof(parameter: unknown) {
  if(typeof parameter === "function" && /^\s*class\s+/.test(parameter.toString())) {
    return "class";
  }
  if(Array.isArray(parameter)) {
    return "array";
  }
  return typeof parameter;
}
