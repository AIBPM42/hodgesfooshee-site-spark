import seedrandom from "seedrandom";

export function rng(seed='hodges-fire-v3'){
  const r = seedrandom(seed);
  return {
    int(min:number,max:number){ return Math.floor(r()*(max-min+1))+min },
    float(min:number,max:number,dp=2){ return +((r()*(max-min)+min).toFixed(dp)) }
  }
}

// Alias for backwards compatibility
export const seeded = rng;
