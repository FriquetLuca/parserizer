export interface RegexHandler<T> {
  regex: RegExp;
  fallbackValue?: T;
  overrideContent?: (fullResult: string, groups: string[]) => T;
};