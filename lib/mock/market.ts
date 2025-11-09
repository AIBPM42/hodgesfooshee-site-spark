import { rng } from '@/lib/seeded'
const R = rng()

export function kpis(){
  return {
    newListings7d:  R.int(420,520),
    pendings7d:     R.int(360,460),
    absorption:     0.69,
    medianDom:      18,
    listSaleRatio:  98.6,
    updatedAt:      '8:42 AM',
    source:         'AI'
  }
}

export function countyPulse(){
  return [
    { county:'Davidson',   new: R.int(120,160), pending: R.int(95,130), price: 485, dom: 28, wow:+8 },
    { county:'Williamson', new: R.int(90,130),  pending: R.int(80,120), price: 625, dom: 32, wow:+5 },
    { county:'Rutherford', new: R.int(70,110),  pending: R.int(65,100), price: 395, dom: 25, wow:+1 },
    { county:'Sumner',     new: R.int(60,90),   pending: R.int(50,80),  price: 410, dom: 30, wow:-3 },
  ]
}

export function velocity(){
  return [
    { week: 'Last Week', actives: 720, pendings: 610 },
    { week: 'This Week', actives: 760, pendings: 640 },
  ]
}

export function priceGap(){
  return [
    { segment:'SFH <$400K',      gap: +1.2 },
    { segment:'Townhome <$400K', gap: +0.6 },
    { segment:'SFH $400–600K',   gap: -0.9 },
    { segment:'Condo $400–600K', gap: -1.5 },
    { segment:'SFH >$600K',      gap: -2.1 },
  ]
}

export function timeToContract(){
  return Array.from({length:30},(_,i)=>({ day:i+1, days: i<10? i+6 : i<18? i+10 : i+14 }))
}

export function zipMomentum(){
  const zips = ['37215','37205','37067','37211','37064','37221']
  return zips.map(zip=>({ zip, change: R.float(-2.0,4.0,1), series: Array.from({length:18},(_,i)=> 60 + i*R.float(0.5,1.5)) }))
}

export function showOffer(){
  // 4 weeks × 7 days (percent values, 7–18)
  return Array.from({length:4},()=> Array.from({length:7},()=> R.int(7,18)))
}
