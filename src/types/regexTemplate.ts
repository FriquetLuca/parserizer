import { regex } from "../stack/regex";
import { type Merge } from "./merge";

export type RegexTemplate = Merge<Omit<ReturnType<typeof regex>, "type"> & { type: "any" }>;