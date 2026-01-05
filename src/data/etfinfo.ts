// src/data/etfInfo.ts
export type RiskLabel = 'niedrig' | 'mittel' | 'hoch'

export interface EtfInfo {
  id: number
  name: string
  isin: string
  ter: number

  // “Profil”-Infos (stabil, nicht zeitkritisch)
  coverage: string           // z.B. "USA Large Caps"
  regions: string            // z.B. "USA" / "Welt" / "Welt inkl. EM"
  diversification: string    // z.B. "mittel/hoch"
  notes: string[]            // Bulletpoints

  // Mock-Metriken (später echt aus Backend)
  volatility1y: number       // in %, z.B. 16.2
  maxDrawdown1y: number      // in %, z.B. -12.4
  riskLabel: RiskLabel
}

export const ETF_INFO: EtfInfo[] = [
  {
    id: 1,
    name: 'S&P 500',
    isin: 'IE00B5BMR087',
    ter: 0.0007,
    coverage: 'USA (Large Caps)',
    regions: 'USA',
    diversification: 'mittel',
    notes: [
      'Stark USA-lastig, viele Tech-Werte',
      'Kann in USD-Schwankungen enthalten (je nach Produkt)',
      'Historisch oft gute Rendite – aber Klumpenrisiko USA',
    ],
    volatility1y: 17.0,
    maxDrawdown1y: -14.0,
    riskLabel: 'mittel',
  },
  {
    id: 2,
    name: 'MSCI World',
    isin: 'IE00B4L5Y983',
    ter: 0.0020,
    coverage: 'Industrieländer weltweit',
    regions: 'Welt (Developed Markets)',
    diversification: 'hoch',
    notes: [
      'Breit gestreut über viele Länder/Branchen',
      'Trotz “World” meist hoher USA-Anteil',
      'Guter “Core”-Baustein für langfristig',
    ],
    volatility1y: 15.5,
    maxDrawdown1y: -12.5,
    riskLabel: 'mittel',
  },
  {
    id: 3,
    name: 'FTSE All-World',
    isin: 'IE00B3RBWM25',
    ter: 0.0022,
    coverage: 'Welt inkl. Schwellenländer',
    regions: 'Welt (Developed + Emerging)',
    diversification: 'sehr hoch',
    notes: [
      'Noch breiter als MSCI World (inkl. Emerging Markets)',
      'EM können Schwankungen erhöhen',
      'Sehr guter “All-in-One”-Weltbaustein',
    ],
    volatility1y: 16.2,
    maxDrawdown1y: -13.2,
    riskLabel: 'mittel',
  },
]
