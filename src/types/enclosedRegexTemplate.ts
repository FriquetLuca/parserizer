import { enclosedRegex } from "../stack/enclosedRegex";
import { type Merge } from "./merge";

export type EnclosedRegexTemplate = Merge<Omit<ReturnType<typeof enclosedRegex>, "type"> & { type: "enclosed" }>;