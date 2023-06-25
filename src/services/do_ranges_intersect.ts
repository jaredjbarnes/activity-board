export function doRangesIntersect(
  start1: number,
  end1: number,
  start2: number,
  end2: number
) {
  const start = Math.max(start1, start2);
  const end = Math.min(end1, end2);
  return end > start;
}