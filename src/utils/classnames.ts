export function classnames(...classes: (string | undefined)[]) {
  return (classes as string[])
    .filter((c) => c != null)
    .map((c) => c.trim())
    .join(" ");
}
