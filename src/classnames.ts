export function classnames(...classes: (string | undefined)[]) {
  return (classes as string[])
    .filter((c) => c != null)
    .reduce((acc, next) => acc + next.trim(), "");
}
