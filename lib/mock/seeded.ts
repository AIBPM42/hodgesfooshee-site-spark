import seedrandom from 'seedrandom';

export function makeRng(seed = 'hodges-pro-v1') {
  const rng = seedrandom(seed);
  return {
    int(min: number, max: number) {
      return Math.floor(rng() * (max - min + 1)) + min;
    },
    float(min: number, max: number, dp = 2) {
      return +((rng() * (max - min) + min).toFixed(dp));
    }
  };
}
