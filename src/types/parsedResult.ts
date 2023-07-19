export type ParsedResult<T> = {
  name: string;
  content: string | T;
  lastIndex: number;
};