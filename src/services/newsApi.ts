// src/services/newsApi.ts
export type NewsItem = {
  id: string
  title: string
  url: string | null
  time: number // unix seconds
  by: string
  score?: number
}

type AlgoliaHit = {
  objectID: string
  title?: string
  story_title?: string
  url?: string | null
  story_url?: string | null
  created_at_i?: number
  author?: string
  points?: number
}

type AlgoliaResponse = {
  hits: AlgoliaHit[]
}

export async function searchNews(query: string, limit = 5): Promise<NewsItem[]> {
  const q = query.trim()
  if (!q) return []

  const url =
    `https://hn.algolia.com/api/v1/search?` +
    new URLSearchParams({
      query: q,
      tags: 'story',
      hitsPerPage: String(limit),
    }).toString()

  const res = await fetch(url)
  if (!res.ok) throw new Error(`News API Fehler (${res.status})`)

  const data = (await res.json()) as AlgoliaResponse

  return (data.hits ?? [])
    .map((h) => ({
      id: h.objectID,
      title: h.title ?? h.story_title ?? '(ohne Titel)',
      url: h.url ?? h.story_url ?? null,
      time: h.created_at_i ?? 0,
      by: h.author ?? 'unknown',
      score: h.points,
    }))
    .filter((x) => x.title && x.title !== '(ohne Titel)')
}
