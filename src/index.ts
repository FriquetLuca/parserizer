export * as utils from "./utils";
export * as matchers from "./matchers";
export * from "./parser";
export * from "./rules";
export type Unpack<T> = T extends (infer A)[] ? A : T;