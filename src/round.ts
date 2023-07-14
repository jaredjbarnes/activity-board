export function round(value: number, interval = 1) {
  const halfStep = interval / 2;
  const remainder = Math.abs(value % interval);
  const direction = Math.sign(value);

  return remainder > halfStep
    ? value + direction * (interval - remainder)
    : value - direction * remainder;
}