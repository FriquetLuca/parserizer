/**
 * Get the type of the parameter, extending `typeof` to support `class` and `array` as native options.
 * @param {unknown} parameter The parameter to test.
 * @returns {string} The type attributed to the parameter.
 */
export function versatileTypeof(parameter: unknown): string {
  if(typeof parameter === 'function' && /^\s*class\s+/.test(parameter.toString())) {
    return 'class';
  }
  if(Array.isArray(parameter)) {
    return 'array';
  }
  return typeof parameter;
}