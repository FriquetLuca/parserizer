import { type enclosedRegex } from "../stack/enclosedRegex";
import { type Merge } from "./merge";

export type EnclosedRegexTemplate<T> = Merge<Omit<ReturnType<enclosedRegex<T>>, "type"> & { type: "enclosed" }>;