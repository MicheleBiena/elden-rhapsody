interface HighlightedTextProps {
  text: string
  highlights?: string[]
}

interface TextSegment {
  text: string
  highlighted: boolean
}

function splitText(text: string, highlights: string[]): TextSegment[] {
  const validHighlights = [...new Set(highlights.filter((highlight) => highlight && text.includes(highlight)))]
  const segments: TextSegment[] = []
  let cursor = 0

  while (cursor < text.length) {
    const next = validHighlights
      .map((highlight) => ({ highlight, index: text.indexOf(highlight, cursor) }))
      .filter(({ index }) => index >= 0)
      .sort((a, b) => a.index - b.index || b.highlight.length - a.highlight.length)[0]

    if (!next) {
      segments.push({ text: text.slice(cursor), highlighted: false })
      break
    }

    if (next.index > cursor) {
      segments.push({ text: text.slice(cursor, next.index), highlighted: false })
    }
    segments.push({ text: next.highlight, highlighted: true })
    cursor = next.index + next.highlight.length
  }

  return segments
}

export function HighlightedText({ text, highlights = [] }: HighlightedTextProps) {
  if (highlights.length === 0) return text

  return splitText(text, highlights).map((segment, index) => segment.highlighted ? (
    <mark className="live-update-highlight" key={`${index}-${segment.text}`}>
      <span className="live-update-highlight__label">Aggiunto ora</span>
      {segment.text}
    </mark>
  ) : segment.text)
}
