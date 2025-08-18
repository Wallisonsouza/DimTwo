export function isInRange(value: number, min: number, max: number, inclusive = false): boolean {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return inclusive ? value >= low && value <= high : value > low && value < high;
}
