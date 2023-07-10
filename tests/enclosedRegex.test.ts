import parse, { enclosedRegex, StringifyResult } from "../src";
describe('EncloseRegex', () => {
  describe('Parenthesis', () => {
    const prts = enclosedRegex({
      name: "parenthesis",
      openHandler: {
        regex: /^\{/
      },
      closeHandler: {
        regex: /^\}/
      }
    });
    describe('Parse simple parenthesis', () => {
      const parserized = parse("Hello, my friend's name is {name}.", [ prts ]);
      describe('The parenthesis is correctly extracted (with spaces)', () => {
        it('should be the same', () => {
          expect(StringifyResult(parserized)).toEqual("{\r\n\r\n}\r\n")
        })
      })
      describe('The parenthesis is correctly extracted (without spaces)', () => {
        it('should be the same', () => {
          expect(StringifyResult(parserized, false)).toEqual("{}")
        })
      })
    })
  })
})