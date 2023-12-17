import * as parser from "../../src"

describe('Number Matcher', () => {
  describe('Match Integer Notation', () => {
    it('should be equal', () => {
      expect(
        regexTester(
          parser.matchers.matchInteger(), 
          [
            {
              content: "123 abc",
              value: "123"
            },
            {
              content: "123.45 abc",
              value: "123"
            },
            {
              content: "123,45 abc",
              value: "123"
            },
            {
              content: "0.5 abc",
              value: "0"
            },
            {
              content: "0,5 abc",
              value: "0"
            },
            {
              content: "0, abc",
              value: "0"
            },
            {
              content: "0. abc",
              value: "0"
            },
            {
              content: ".5 abc",
              value: null
            },
            {
              content: ",5 abc",
              value: null
            },
            {
              content: "abc123",
              value: null
            },
            {
              content: "abc123.",
              value: null
            },
            {
              content: "abc123,",
              value: null
            },
            {
              content: "abc123.123",
              value: null
            },
            {
              content: "abc123,123",
              value: null
            },
            {
              content: "123abc",
              value: "123"
            },
            {
              content: "123.abc",
              value: "123"
            },
            {
              content: "123,abc",
              value: "123"
            },
            {
              content: "123.123abc",
              value: "123"
            },
            {
              content: "123,123abc",
              value: "123"
            },
            {
              content: "12.34.56",
              value: "12"
            },
            {
              content: "12,34.56",
              value: "12"
            },
            {
              content: "12.34,56",
              value: "12"
            },
            {
              content: "12,34,56",
              value: "12"
            }
          ]
        )
      )
      .toEqual(true)
    })
  })

  describe('Match Big Integer Notation', () => {
    it('should be equal', () => {
      expect(
        regexTester(
          parser.matchers.matchBigInteger(), 
          [
            {
              content: "123n abc",
              value: "123n"
            },
            {
              content: "123nabc",
              value: null
            },
            {
              content: "123.nabc",
              value: null
            },
            {
              content: "123,nabc",
              value: null
            },
            {
              content: "123n.nabc",
              value: "123n"
            },
            {
              content: "123n,nabc",
              value: "123n"
            },
          ]
        )
      )
      .toEqual(true)
    })
  })

  describe('Match Float Dot Notation', () => {
    it('should be equal', () => {
      expect(
        regexTester(
          parser.matchers.matchFloat("dot"), 
          [
            {
              content: "123 abc",
              value: "123"
            },
            {
              content: "123.45 abc",
              value: "123.45"
            },
            {
              content: "123,45 abc",
              value: "123"
            },
            {
              content: "0.5 abc",
              value: "0.5"
            },
            {
              content: "0,5 abc",
              value: "0"
            },
            {
              content: "0, abc",
              value: "0"
            },
            {
              content: "0. abc",
              value: "0"
            },
            {
              content: ".5 abc",
              value: ".5"
            },
            {
              content: ",5 abc",
              value: null
            },
            {
              content: ".5abc",
              value: ".5"
            },
            {
              content: ",5abc",
              value: null
            },
            {
              content: "abc123",
              value: null
            },
            {
              content: "abc123.",
              value: null
            },
            {
              content: "abc123,",
              value: null
            },
            {
              content: "abc123.123",
              value: null
            },
            {
              content: "abc123,123",
              value: null
            },
            {
              content: "123abc",
              value: "123"
            },
            {
              content: "123.abc",
              value: "123"
            },
            {
              content: "123,abc",
              value: "123"
            },
            {
              content: "123.123abc",
              value: "123.123"
            },
            {
              content: "123,123abc",
              value: "123"
            },
            {
              content: "12.34.56",
              value: "12.34"
            },
            {
              content: "12,34.56",
              value: "12"
            },
            {
              content: "12.34,56",
              value: "12.34"
            },
            {
              content: "12,34,56",
              value: "12"
            }
          ]
        )
      )
      .toEqual(true)
    })
  })

  describe('Match Float Coma Notation', () => {
    it('should be equal', () => {
      expect(
        regexTester(
          parser.matchers.matchFloat("coma"), 
          [
            {
              content: "123 abc",
              value: "123"
            },
            {
              content: "123.45 abc",
              value: "123"
            },
            {
              content: "123,45 abc",
              value: "123,45"
            },
            {
              content: "0.5 abc",
              value: "0"
            },
            {
              content: "0,5 abc",
              value: "0,5"
            },
            {
              content: "0, abc",
              value: "0"
            },
            {
              content: "0. abc",
              value: "0"
            },
            {
              content: ".5 abc",
              value: null
            },
            {
              content: ",5 abc",
              value: ",5"
            },
            {
              content: ".5abc",
              value: null
            },
            {
              content: ",5abc",
              value: ",5"
            },
            {
              content: "abc123",
              value: null
            },
            {
              content: "abc123.",
              value: null
            },
            {
              content: "abc123,",
              value: null
            },
            {
              content: "abc123.123",
              value: null
            },
            {
              content: "abc123,123",
              value: null
            },
            {
              content: "123abc",
              value: "123"
            },
            {
              content: "123.abc",
              value: "123"
            },
            {
              content: "123,abc",
              value: "123"
            },
            {
              content: "123.123abc",
              value: "123"
            },
            {
              content: "123,123abc",
              value: "123,123"
            },
            {
              content: "12.34.56",
              value: "12"
            },
            {
              content: "12,34.56",
              value: "12,34"
            },
            {
              content: "12.34,56",
              value: "12"
            },
            {
              content: "12,34,56",
              value: "12,34"
            }
          ]
        )
      )
      .toEqual(true)
    })
  })

  describe('Match Float Coma Or Dot Notation', () => {
    it('should be equal', () => {
      expect(
        regexTester(
          parser.matchers.matchFloat("coma-or-dot"), 
          [
            {
              content: "123 abc",
              value: "123"
            },
            {
              content: "123.45 abc",
              value: "123.45"
            },
            {
              content: "123,45 abc",
              value: "123,45"
            },
            {
              content: "0.5 abc",
              value: "0.5"
            },
            {
              content: "0,5 abc",
              value: "0,5"
            },
            {
              content: ".5abc",
              value: ".5"
            },
            {
              content: ",5abc",
              value: ",5"
            },
            {
              content: "0, abc",
              value: "0"
            },
            {
              content: "0. abc",
              value: "0"
            },
            {
              content: ".5 abc",
              value: ".5"
            },
            {
              content: ",5 abc",
              value: ",5"
            },
            {
              content: "abc123",
              value: null
            },
            {
              content: "abc123.",
              value: null
            },
            {
              content: "abc123,",
              value: null
            },
            {
              content: "abc123.123",
              value: null
            },
            {
              content: "abc123,123",
              value: null
            },
            {
              content: "123abc",
              value: "123"
            },
            {
              content: "123.abc",
              value: "123"
            },
            {
              content: "123,abc",
              value: "123"
            },
            {
              content: "123.123abc",
              value: "123.123"
            },
            {
              content: "123,123abc",
              value: "123,123"
            },
            {
              content: "12.34.56",
              value: "12.34"
            },
            {
              content: "12,34.56",
              value: "12,34"
            },
            {
              content: "12.34,56",
              value: "12.34"
            },
            {
              content: "12,34,56",
              value: "12,34"
            }
          ]
        )
      )
      .toEqual(true)
    })
  })

  describe('Match Float Decimal Part Notation', () => {
    it('should be equal', () => {
      expect(
        regexTester(
          parser.matchers.matchFloat("decimal-part"), 
          [
            {
              content: "123 abc",
              value: null
            },
            {
              content: "123.45 abc",
              value: null
            },
            {
              content: "123,45 abc",
              value: null
            },
            {
              content: "0.5 abc",
              value: null
            },
            {
              content: "0,5 abc",
              value: null
            },
            {
              content: "0, abc",
              value: null
            },
            {
              content: "0. abc",
              value: null
            },
            {
              content: ".5 abc",
              value: ".5"
            },
            {
              content: ",5 abc",
              value: ",5"
            },
            {
              content: ".5abc",
              value: ".5"
            },
            {
              content: ",5abc",
              value: ",5"
            },
            {
              content: "abc123",
              value: null
            },
            {
              content: "abc123.",
              value: null
            },
            {
              content: "abc123,",
              value: null
            },
            {
              content: "abc123.123",
              value: null
            },
            {
              content: "abc123,123",
              value: null
            },
            {
              content: "123abc",
              value: null
            },
            {
              content: "123.abc",
              value: null
            },
            {
              content: "123,abc",
              value: null
            },
            {
              content: "123.123abc",
              value: null
            },
            {
              content: "123,123abc",
              value: null
            },
            {
              content: "12.34.56",
              value: null
            },
            {
              content: "12,34.56",
              value: null
            },
            {
              content: "12.34,56",
              value: null
            },
            {
              content: "12,34,56",
              value: null
            }
          ]
        )
      )
      .toEqual(true)
    })
  })
})

const regexTester = (
  regex: RegExp,
  tests: ({
    content: string;
    value: string | null;
  })[]
) => {
  let result = true
  for(const test of tests) {
    const exec = regex.exec(test.content)
    result &&= (exec && exec[0]) === test.value
  }
  return result
}