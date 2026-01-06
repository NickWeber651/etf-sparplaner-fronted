// src/services/fxApi.ts
export type LatestRatesResponse = {
  base: string
  date: string
  rates: Record<string, number>
}

export async function getLatestRates(
  base: string = 'EUR',
  symbols: string[] = ['USD', 'GBP', 'CHF']
): Promise<LatestRatesResponse> {
  const qs = new URLSearchParams({
    base,
    symbols: symbols.join(','),
  })

  const url = `https://api.frankfurter.dev/v1/latest?${qs.toString()}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`FX API error: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as LatestRatesResponse
}
