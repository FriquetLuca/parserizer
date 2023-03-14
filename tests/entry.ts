import Parserizer, { Seeker } from "../src/index";

const variable = Seeker.word("variable", "");
const publicAccessor = Seeker.keyword("public-accessor", "public");
const whitespace = Seeker.whitespaces("whitespaces", "");

console.log(Parserizer(
  "Hello! This is a public message to check if thoses regex works.\nAnd I'll check it out asap!",
  [
    publicAccessor,
    variable,
    whitespace
  ]
));