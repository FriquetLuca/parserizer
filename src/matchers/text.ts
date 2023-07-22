/**
 * Return a regex to test out for a word character.
 * @param shouldBe Determine what kind of character we're going to test.
 * @param many Allow for more than one word character.
 * @returns A regex to test out for a word character.
 */
export const matchWordCharacter = (shouldBe: "letters" | "digits" | "underscore" | "letters-digits" | "letters-digits-underscore", many: boolean = false) => {
  switch(shouldBe) {
    case "underscore":
      return many ? /^[_]+/ : /^[_]/;
    case "letters":
      return many ? /^[A-Za-z]+/ : /^[A-Za-z]/;
    case "digits":
      return many ? /^[0-9]+/ : /^[0-9]/;
    case "letters-digits":
      return many ? /^[A-Za-z0-9]+/ : /^[A-Za-z0-9]/;
    default:
      return many ? /^[^\W]+/ : /^[^\W]/;
  }
};
/**
 * Return a regex to test out for a keyword.
 * @param keyword The keyword to test.
 * @param caseInsensitive Should the test be case insensitive or not.
 * @returns A regex to test out for a keyword.
 */
export const matchKeyword = (keyword: string, caseInsensitive: boolean = false) => new RegExp(`^${keyword}\\b`, caseInsensitive ? "i" : "");
/**
 * Return a regex to test out for keywords.
 * @param keyword The list of keywords to test.
 * @param caseInsensitive Should the test be case insensitive or not.
 * @returns A regex to test out for keywords.
 */
export const matchKeywords = (keywords: string[], caseInsensitive: boolean = false) => new RegExp(`^${keywords.reduce((prev, current, index) => index > 0 ? `${prev}|${current}` : current)}\\b`, caseInsensitive ? "i" : "");
/**
 * Return a regex that always return true for an existing character (doesn't include terminators by default).
 * @param includeTerminators If true, it will also include terminators.
 * @returns A regex that always return true for an existing character.
 */
export const matchAny = (includeTerminators: boolean = true) => new RegExp("^.{1}", includeTerminators ? "s" : "");
/**
 * Return a regex to test out a specific content.
 * @param matchingContent The specific content to match.
 * @param caseInsensitive Should the test be case insensitive or not.
 * @returns A regex to test out a specific content.
 */
export const matchPrecise = (matchingContent: string, caseInsensitive: boolean = false) => new RegExp(matchingContent.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), caseInsensitive ? "i" : "");
/**
 * Return a regex to test out for a whitespace character.
 * @param many Allow for more than one whitespace.
 * @returns A regex to test out for whitespaces.
 */
export const matchWhitespace = (many: boolean = false) => many ? /[ \t\f\r]+/ : /[ \t\f\r]/;
