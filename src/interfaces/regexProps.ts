import { type RegexHandler } from "./regexHandler";

export interface RegexProps<T> {
  name: string;
  handler: RegexHandler<T>;
}