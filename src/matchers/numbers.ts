/**
 * Return a regex to test for an integer.
 * @returns A regex to test for an integer.
 */
export const matchInteger = () => /^[0-9]+/;
/**
 * Return a regex to test for a float.
 * @returns A regex to test for a float.
 */
export const matchFloat = (separator: "decimal-part" | "dot" | "coma" | "coma-or-dot") => {
  switch(separator) {
    case "coma":
      return /^(([0-9]+([,])?[0-9]+)|([,][0-9]+))/;
    case "dot":
      return /^(([0-9]+([.])?[0-9]+)|([.][0-9]+))/;
    case "coma-or-dot":
      return /^(([0-9]+([.,])?[0-9]+)|([.,][0-9]+))/;
    default:
      return /^([.,][0-9]+)/;
  }
};
