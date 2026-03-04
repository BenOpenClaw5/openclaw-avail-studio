import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { KPIs, Campaign, Creative, DateRange } from '@/lib/types'

const client = new Anthropic()

const SYSTEM = `You are a senior Meta Ads strategist. Analyze the ad data and return ONLY valid JSON, no markdown:

{
  "accountHealth": "excellent|good|warning|critical",
  "healthScore": <0-100>,
  "healthSummary": "<2 sentences>",
  "recommendations": [{
    "type": "scale|pause|test|budget|audience|creative",
    "priority": "high|medium|low",
    "title": "<max 8 words>",
    "insight": "<1-2 sentences citing specific numbers>",
    "action": "<specific actionable step>",
    "impact": "<expected outcome>",
    "metric": "<metric name>",
    "metricValue": "<value>"
  }],
  "alerts": [{
    "type": "ctr_fatigue|budget_waste|scaling_opportunity|roas_drop|pacing_issue",
    "message": "<cites specific data>",
    "severity": "high|medium|low"
  }]
}

Generate 4-7 recommendations, 0-3 real alerts only. Be direct and data-driven.`

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    accountData: KPIs; campaigns: Campaign[]; creatives: Creative[]; dateRange: DateRange
  }
  const { accountData: k, campaigns, creatives, dateRange } = body

  const prompt = `Period: ${dateRange.startDate} to ${dateRange.endDate}

KPIs: Spend $${k.spend.toFixed(0)} (${(k.spendChange*100).toFixed(1)}% vs prior), Revenue $${k.revenue.toFixed(0)} (${(k.revenueChange*100).toFixed(1)}%), ROAS ${k.roas.toFixed(2)}x, CTR ${(k.ctr*100).toFixed(2)}%, CPC $${k.cpc.toFixed(2)}, CPA $${k.cpa.toFixed(2)}, Purchases ${k.purchases}

Campaigns (${campaigns.length}):
${campaigns.map(c => `- ${c.name} [${c.status}]: $${c.spend.toFixed(0)} spend, ${c.roas.toFixed(2)}x ROAS, ${(c.ctr*100).toFixed(2)}% CTR, $${c.cpa.toFixed(2)} CPA`).join('\n')}

Creatives (${creatives.length}):
${creatives.map(c => `- ${c.name} [${c.performanceTier.toUpperCase()}]: $${c.spend.toFixed(0)} spend, ${c.roas.toFixed(2)}x ROAS, ${(c.ctr*100).toFixed(2)}% CTR`).join('\n')}`

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = msg.content.find(b => b.type === 'text')
    if (!block || block.type !== 'text') throw new Error('No response')
    let json = block.text.trim()
    if (json.startsWith('`')) json = json.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const result = JSON.parse(json)
    result.generatedAt = new Date().toISOString()
    return NextResponse.json(result)
  } catch (err) {
    console.error('Assistant error:', err)
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 })
  }
}
