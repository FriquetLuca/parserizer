export interface RuleHandler<T> {
  regex: RegExp;
  overrideContent?: (fullMatch: string, ...groups: string[]) => T;
}

export interface EnclosedRuleHandler<T> {
  regex: RegExp;
  fallbackValue?: T;
  overrideContent?: (fullMatch: string, ...groups: string[]) => T;
}
