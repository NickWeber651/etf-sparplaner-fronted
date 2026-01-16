/**
 * NEWS TYPES
 * TypeScript Type-Definitionen für News-API (Hacker News)
 */

export interface NewsItem {
  id: string
  title: string
  url: string | null
  time: number // unix timestamp (seconds)
  by: string
  score?: number
}

