import type { AdAccount, Campaign, Creative, DailyInsight, KPIs } from './types'

export const mockAccount: AdAccount = {
  id: 'act_123456789',
  name: 'Demo Ad Account',
  currency: 'USD',
  status: 1,
}

function generateDailyData(days: number): DailyInsight[] {
  const data: DailyInsight[] = []
  const now = new Date()
  for (let i = days; i >= 1; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const spendMultiplier = isWeekend ? 0.65 : 1.0
    const baseSpend = 420 + Math.sin(i * 0.3) * 120 + (Math.random() - 0.5) * 180
    const spend = Math.max(180, baseSpend * spendMultiplier)
    const baseROAS = 3.2 + Math.sin(i * 0.15) * 0.8 + (Math.random() - 0.5) * 0.6
    const roas = Math.max(1.8, Math.min(5.2, baseROAS))
    const revenue = spend * roas
    const ctr = (0.015 + Math.sin(i * 0.2) * 0.006 + (Math.random() - 0.5) * 0.006)
    const cpm = 11 + Math.sin(i * 0.25) * 4 + (Math.random() - 0.5) * 3
    const impressions = Math.round((spend / cpm) * 1000)
    const clicks = Math.round(impressions * ctr)
    const cpc = clicks > 0 ? spend / clicks : 1.5
    const convRate = 0.025 + (Math.random() - 0.5) * 0.01
    const purchases = Math.max(1, Math.round(clicks * convRate))
    data.push({
      date: date.toISOString().split('T')[0],
      spend: Math.round(spend * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      impressions,
      clicks,
      ctr: Math.round(ctr * 10000) / 10000,
      cpc: Math.round(cpc * 100) / 100,
      purchases,
    })
  }
  return data
}

const allDailyData = generateDailyData(90)

export function getMockDailyInsights(startDate: string, endDate: string): DailyInsight[] {
  return allDailyData.filter(d => d.date >= startDate && d.date <= endDate)
}

export function getMockKPIs(startDate: string, endDate: string): KPIs {
  const current = getMockDailyInsights(startDate, endDate)
  const days = current.length
  const start = new Date(startDate)
  const prevEnd = new Date(start)
  prevEnd.setDate(prevEnd.getDate() - 1)
  const prevStart = new Date(prevEnd)
  prevStart.setDate(prevStart.getDate() - days)
  const previous = getMockDailyInsights(
    prevStart.toISOString().split('T')[0],
    prevEnd.toISOString().split('T')[0]
  )
  const sum = (arr: DailyInsight[], key: keyof DailyInsight) =>
    arr.reduce((acc, d) => acc + (d[key] as number), 0)
  const calcChange = (curr: number, prev: number) =>
    prev > 0 ? (curr - prev) / prev : 0
  const spend = sum(current, 'spend')
  const revenue = sum(current, 'revenue')
  const impressions = sum(current, 'impressions')
  const clicks = sum(current, 'clicks')
  const purchases = sum(current, 'purchases')
  const prevSpend = sum(previous, 'spend')
  const prevRevenue = sum(previous, 'revenue')
  const prevImpressions = sum(previous, 'impressions')
  const prevClicks = sum(previous, 'clicks')
  const prevPurchases = sum(previous, 'purchases')
  const roas = spend > 0 ? revenue / spend : 0
  const ctr = impressions > 0 ? clicks / impressions : 0
  const cpc = clicks > 0 ? spend / clicks : 0
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0
  const cpa = purchases > 0 ? spend / purchases : 0
  const prevRoas = prevSpend > 0 ? prevRevenue / prevSpend : 0
  const prevCtr = prevImpressions > 0 ? prevClicks / prevImpressions : 0
  const prevCpc = prevClicks > 0 ? prevSpend / prevClicks : 0
  const prevCpm = prevImpressions > 0 ? (prevSpend / prevImpressions) * 1000 : 0
  const prevCpa = prevPurchases > 0 ? prevSpend / prevPurchases : 0
  return {
    spend, revenue, roas, ctr, cpc, cpm, cpa, purchases, impressions, clicks,
    spendChange: calcChange(spend, prevSpend),
    revenueChange: calcChange(revenue, prevRevenue),
    roasChange: calcChange(roas, prevRoas),
    ctrChange: calcChange(ctr, prevCtr),
    cpcChange: calcChange(cpc, prevCpc),
    cpmChange: calcChange(cpm, prevCpm),
    cpaChange: calcChange(cpa, prevCpa),
    purchasesChange: calcChange(purchases, prevPurchases),
    impressionsChange: calcChange(impressions, prevImpressions),
  }
}

export const mockCampaigns: Campaign[] = [
  { id: 'camp_001', name: 'Brand Awareness Q1', objective: 'BRAND_AWARENESS', status: 'ACTIVE', spend: 8420.50, revenue: 31558.00, roas: 3.75, impressions: 842000, clicks: 15156, ctr: 0.018, cpc: 0.556, purchases: 312, cpa: 26.99, dailyBudget: 350 },
  { id: 'camp_002', name: 'Retargeting - Cart Abandoners', objective: 'CONVERSIONS', status: 'ACTIVE', spend: 5210.00, revenue: 24492.00, roas: 4.70, impressions: 320000, clicks: 9360, ctr: 0.0292, cpc: 0.557, purchases: 428, cpa: 12.17, dailyBudget: 200 },
  { id: 'camp_003', name: 'Prospecting - Lookalike 2%', objective: 'CONVERSIONS', status: 'ACTIVE', spend: 11840.00, revenue: 28416.00, roas: 2.40, impressions: 1184000, clicks: 14208, ctr: 0.012, cpc: 0.833, purchases: 312, cpa: 37.95, dailyBudget: 500 },
  { id: 'camp_004', name: 'Holiday Sale - PAUSED', objective: 'CONVERSIONS', status: 'PAUSED', spend: 6620.00, revenue: 9930.00, roas: 1.50, impressions: 662000, clicks: 8610, ctr: 0.013, cpc: 0.769, purchases: 124, cpa: 53.39, dailyBudget: 300 },
]

export const mockCreatives: Creative[] = [
  { id: 'ad_001', name: 'Summer Collection - Video 15s', campaignName: 'Brand Awareness Q1', status: 'ACTIVE', spend: 4210.00, revenue: 18103.00, roas: 4.30, impressions: 421000, clicks: 8420, ctr: 0.02, cpc: 0.50, purchases: 168, performanceTier: 'top' },
  { id: 'ad_002', name: 'Cart Recovery - Dynamic Product', campaignName: 'Retargeting - Cart Abandoners', status: 'ACTIVE', spend: 2860.00, revenue: 14872.00, roas: 5.20, impressions: 176000, clicks: 5456, ctr: 0.031, cpc: 0.524, purchases: 248, performanceTier: 'top' },
  { id: 'ad_003', name: 'New Customer - Lifestyle Image', campaignName: 'Prospecting - Lookalike 2%', status: 'ACTIVE', spend: 6200.00, revenue: 16120.00, roas: 2.60, impressions: 620000, clicks: 7440, ctr: 0.012, cpc: 0.833, purchases: 168, performanceTier: 'mid' },
  { id: 'ad_004', name: 'Brand Story - Carousel', campaignName: 'Brand Awareness Q1', status: 'ACTIVE', spend: 4210.00, revenue: 13455.00, roas: 3.20, impressions: 421000, clicks: 6736, ctr: 0.016, cpc: 0.625, purchases: 144, performanceTier: 'mid' },
  { id: 'ad_005', name: 'Flash Sale - Static Image', campaignName: 'Holiday Sale - PAUSED', status: 'PAUSED', spend: 3310.00, revenue: 4965.00, roas: 1.50, impressions: 331000, clicks: 4300, ctr: 0.013, cpc: 0.770, purchases: 62, performanceTier: 'bottom' },
  { id: 'ad_006', name: 'Lookalike Expansion - Video', campaignName: 'Prospecting - Lookalike 2%', status: 'ACTIVE', spend: 5640.00, revenue: 12296.00, roas: 2.18, impressions: 564000, clicks: 6768, ctr: 0.012, cpc: 0.833, purchases: 144, performanceTier: 'bottom' },
  { id: 'ad_007', name: 'Cart Recovery - Video Reminder', campaignName: 'Retargeting - Cart Abandoners', status: 'ACTIVE', spend: 2350.00, revenue: 9620.00, roas: 4.09, impressions: 144000, clicks: 3904, ctr: 0.0271, cpc: 0.602, purchases: 180, performanceTier: 'top' },
  { id: 'ad_008', name: 'Best Sellers - Collection Ad', campaignName: 'Brand Awareness Q1', status: 'PAUSED', spend: 1820.00, revenue: 3276.00, roas: 1.80, impressions: 182000, clicks: 2730, ctr: 0.015, cpc: 0.667, purchases: 48, performanceTier: 'bottom' },
  { id: 'ad_009', name: 'Holiday Bundle - Carousel', campaignName: 'Holiday Sale - PAUSED', status: 'PAUSED', spend: 3310.00, revenue: 4965.00, roas: 1.50, impressions: 331000, clicks: 4310, ctr: 0.013, cpc: 0.768, purchases: 62, performanceTier: 'bottom' },
  { id: 'ad_010', name: 'Testimonial - UGC Video', campaignName: 'Prospecting - Lookalike 2%', status: 'ACTIVE', spend: 3200.00, revenue: 9600.00, roas: 3.00, impressions: 320000, clicks: 4160, ctr: 0.013, cpc: 0.769, purchases: 96, performanceTier: 'mid' },
]
