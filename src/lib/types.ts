export interface DateRange {
  preset: '7d' | '14d' | '30d' | '90d' | 'this_month' | 'last_month'
  startDate: string
  endDate: string
}

export interface KPIs {
  spend: number
  revenue: number
  roas: number
  ctr: number
  cpc: number
  cpm: number
  cpa: number
  purchases: number
  impressions: number
  clicks: number
  spendChange: number
  revenueChange: number
  roasChange: number
  ctrChange: number
  cpcChange: number
  cpmChange: number
  cpaChange: number
  purchasesChange: number
  impressionsChange: number
}

export interface DailyInsight {
  date: string
  spend: number
  revenue: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
}

export interface Campaign {
  id: string
  name: string
  objective: string
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED'
  spend: number
  revenue: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
  cpa: number
  dailyBudget?: number
}

export interface Creative {
  id: string
  name: string
  campaignName: string
  status: 'ACTIVE' | 'PAUSED'
  thumbnailUrl?: string
  spend: number
  revenue: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
  performanceTier: 'top' | 'mid' | 'bottom'
}

export interface AdAccount {
  id: string
  name: string
  currency: string
  status: number
}

export interface MetaUser {
  id: string
  name: string
  email?: string
}

export interface Alert {
  type: 'ctr_fatigue' | 'budget_waste' | 'scaling_opportunity' | 'roas_drop' | 'pacing_issue'
  message: string
  severity: 'high' | 'medium' | 'low'
}

export interface AssistantRecommendation {
  type: 'scale' | 'pause' | 'test' | 'budget' | 'audience' | 'creative'
  priority: 'high' | 'medium' | 'low'
  title: string
  insight: string
  action: string
  impact: string
  metric?: string
  metricValue?: string
}

export interface AssistantResponse {
  accountHealth: 'excellent' | 'good' | 'warning' | 'critical'
  healthScore: number
  healthSummary: string
  recommendations: AssistantRecommendation[]
  alerts: Alert[]
  generatedAt: string
}

export interface User {
  id: string
  name: string
  email?: string
}

export interface UserSettings {
  defaultDateRange: DateRange['preset']
  currency: string
  timezone: string
  notificationsEnabled: boolean
}
