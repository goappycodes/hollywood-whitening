/** Joins class names, skipping falsy values (as in allwhitelaser-next). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
