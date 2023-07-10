export interface RegexHandler {
  regex: RegExp;
  fallbackValue?: string;
  overrideContent?: (fullResult: string, groups: string[]) => string;
};