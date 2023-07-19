import { type regex } from "../stack/regex";
import { type Merge } from "./merge";

export type RegexTemplate<T> = Merge<Omit<ReturnType<regex<T>>, "type"> & { type: "any" }>;