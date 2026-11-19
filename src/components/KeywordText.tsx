import { normalizeKeyword } from '../lib/keywordSearch'

export function KeywordText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return text
  const normalized = normalizeKeyword(text)
  let index = normalized.indexOf(keyword)
  if (index < 0) return text

  // Map folded characters back to their original spelling, including combining accents.
  const offsets: number[] = []
  for (const cluster of text.matchAll(/\P{M}\p{M}*|\p{M}+/gu)) {
    for (let i = 0; i < normalizeKeyword(cluster[0]).length; i++) offsets.push(cluster.index)
  }
  offsets.push(text.length)
  const parts = []
  let cursor = 0
  while (index >= 0) {
    const start = offsets[index]
    const end = offsets[index + keyword.length]
    parts.push(text.slice(cursor, start), <mark className="keyword-match" key={index}>{text.slice(start, end)}</mark>)
    cursor = end
    index = normalized.indexOf(keyword, index + keyword.length)
  }
  return [...parts, text.slice(cursor)]
}
