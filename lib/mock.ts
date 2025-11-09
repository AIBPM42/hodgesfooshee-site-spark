// Mock data for Fire 12 Dashboard
export const COUNTIES=["Davidson","Rutherford","Williamson","Wilson","Sumner","Cheatham","Maury","Dickson","Bedford"] as const;
export type County = typeof COUNTIES[number];
export const tiers=["<400k","400-700k","700k-1.2m",">1.2m"] as const;

export const snapshot30_60_90={
  medianPrice:{ d30:490000, d60:505000, d90:512000, wow:-1.8 },
  dom:{ d30:50, d60:54, d90:57, wow:-3.9 },
  newListings:{ d30:2100, d60:2250, d90:2300, wow:-2.4 },
};

export const pricingPower=[
  { tier:"<400k", pct:97.6, delta:-8200 },
  { tier:"400-700k", pct:98.4, delta:-11200 },
  { tier:"700k-1.2m", pct:97.1, delta:-23800 },
  { tier:">1.2m", pct:94.2, delta:-68500 },
];

export const inventorySeries=[
  { month:"2024-10", new:1600, active:14500 },
  { month:"2024-12", new:1500, active:15200 },
  { month:"2025-02", new:1700, active:15800 },
  { month:"2025-04", new:1950, active:16250 },
  { month:"2025-06", new:2100, active:16800 },
  { month:"2025-08", new:2250, active:17050 },
  { month:"2025-10", new:2050, active:16500 },
];

export const priceCutWeekly=[
  { week:"W31", rate:0.24, reduction:9800 },
  { week:"W32", rate:0.27, reduction:10200 },
  { week:"W33", rate:0.29, reduction:10500 },
  { week:"W34", rate:0.26, reduction:9900 },
  { week:"W35", rate:0.28, reduction:10100 },
  { week:"W36", rate:0.31, reduction:11200 },
];

export const domBuckets=[
  { range:"0-10", count:210 },
  { range:"11-20", count:420 },
  { range:"21-30", count:690 },
  { range:"31-45", count:880 },
  { range:"46-60", count:760 },
  { range:"61-90", count:540 },
  { range:">90", count:310 },
];

export const microNeighborhoods=[
  { name:"East Nashville", value:4.2 },
  { name:"Germantown", value:3.9 },
  { name:"The Gulch", value:2.1 },
  { name:"12 South", value:3.3 },
  { name:"Sylvan Park", value:1.2 },
  { name:"Bellevue", value:0.9 },
];

export const migrationSankey={
  nodes:[
    { name:"Los Angeles" },{ name:"Atlanta" },{ name:"Chicago" },
    { name:"Davidson" },{ name:"Williamson" },{ name:"Rutherford" }
  ],
  links:[
    { source:0,target:3,value:18 },{ source:0,target:4,value:6 },
    { source:1,target:3,value:9 }, { source:1,target:5,value:7 },
    { source:2,target:3,value:8 }, { source:2,target:4,value:5 },
  ]
};

export const offerIntensity=[
  { bucket:"0 offers", pct:42 },
  { bucket:"1 offer", pct:39 },
  { bucket:"2 offers", pct:14 },
  { bucket:"3+ offers", pct:5 },
];

export const rentalByCounty=COUNTIES.map((c,i)=>({
  county:c, medianRent:1600+ i*70, vacancy:3+(i%3), yield:4.2 + (i*0.2)
}));

export const leaderboard=[
  { agent:"J. Hodges", ratio:99.4, domVsMkt:-12, volume:12, resp:17 },
  { agent:"A. Lee", ratio:98.7, domVsMkt:-8, volume:10, resp:26 },
  { agent:"K. Patel", ratio:99.1, domVsMkt:-10, volume:9, resp:21 },
  { agent:"R. Gomez", ratio:97.8, domVsMkt:-5, volume:8, resp:33 },
];

export const funnel=[
  { stage:"New", value:1200 },
  { stage:"Contacted", value:760 },
  { stage:"Qualified", value:420 },
  { stage:"Showing", value:260 },
  { stage:"Offer", value:140 },
  { stage:"Won", value:84 },
];
