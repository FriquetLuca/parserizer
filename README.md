# Parserizer

> A stack-based parsing solution written in typescript.

Parserizer is a stack-based parsing solution written in typescript using Regex for pattern matching.

## Parser

The main function of the parser is `parse` and is declared as such:
```ts
function parse<T>(input: string, ruleSet: ParserRules<T>): ParserResult<T>;
```

The parser is made to parse string content and use a bunch of rules, then it will return the parsed content. The rules will be tested in the order it's referenced in the array, so be careful since order matter when parsing.

## Rules

You need to be aware of the rules you'll be needing when structuring your grammar. There's primarely two kind of rules we're going to need: one for basic datas and one for nested datas.
The way `parserizer` will handle this is by using two rules generator named `rule` and `enclosedRule`.

### Rule

> Define your own rules to parse your own definition of what datas should be but beware: order matter.

#### Definition

`rule` is the primary rule generator used by parserizer and is defined as:
```ts
function rule<T>({ name, handler }: RuleProps<T>): Rule<T>;
```

The definition for the rule is defined by the interface:
```ts
interface RuleProps<T> {
  name: string;
  handler: RuleHandler<T>;
}
```

The `name` is the name of the rule you're introducing while `handler` will be how you're going to handle the parsing.

#### Handling

The handler for a rule is defined as:
```ts
interface RuleHandler<T> {
  regex: RegExp;
  overrideContent?: (fullMatch: string, ...groups: string[]) => T;
}
```
The `regex` property contain the regex used to test the current part of the string that match what we want. In case we want to create special kinds of rules that return a custom object, we can use the optional property named `overrideContent`.

#### Example

```ts
// By default, the rule will be set to: parser.rule<string>
const grabWord = parser.rule({
  name: "word",
  handler: {
    regex: /^[^\W\d_]+/
  }
})

const grabNumber = parser.rule({
  name: "number",
  handler: {
    regex: /^[^\W\d_]+/
  }
})
```

### Enclosed Regex

#### Rules override

## Results

## Filters