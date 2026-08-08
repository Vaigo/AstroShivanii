/** Truncates to at most maxLen chars, breaking on the last whole word and
 *  appending an ellipsis — a hard char-slice instead cuts mid-word/mid-sentence
 *  with no indication text was cut off. */
export function truncateDescription(text: string, maxLen = 160): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${safe.trimEnd()}…`;
}
