import { matchWordCharacter } from "../matchers"
import { parse, ParsedResultType, stringify } from "../parser";
import { defineEnclosedRule, defineRule, overrideRules } from "../rules";

type Unpack<T> = T extends (infer A)[] ? A : T;

const grabWord = defineRule({
  name: "word",
  handler: {
    regex: matchWordCharacter("letters", true)
  }
})

const grabInt = defineRule({
  name: "int",
  handler: {
    regex: matchWordCharacter("digits", true),
    overrideContent: (fullMatch) => Number(fullMatch)
  }
})

const rulesPrt = [
  grabInt
];

const prts = defineEnclosedRule({
  name: "parenthesis",
  openHandler: {
    regex: /^\{/
  },
  closeHandler: {
    regex: /^\}/
  }
});

const prtsWithRules = overrideRules(prts, rulesPrt);

const rules = [
  grabWord,
  grabInt,
  prts,
  prtsWithRules
];
type usedRulesType = Unpack<typeof rules>

const parsedResult = parse<usedRulesType>("hello world, nice to meet you!", {
  ruleSet: rules
});

console.log(stringify<usedRulesType, ParsedResultType<usedRulesType>>(parsedResult.result, {
  refineElement: (element) => {
    if(typeof element === "string") {
      return element;
    }
    if(element?.type === "enclosed" || element?.type === "override") {
      return "enclosed something..."
    }
    return "";
  }
}))
if(parsedResult.result[0].type === "rule") {
  const prr = parsedResult.result[0]
  if(prr.name === "word") {
    prr.content
  } else {
    prr.content
  }
}
if(parsedResult.result[0].type === "enclosed") {
  const prr = parsedResult.result[0]
  if(prr.name === "parenthesis") {
    prr.content
  } else {
    if(prr.content) {
      const owo = prr.content[0]
      if(owo.name === "int") {
        owo.content
      }
    }
  }
}
if(parsedResult.result[0].type === "override") {
  const prr = parsedResult.result[0]
  if(prr.name === "parenthesis") {
    prr.content
  } else {
    prr.content
  }
}