import { parse, enclosedRegex, StringifyResult, regex, ParsedContent } from "../src";
/*
  word: (name: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp("^[^\\W\\d_]+", caseInsensitive ? "i" : ""), defaultValue),
  keyword: (name: string, keyword: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(`^${keyword}\\b`, caseInsensitive ? "i" : ""), name),
  whitespaces: (name: string, defaultValue: string) => Seeker.field(name, /[ \t\f\r]/, defaultValue),
  exactMatch: (name: string, content: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(content.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), caseInsensitive ? "i" : ""), defaultValue),
  any: (name: string, defaultValue: string, includeTerminators: boolean = true) => Seeker.field(name, new RegExp("^.{1}", includeTerminators ? "s" : ""), defaultValue),
*/

describe('EncloseRegex', () => {
  describe('Container', () => {
    describe('Parse simple parenthesis and any characters', () => {
      const prts = enclosedRegex<string>({
        name: "parenthesis",
        openHandler: {
          regex: /^\{/
        },
        closeHandler: {
          regex: /^\}/
        }
      });
      const grabAny = regex<string>({
        name: "any",
        handler: {
          regex: /^.{1}/
        }
      })
      const parserized = parse<string>("Hello, my friend's name is {name}.", [ prts, grabAny ]);
      const testCaseOne = 'The parenthesis is correctly parsed with any characters';
      const testCaseTwo = 'The parenthesis is correctly extracted';
      describe(testCaseOne, () => {
        it('should be the same (with spaces)', () => {
          expect(StringifyResult(parserized)).toEqual("H\r\ne\r\nl\r\nl\r\no\r\n,\r\n \r\nm\r\ny\r\n \r\nf\r\nr\r\ni\r\ne\r\nn\r\nd\r\n'\r\ns\r\n \r\nn\r\na\r\nm\r\ne\r\n \r\ni\r\ns\r\n \r\n{\r\n\tn\r\n\ta\r\n\tm\r\n\te\r\n\r\n}\r\n.\r\n")
        })
      })
      describe(testCaseOne, () => {
        it('should be the same (without spaces)', () => {
          expect(StringifyResult(parserized, undefined, false)).toEqual("Hello, my friend's name is {name}.")
        })
      })
      describe(testCaseTwo, () => {
        it('should be the same (with spaces)', () => {
          expect(StringifyResult(parserized.result.filter(item => item.name === "parenthesis"))).toEqual("{\r\n\tn\r\n\ta\r\n\tm\r\n\te\r\n\r\n}\r\n")
        })
      })
      describe(testCaseTwo, () => {
        it('should be the same (without spaces)', () => {
          expect(StringifyResult(parserized.result.filter(item => item.name === "parenthesis"), undefined, false)).toEqual("{name}")
        })
      })
    })
  })
})