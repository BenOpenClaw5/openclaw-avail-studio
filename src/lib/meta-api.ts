import type { AdAccount, Campaign, Creative, DailyInsight, MetaUser, DateRange } from './types'

const BASE = 'https://graph.facebook.com/v18.0'

export class MetaAPIError extends Error {
  constructor(
    message: string,
    public code: number,
    public type: 'expired_token' | 'permission_denied' | 'rate_limit' | 'unknown'
  ) {
    super(message)
    this.name = 'MetaAPIError'
  }
}

async function fetchMeta<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const data = await res.json()
  if (data.error) {
    const code = data.error.code || 0
    let type: MetaAPIError['type'] = 'unknown'
    if (code === 190 || code === 102) type = 'expired_token'
    else if (code === 200 || code === 10) type = 'permission_denied'
    else if (code === 4 || code === 17 || code === 32) type = 'rate_limit'
    throw new MetaAPIError(data.error.message, code, type)
  }
  return data as T
}

export async function getMe(token: string): Promise<MetaUser> {
  return fetchMeta<MetaUser>(BASE + '/me?fields=id,name,email&access_token=' + token)
}

export async function getAdAccounts(token: string): Promise<AdAccount[]> {
  const data = await fetchMeta<{ data: Array<{ id: string; name: string; currency: string; account_status: number }> }>(
    BASE + '/me/adaccounts?fields=id,name,currency,account_status&access_token=' + token
  )
  return data.data.map(a => ({ id: a.id, name: a.name, currency: a.currency, status: a.account_status }))
}

export async function getDailyInsights(token: string, accountId: string, dateRange: DateRange): Promise<DailyInsight[]> {
  const params = new URLSearchParams({
    fields: 'spend,impressions,clicks,actions,action_values,date_start',
    time_range: JSON.stringify({ since: dateRange.startDate, until: dateRange.endDate }),
    time_increment: '1',
    access_token: token,
  })
  const data = await fetchMeta<{ data: Array<Record<string, unknown>> }>(BASE + '/' + accountId + '/insights?' + params)
  return data.data.map(row => {
    const spend = parseFloat((row.spend as string) || '0')
    const impressions = parseInt((row.impressions as string) || '0')
    const clicks = parseInt((row.clicks as string) || '0')
    const actions = (row.actions as Array<{ action_type: string; value: string }>) || []
    const purchases = parseInt(actions.find(a => a.action_type === 'purchase')?.value || '0')
    const actionValues = (row.action_values as Array<{ action_type: string; value: string }>) || []
    const revenue = parseFloat(actionValues.find(a => a.action_type === 'purchase')?.value || '0')
    return {
      date: row.date_start as string,
      spend, revenue,
      roas: spend > 0 ? revenue / spend : 0,
      impressions, clicks,
      ctr: impressions > 0 ? clicks / impressions : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      purchases,
    }
  })
}

export async function getCampaigns(token: string, accountId: string, dateRange: DateRange): Promise<Campaign[]> {
  const params = new URLSearchParams({ fields: 'id,name,objective,status,daily_budget', access_token: token })
  const campaignData = await fetchMeta<{ data: Array<Record<string, unknown>> }>(BASE + '/' + accountId + '/campaigns?' + params)
  return Promise.all(campaignData.data.map(async (camp) => {
    const iparams = new URLSearchParams({
      fields: 'spend,impressions,clicks,actions,action_values',
      time_range: JSON.stringify({ since: dateRange.startDate, until: dateRange.endDate }),
      access_token: token,
    })
    const insightsData = await fetchMeta<{ data: Array<Record<string, unknown>> }>(BASE + '/' + camp.id + '/insights?' + iparams)
    const row = insightsData.data[0] || {}
    const spend = parseFloat((row.spend as string) || '0')
    const impressions = parseInt((row.impressions as string) || '0')
    const clicks = parseInt((row.clicks as string) || '0')
    const actions = (row.actions as Array<{ action_type: string; value: string }>) || []
    const purchases = parseInt(actions.find(a => a.action_type === 'purchase')?.value || '0')
    const actionValues = (row.action_values as Array<{ action_type: string; value: string }>) || []
    const revenue = parseFloat(actionValues.find(a => a.action_type === 'purchase')?.value || '0')
    return {
      id: camp.id as string,
      name: camp.name as string,
      objective: camp.objective as string,
      status: camp.status as Campaign['status'],
      spend, revenue,
      roas: spend > 0 ? revenue / spend : 0,
      impressions, clicks,
      ctr: impressions > 0 ? clicks / impressions : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      purchases,
      cpa: purchases > 0 ? spend / purchases : 0,
      dailyBudget: camp.daily_budget ? parseFloat(camp.daily_budget as string) / 100 : undefined,
    }
  }))
}

export async function getCreatives(token: string, accountId: string, dateRange: DateRange): Promise<Creative[]> {
  const params = new URLSearchParams({
    fields: 'id,name,status,campaign{name},creative{thumbnail_url}',
    access_token: token,
  })
  const adsData = await fetchMeta<{ data: Array<Record<string, unknown>> }>(BASE + '/' + accountId + '/ads?' + params)
  return Promise.all(adsData.data.map(async (ad) => {
    const iparams = new URLSearchParams({
      fields: 'spend,impressions,clicks,actions,action_values',
      time_range: JSON.stringify({ since: dateRange.startDate, until: dateRange.endDate }),
      access_token: token,
    })
    const insightsData = await fetchMeta<{ data: Array<Record<string, unknown>> }>(BASE + '/' + ad.id + '/insights?' + iparams)
    const row = insightsData.data[0] || {}
    const spend = parseFloat((row.spend as string) || '0')
    const impressions = parseInt((row.impressions as string) || '0')
    const clicks = parseInt((row.clicks as string) || '0')
    const actions = (row.actions as Array<{ action_type: string; value: string }>) || []
    const purchases = parseInt(actions.find(a => a.action_type === 'purchase')?.value || '0')
    const actionValues = (row.action_values as Array<{ action_type: string; value: string }>) || []
    const revenue = parseFloat(actionValues.find(a => a.action_type === 'purchase')?.value || '0')
    const roas = spend > 0 ? revenue / spend : 0
    const campaign = ad.campaign as { name: string } | undefined
    const creative = ad.creative as { thumbnail_url?: string } | undefined
    let performanceTier: Creative['performanceTier'] = 'mid'
    if (roas >= 3) performanceTier = 'top'
    else if (roas < 1.5) performanceTier = 'bottom'
    return {
      id: ad.id as string,
      name: ad.name as string,
      campaignName: campaign?.name || 'Unknown Campaign',
      status: ad.status as Creative['status'],
      thumbnailUrl: creative?.thumbnail_url,
      spend, revenue, roas, impressions, clicks,
      ctr: impressions > 0 ? clicks / impressions : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      purchases, performanceTier,
    }
  }))
}
