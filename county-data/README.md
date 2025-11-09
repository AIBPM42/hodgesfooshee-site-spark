# County Data Files

## Status

✅ **SEO JSON Files (Complete)**
- davidson-seo-data.json
- williamson-seo-data.json
- rutherford-seo-data.json

⏳ **Perplexity Narratives (NEEDED)**
- davidson-narrative.txt
- williamson-narrative.txt
- rutherford-narrative.txt

---

## How to Generate Perplexity Narratives

### Step 1: Go to Perplexity.ai

### Step 2: Use This Prompt Template

**For Davidson County:**
```
Write comprehensive real estate market intelligence for Davidson County, Tennessee.

CRITICAL: Naturally incorporate these semantic terms throughout:
nashville, metro, government, community, population, census, region, middle, tennessee, area, city, district, services, schools, parks, economy, history, culture, landmarks, transportation, development, neighborhoods, events, tourism, infrastructure

Structure your response in 9 detailed sections:
1. INTRODUCTION (3 paragraphs)
2. CURRENT MARKET ANALYSIS
3. DEMOGRAPHICS & GROWTH
4. SCHOOLS & EDUCATION
5. LIFESTYLE & AMENITIES
6. COMMUTE & ACCESSIBILITY
7. ECONOMIC DRIVERS
8. KEY LANDMARKS & ATTRACTIONS
9. INVESTMENT OUTLOOK

Cite ALL sources: NAR, Realtor.com, US Census, TN Dept of Labor

Word count: 2,500-3,000 words
Tone: Expert real estate professional
```

**For Williamson County:**
```
Write comprehensive real estate market intelligence for Williamson County, Tennessee.

CRITICAL: Naturally incorporate these semantic terms throughout:
franklin, brentwood, nolensville, spring hill, fairview, thompson's station, leipers fork, community, schools, parks, history, government, events, tourism, economy, real estate, demographics, transportation, services, education, culture, recreation

Structure your response in 9 detailed sections:
1. INTRODUCTION (3 paragraphs)
2. CURRENT MARKET ANALYSIS
3. DEMOGRAPHICS & GROWTH
4. SCHOOLS & EDUCATION
5. LIFESTYLE & AMENITIES
6. COMMUTE & ACCESSIBILITY
7. ECONOMIC DRIVERS
8. KEY LANDMARKS & ATTRACTIONS
9. INVESTMENT OUTLOOK

Cite ALL sources: NAR, Realtor.com, US Census, TN Dept of Labor

Word count: 2,500-3,000 words
Tone: Expert real estate professional
```

**For Rutherford County:**
```
Write comprehensive real estate market intelligence for Rutherford County, Tennessee.

CRITICAL: Naturally incorporate these semantic terms throughout:
murfreesboro, smyrna, lavergne, tennessee, nashville, community, history, population, growth, economy, education, schools, parks, government, tourism, events, culture, heritage, transportation, development, housing, business

Structure your response in 9 detailed sections:
1. INTRODUCTION (3 paragraphs)
2. CURRENT MARKET ANALYSIS
3. DEMOGRAPHICS & GROWTH
4. SCHOOLS & EDUCATION
5. LIFESTYLE & AMENITIES
6. COMMUTE & ACCESSIBILITY
7. ECONOMIC DRIVERS
8. KEY LANDMARKS & ATTRACTIONS
9. INVESTMENT OUTLOOK

Cite ALL sources: NAR, Realtor.com, US Census, TN Dept of Labor

Word count: 2,500-3,000 words
Tone: Expert real estate professional
```

### Step 3: Save Output

Save each response as plain text files:
- davidson-narrative.txt
- williamson-narrative.txt
- rutherford-narrative.txt

Place in this `county-data/` directory.

---

## What Happens Next

Once all 6 files are in place (3 JSON + 3 TXT), run:

```bash
npx tsx scripts/populate-counties-ultimate.ts
```

This will:
1. Load all SEO data into intelligence tables
2. Parse narratives into 5 content sections
3. Extract and store all semantic keywords
4. Track competitor gap coverage
5. Store all PAA questions
6. Calculate SEO scores
7. Update county pages with complete content

---

## Need Help?

The population script will show detailed progress:
- ✅ Files loaded
- 📊 Keywords tracked
- 🎯 Gaps covered
- ❓ Questions stored
- 📈 SEO score calculated

Estimated time: 2-3 minutes total for all 3 counties
