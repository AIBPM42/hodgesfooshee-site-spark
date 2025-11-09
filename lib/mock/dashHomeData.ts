// Mock data for Dashboard Home visualizations
// Will be replaced with real data from Realtyna MLS + internal database

export const kpis = {
  pipelineValue: 2380000,
  activeDeals: 47,
  avgDom: 18,
  absorptionRate: 0.69,
  updatedAt: new Date().toISOString()
};

export const absorptionHeat = {
  priceBands: ["<$400K","$400–600K",">$600K"],
  propertyTypes: ["Single Family","Condo","Townhome"],
  matrix: [
    [0.82, 0.66, 0.58],
    [0.61, 0.52, 0.44],
    [0.73, 0.63, 0.48],
  ]
};

export const dealFunnel = [
  { stage: "Leads", count: 847 },
  { stage: "Contacted", count: 423 },
  { stage: "Showing", count: 89 },
  { stage: "Offer", count: 34 },
  { stage: "Contract", count: 28 },
  { stage: "Closed", count: 26 }
];

export const commissionWaterfall = [
  { week: "W1", stage: "Active Listings", amount: 45000, probability: 0.25 },
  { week: "W2", stage: "Under Contract", amount: 28000, probability: 0.85 },
  { week: "W3", stage: "Clear to Close", amount: 18000, probability: 0.95 },
  { week: "W4", stage: "Next 30 Days", amount: 38000, probability: 0.72 }
];

export const leadsCluster = Array.from({length: 36}).map((_,i)=>({
  id: i+1,
  score: Math.floor(40 + Math.random()*60),
  recent: Math.random() > 0.65,
  daysSinceContact: Math.floor(Math.random()*21),
  potential: Math.floor(3000 + Math.random()*12000)
}));

export const priorityMatrix = Array.from({length: 16}).map((_,i)=>({
  id: i+1,
  impact: +(Math.random()*100).toFixed(1),
  urgency: +(Math.random()*100).toFixed(1),
  label: ["Price Cut","New Cash Buyer","Follow-up","Showing","Offer","Appraisal","Repair","Docs"][i%8]
}));

export const pricePositioning = {
  your: Array.from({length:12}).map((_,i)=>({
    ppsf: +(150 + Math.random()*170).toFixed(0),
    dom: Math.floor(2 + Math.random()*35),
    sf: Math.floor(1200 + Math.random()*2800),
    label: `Y-${i+1}`
  })),
  sold: Array.from({length:40}).map((_,i)=>({
    ppsf: +(140 + Math.random()*180).toFixed(0),
    dom: Math.floor(2 + Math.random()*25),
    sf: Math.floor(1100 + Math.random()*3200)
  })),
  active: Array.from({length:30}).map((_,i)=>({
    ppsf: +(160 + Math.random()*200).toFixed(0),
    dom: Math.floor(2 + Math.random()*45),
    sf: Math.floor(1100 + Math.random()*3200)
  }))
};

export const domPrediction = Array.from({length:30}).map((_,i)=>({
  day: i+1,
  actual: i<12 ? (i+Math.random()*2) : null,
  predicted: i>=12 ? (12 + (i-12)*1.5 + Math.random()*1.2) : null,
  low: i>=12 ? (12 + (i-12)*1.1) : null,
  high: i>=12 ? (12 + (i-12)*1.9) : null
}));

export const competitiveRadar = [
  { metric: "Active Listings", you: 68, market: 55 },
  { metric: "Monthly Sales", you: 74, market: 60 },
  { metric: "Avg DOM (inv)", you: 70, market: 62 },
  { metric: "List-to-Sale %", you: 82, market: 70 },
  { metric: "Response Time", you: 76, market: 58 },
];

export const showingConversion = {
  days: Array.from({length:28}).map((_,i)=>i+1),
  values: Array.from({length:4}).map(()=>Array.from({length:7}).map(()=>+(Math.random()*0.6).toFixed(2)))
};

export const microMarket = [
  { zip: "37215", invMonths: 1.7, priceTrend: 0.03, volume: 42 },
  { zip: "37212", invMonths: 2.4, priceTrend: 0.01, volume: 38 },
  { zip: "37067", invMonths: 1.3, priceTrend: 0.04, volume: 55 },
  { zip: "37128", invMonths: 2.9, priceTrend: -0.01, volume: 34 },
  { zip: "37064", invMonths: 1.9, priceTrend: 0.02, volume: 47 },
];

export const sourceRoi = [
  { source: "Referrals", cost: 1200, gci: 38000 },
  { source: "SEO",       cost: 2500, gci: 29000 },
  { source: "PPC",       cost: 6000, gci: 41000 },
  { source: "Social",    cost: 1800, gci: 14000 },
  { source: "Events",    cost: 2200, gci: 19000 },
];

export const marketSummaryMock =
  "Demand strongest in <$600K single-family; luxury condos lag. Active→Pending velocity improving; plan price reviews on listings >21 DOM.";
