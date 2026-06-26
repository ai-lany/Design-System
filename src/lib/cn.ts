/**
 * Tiny className joiner. Filters falsy values.
 *
 * cn('a', cond && 'b', null, undefined, 'c') -> 'a c' (or 'a b c' if cond)
 */
export type ClassValue = string | number | null | undefined | false;

export function cn(...values: ClassValue[]): string {
  let out = '';
  for (const v of values) {
    if (!v && v !== 0) continue;
    if (out) out += ' ';
    out += v;
  }
  return out;
}
