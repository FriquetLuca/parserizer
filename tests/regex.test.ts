import { parse, StringifyResult, regex } from "../src";
/*
  word: (name: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp("^[^\\W\\d_]+", caseInsensitive ? "i" : ""), defaultValue),
  keyword: (name: string, keyword: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(`^${keyword}\\b`, caseInsensitive ? "i" : ""), name),
  whitespaces: (name: string, defaultValue: string) => Seeker.field(name, /[ \t\f\r]/, defaultValue),
  exactMatch: (name: string, content: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(content.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), caseInsensitive ? "i" : ""), defaultValue),
  any: (name: string, defaultValue: string, includeTerminators: boolean = true) => Seeker.field(name, new RegExp("^.{1}", includeTerminators ? "s" : ""), defaultValue),
*/

describe('Regex', () => {
  describe('Word', () => {
    const grabWord = regex<string>({
      name: "word",
      handler: {
        regex: /^[^\W\d_]+/
      }
    })
    describe('Parse simple words only', () => {
      describe('Only the words are extracted and spaced by a new line', () => {
        it('should be equal', () => {
          const parserized = parse<string>("Hello, my friend's name is {name}.", [ grabWord ]);
          expect(StringifyResult(parserized)).toEqual("Hello\r\nmy\r\nfriend\r\ns\r\nname\r\nis\r\nname\r\n")
        })
      })
      describe('Only the words are extracted and then concatenated into a string', () => {
        it('should be equal', () => {
          const parserized = parse<string>("Hello, my friend's name is {name}.", [ grabWord ]);
          expect(StringifyResult(parserized, undefined, false)).toEqual("Hellomyfriendsnameisname")
        })
      })
    })
  })
})