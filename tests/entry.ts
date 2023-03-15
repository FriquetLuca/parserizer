import Parserizer, { Seeker, StringifyResult, StringifyDebug } from "../src/index";
const variable = Seeker.word("variable", "var");
const publicAccessor = Seeker.keyword("public-accessor", "public");
const whitespace = Seeker.whitespaces("whitespaces", " ");
const prts = Seeker.box("parenthesis", /^\{/, /^\}/, "{", "}");
const anyChar = Seeker.any("any", "");

console.log(StringifyDebug(Parserizer(
  "Hello! This is a publ{ic {mess}age} to check if {thoses} regex works.\nAnd I'll check it out asap!!!",
  [
    publicAccessor,
    variable,
    prts,
    whitespace,
    anyChar
  ]
)));