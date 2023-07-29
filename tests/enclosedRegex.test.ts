import * as parser from "../src";
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
      const prts = parser.defineEnclosedRule({
        name: "parenthesis",
        openHandler: {
          regex: /^\{/
        },
        closeHandler: {
          regex: /^\}/
        }
      });
      const grabAny = parser.defineRule({
        name: "any",
        handler: {
          regex: /^.{1}/
        }
      })
      const rules = [ prts, grabAny ];
      const parsed = parser.parse("Hello, my friend's name is {name}.", {
        ruleSet: rules
      });
      
      const testCaseOne = 'The parenthesis is correctly parsed with any characters';
      describe(testCaseOne, () => {
        it('should be the same', () => {
          expect(parser.stringify(parsed, { spacing: false, newLine: false })).toEqual("Hello, my friend's name is {name}.")
        })
      })
      describe(testCaseOne, () => {
        it('should be the same (with spaces)', () => {
          expect(parser.stringify(parsed, { spacing: true, newLine: true })).toEqual("H\r\ne\r\nl\r\nl\r\no\r\n,\r\n \r\nm\r\ny\r\n \r\nf\r\nr\r\ni\r\ne\r\nn\r\nd\r\n'\r\ns\r\n \r\nn\r\na\r\nm\r\ne\r\n \r\ni\r\ns\r\n \r\n{\r\n\tn\r\n\ta\r\n\tm\r\n\te\r\n\r\n}\r\n.\r\n")
        })
      })
      
      const testCaseTwo = 'The parenthesis is correctly extracted';
      describe(testCaseTwo, () => {
        it('should be the same', () => {
          expect(parser.stringify(parsed.result.filter(item => item.name === "parenthesis"), { spacing: false, newLine: false })).toEqual("{name}")
        })
      })
      describe(testCaseTwo, () => {
        it('should be the same (with spaces)', () => {
          expect(parser.stringify(parsed.result.filter(item => item.name === "parenthesis"), { spacing: true, newLine: true })).toEqual("{\r\n\tn\r\n\ta\r\n\tm\r\n\te\r\n\r\n}\r\n")
        })
      })
      
      // const testCaseThree = 'The parenthesis\'s content is correctly extracted';
      // const filterParenthesis = parsed.result.filter(item => item.type === "enclosed" && item.name === "parenthesis");
      // describe(testCaseThree, () => {
      //   it('should be the same', () => {
      //     expect(parser.stringify(filterParenthesis)).toEqual("name")
      //   })
      // })
      // describe(testCaseThree, () => {
      //   it('should be the same (with spaces)', () => {
      //     expect(parser.stringify(filterParenthesis, { spacing: true })).toEqual("n\r\na\r\nm\r\ne\r\n")
      //   })
      // })
    })
  })
})
