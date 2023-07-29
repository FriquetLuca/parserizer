import * as parser from "../src";
/*
  const testCases = [
  "123 abc",
  "123.45 abc",
  "123,45 abc",
  "0.5 abc",
  "0,5 abc",
  "0, abc",
  "0. abc",
  ".5 abc",
  ",5 abc",
  "abc123",
  "abc123.",
  "abc123,",
  "abc123.123",
  "abc123,123",
  "123abc",
  "123.abc",
  "123,abc",
  "123.123abc",
  "123,123abc",
  "12.34.56",
  "12,34.56",
  "12.34,56",
  "12,34,56"
];

const regex = /^(([0-9]+([.,])?[0-9]+)|([.,][0-9]+))/;
console.log("> REGEX");
for(const testCase of testCases) {
  const exec = regex.exec(testCase);
  console.log(testCase, regex.test(testCase), exec && exec[0]);
}
*/

describe('Regex', () => {
  describe('Word', () => {
    const grabWord = parser.defineRule({
      name: "word",
      handler: {
        regex: /^[^\W\d_]+/
      }
    })
    const rules = [ grabWord ];const parserized = parser.parse("Hello, my friend's name is {name}.", {
      ruleSet: rules
    });
    
    describe('Parse simple words only', () => {
      describe('Only the words are extracted and spaced by a new line', () => {
        it('should be equal', () => {
          expect(parser.stringify(parserized, { spacing: false, newLine: true })).toEqual("Hello\r\nmy\r\nfriend\r\ns\r\nname\r\nis\r\nname\r\n")
        })
      })
      describe('Only the words are extracted and then concatenated into a string', () => {
        it('should be equal', () => {
          expect(parser.stringify(parserized, { spacing: false, newLine: false })).toEqual("Hellomyfriendsnameisname")
        })
      })
    })
  })
})