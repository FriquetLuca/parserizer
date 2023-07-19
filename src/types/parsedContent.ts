import { ParsedEnclosedResult } from "./parsedEnclosedResult";
import { ParsedResult } from "./parsedResult";

export type ParsedContent<T> = ParsedResult<T> | ParsedEnclosedResult<T>;