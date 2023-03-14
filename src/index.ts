// Interfaces
import IDataResult from "@/interfaces/IDataResult";
import ILine from "@/interfaces/ILine";
import IResult from "@/interfaces/IResult";
import IRule from "@/interfaces/IRule";
export {
  IDataResult as DataResult,
  ILine as CharLine,
  IResult as Result,
  IRule as Rule
};

import box from "@/patterns/box";
import field from "@/patterns/field";
import parse from "@/patterns/parse";
type SeekPattern = {
  box: (name: string, beginRegex: RegExp, endRegex: RegExp, defaultBegin: string, defaultEnd: string, overridePatternSet?: IRule[] | undefined) => IRule;
  field: (name: string, regex: RegExp, defaultValue: string) => IRule;
  word: (name: string, defaultValue: string, caseInsensitive?: boolean) => IRule;
  keyword: (name: string, keyword: string, caseInsensitive?: boolean) => IRule;
  whitespaces: (name: string, defaultValue: string) => IRule;
  exactMatch: (name: string, content: string, defaultValue: string, caseInsensitive?: boolean) => IRule;
};
export const Seeker: SeekPattern = {
  box,
  field,
  word: (name: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp("^[^\\W\\d_]+", caseInsensitive ? "i" : ""), defaultValue),
  keyword: (name: string, keyword: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(`^${keyword}\\b`, caseInsensitive ? "i" : ""), name),
  whitespaces: (name: string, defaultValue: string) => Seeker.field(name, /[ \t\f\r]/, defaultValue),
  exactMatch: (name: string, content: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(content.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), caseInsensitive ? "i" : ""), defaultValue),
};

export default function Parserizer(txtContent: string, patternSet: IRule[]): IResult {
  return parse(txtContent, patternSet);
};