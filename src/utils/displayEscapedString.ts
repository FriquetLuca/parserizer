export function displayEscapedString(string: string) {
  let result = '';
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    const code = char.charCodeAt(0);
    if (code < 32 || code > 126) {
      result += `\\u${code.toString(16).padStart(4, '0')}`;
    } else {
      result += char;
    }
  }
  return result;
}