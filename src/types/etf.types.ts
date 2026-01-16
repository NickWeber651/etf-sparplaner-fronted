// ETF Type Definitions

export type RiskLabel = 'niedrig' | 'mittel' | 'hoch'

export interface EtfInfo {
  id: number
  name: string
  isin: string
  ter: number
  coverage: string
  regions: string
  diversification: string
  notes: string[]
  volatility1y: number
  maxDrawdown1y: number
  riskLabel: RiskLabel
}

export interface EtfBasic {
  id: number
  name: string
  isin: string
  ter: number
}

