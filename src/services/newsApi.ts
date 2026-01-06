// src/services/newsApi.ts
export type NewsItem = {
  id: number
  title: string
  url: string | null
  by: string
  time: number // unix seconds
  score?: number
}

const BASE = 'https://hacker-news.firebaseio.com/v0'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`News API Fehler (${res.status})`)
  return (await res.json()) as T
}

/**
 * Holt Top-Story-IDs (z.B. 500 IDs), wir filtern danach clientseitig.
 */
async function getTopStoryIds(): Promise<number[]> {
  return fetchJson<number[]>(`${BASE}/topstories.json`)
}

/**
 * Holt eine einzelne Story
 */
async function getItem(id: number): Promise<any> {
  return fetchJson<any>(`${BASE}/item/${id}.json`)
}

/**
 * Simple Keyword-Filter: lädt die ersten N IDs, holt Items, filtert nach Query.
 * Für Demo absolut ok.
 */
export async function searchNews(query: string, limit = 5): Promise<NewsItem[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const ids = await getTopStoryIds()
  const slice = ids.slice(0, 120) // nicht zu viele Requests

  const items = await Promise.all(slice.map(id => getItem(id)))

  const filtered = items
    .filter(Boolean)
    .filter((x: any) => x.type === 'story' && typeof x.title === 'string')
    .filter((x: any) => x.title.toLowerCase().includes(q))
    .slice(0, limit)
    .map((x: any) => ({
      id: x.id,
      title: x.title,
      url: x.url ?? null,
      by: x.by ?? 'unknown',
      time: x.time ?? 0,
      score: x.score,
    }))

  return filtered
}
