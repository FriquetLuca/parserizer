export type RegexHandler<ResultType extends unknown = string> = {
  regex: RegExp;
  overrideContent?: (fullMatch: string, ...groups: string[]) => ResultType;
};
