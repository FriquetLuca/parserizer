import Parserizer, { Seeker, StringifyDebug, StringifyResult } from "../src";
describe('Box', () => {
  describe('Parenthesis', () => {
    const prts = Seeker.box("parenthesis", /^\{/, /^\}/, "{", "}");
    describe('Parse simple parenthesis', () => {
      const parserized = Parserizer("Hello, my friend's name is {name}.", [ prts ]);
      describe('The string inside the parenthesis is correctly extracted', () => {
        it('should be the same', () => {
          expect(StringifyResult(parserized, false)).toEqual("{}")
          expect(StringifyResult(parserized)).toEqual("{\r\n\r\n}\r\n")
        })
      })
    })
  })
})