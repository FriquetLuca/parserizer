// Interfaces
import IDataResult from "@/interfaces/IDataResult";
import ILine from "@/interfaces/ILine";
import IResult from "@/interfaces/IResult";
import IRule from "@/interfaces/IRule";
import versatileTypeof from "@/utils/versatileTypeof";
export {
  IDataResult as DataResult,
  ILine as CharLine,
  IResult as Result,
  IRule as Rule
};

import box from "@/patterns/box";
import field from "@/patterns/field";
import parse from "@/patterns/parse";
import { debugResult, stringify } from "@/patterns/stringify";
type SeekPattern = {
  box: (name: string, beginRegex: RegExp, endRegex: RegExp, defaultBegin: string, defaultEnd: string, overridePatternSet?: IRule[] | undefined) => IRule;
  field: (name: string, regex: RegExp, defaultValue: string) => IRule;
  word: (name: string, defaultValue: string, caseInsensitive?: boolean) => IRule;
  keyword: (name: string, keyword: string, caseInsensitive?: boolean) => IRule;
  whitespaces: (name: string, defaultValue: string) => IRule;
  exactMatch: (name: string, content: string, defaultValue: string, caseInsensitive?: boolean) => IRule;
  any: (name: string, defaultValue: string, includeTerminators?: boolean) => IRule;
};
export const Seeker: SeekPattern = {
  box,
  field,
  word: (name: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp("^[^\\W\\d_]+", caseInsensitive ? "i" : ""), defaultValue),
  keyword: (name: string, keyword: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(`^${keyword}\\b`, caseInsensitive ? "i" : ""), name),
  whitespaces: (name: string, defaultValue: string) => Seeker.field(name, /[ \t\f\r]/, defaultValue),
  exactMatch: (name: string, content: string, defaultValue: string, caseInsensitive: boolean = false) => Seeker.field(name, new RegExp(content.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'), caseInsensitive ? "i" : ""), defaultValue),
  any: (name: string, defaultValue: string, includeTerminators: boolean = true) => Seeker.field(name, new RegExp("^.{1}", includeTerminators ? "s" : ""), defaultValue),
};
export default function Parserizer(txtContent: string, patternSet: IRule[]): IResult {
  return parse(txtContent, patternSet);
};
export function StringifyResult(parsedResult: IDataResult[] | IResult, spacing: boolean = true) {
  return stringify(versatileTypeof(parsedResult) !== "array" ? (<IResult>parsedResult).result : <IDataResult[]>parsedResult, spacing);
}
export function StringifyDebug(parsedResult: IDataResult[] | IResult, spacing: boolean = true) {
  return debugResult(versatileTypeof(parsedResult) !== "array" ? (<IResult>parsedResult).result : <IDataResult[]>parsedResult, spacing);
}