/**
 * Return a regex to test for an integer.
 * @returns A regex to test for an integer.
 */
export const matchInteger = () => /^\d+/; //
/**
* Return a regex to test for an integer.
* @returns A regex to test for an integer.
*/
export const matchBigInteger = () => /^\d+n\b/;
/**
 * Return a regex to test for a float.
 * @returns A regex to test for a float.
 */
export const matchFloat = (separator: "decimal-part" | "dot" | "coma" | "coma-or-dot") => {
  switch(separator) {
    case "coma":
      return /^((\d+([,])?\d+)|(([,])?\d+))/;
    case "dot":
      return /^((\d+([.])?\d+)|(([.])?\d+))/;
    case "coma-or-dot":
      return /^((\d+([.,])?\d+)|(([.,])?\d+))/;
    default:
      return /^([.,]\d+)/;
  }
};
