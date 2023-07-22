export interface StringifyOptions<T> {
  refineElement?: (element: T | string | undefined) => string
  spacing?: boolean
  spaceAmount?: number
}
