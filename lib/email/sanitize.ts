const MAX_HEADER_VALUE_LENGTH = 180

export function sanitizeEmailHeaderValue(value: string) {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_HEADER_VALUE_LENGTH)
}
