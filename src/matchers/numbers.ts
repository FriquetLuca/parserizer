const numberMatchers = {
  "integer": /^\d+/,
  "big-integer": /^\d+n\b/,
  "coma": /^((\d+([,])?\d+)|(([,])?\d+))/,
  "dot": /^((\d+([.])?\d+)|(([.])?\d+))/,
  "coma-or-dot": /^((\d+([.,])?\d+)|(([.,])?\d+))/,
  "coma-decimal-part": /^([,]\d+)/,
  "dot-decimal-part": /^([.]\d+)/,
  "decimal-part": /^([.,]\d+)/,
}

/**
 * Get a regex to test for a number.
 * @returns A regex to test for a number.
 */
export const matchNumber = (separator: keyof typeof numberMatchers) => numberMatchers[separator]
