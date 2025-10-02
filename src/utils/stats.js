export function computeStats(values) {
  if (!values || values.length === 0) {
    return {
      min: null,
      max: null,
      mean: null,
      median: null,
      start: null,
      end: null,
    };
  }

  const nums = values.map(Number).filter((v) => !isNaN(v));

  if (nums.length === 0) {
    return {
      min: null,
      max: null,
      mean: null,
      median: null,
      start: null,
      end: null,
    };
  }

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const mean = nums.reduce((sum, v) => sum + v, 0) / nums.length;

  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const start = nums[0];
  const end = nums[nums.length - 1];

  return { min, max, mean, median, start, end };
}
