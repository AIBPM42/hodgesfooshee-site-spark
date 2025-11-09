import { seeded } from "@/lib/seeded";

// one seed => same UI on server & client
const s = seeded("hodges-fire-v2");

export const kpis = {
  pipeline: 2380000,
  deals: 47,
  dom: 18,
  absorption: 0.69,
  updatedAt: "2025-10-23"
};

export const countyPulse = [
  { county:"Davidson",  new: s.int(210,260), pending: s.int(170,210), medPrice: 485_000, medDom: 28, wow: +s.int(6,12) },
  { county:"Williamson",new: s.int(160,210), pending: s.int(135,175), medPrice: 625_000, medDom: 32, wow: +s.int(4,10) },
  { county:"Rutherford",new: s.int(145,180), pending: s.int(120,160), medPrice: 395_000, medDom: 25, wow:  s.int(-2,2) },
  { county:"Sumner",    new: s.int(110,150), pending: s.int(90,135),  medPrice: 410_000, medDom: 30, wow: -s.int(2,7) },
];

export const timeToContract = Array.from({length:30},(_,i)=>({
  day: i+1,
  actual: i===0 ? s.int(0,2) : undefined
})).map((d,i,arr)=>{
  if (i>0) d.actual = (arr[i-1].actual! + (i<10? s.int(0,2): i<18? s.int(0,1): s.int(1,2)));
  return d;
});

export const priceSaleGap = [
  { seg:"SFH <$400K",   gap:+1.2 },
  { seg:"Townhome <$400K", gap:+0.6 },
  { seg:"SFH $400–600K", gap:-0.9 },
  { seg:"Condo $400–600K",gap:-1.5 },
  { seg:"SFH >$600K",   gap:-2.1 },
];

export const showToOffer = Array.from({length:4},(_,w)=>(
  Array.from({length:7},(_,d)=> s.int(7,18)) // % blocks
));

export const weekVelocity = [
  { label:"Last Week", actives: 205, pendings: 165 },
  { label:"This Week", actives: 248, pendings: 190 },
];

export const zipMomentum = ["37215","37205","37067","37211","37064","37221"].map(zip=>({
  zip, change: s.int(-3,9)/10, series: Array.from({length:12},()=> s.int(10,98))
}));

export const competitive = [
  { metric:"Close Rate", you: 68, market: 52 },
  { metric:"Median DOM", you: 24, market: 31 },
  { metric:"Response Time (hrs)", you: 1.6, market: 3.8 },
];

export const marketSummary =
  "Demand strongest in <$600K single-family; luxury condos lag. Actives and pendings rising week-over-week; plan price reviews on listings >21 DOM.";
