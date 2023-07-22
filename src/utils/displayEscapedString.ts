/**
 * Display the string as an escaped unicode text content, helping out to checkout for new lines or other weird characters that can't be visible on the console easily.
 * @param text The string to encode in unicode.
 * @returns The escaped string.
 */
export function displayEscapedString(text: string) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    if (code < 32 || code > 126) {
      result += `\\u${code.toString(16).padStart(4, '0')}`;
    } else {
      result += char;
    }
  }
  return result;
}
