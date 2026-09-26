import { knowledgeBase, type KnowledgeChunk } from '../data/content'

// ─────────────────────────────────────────────────────────────
// Client-side retrieval engine — a small TF-IDF-style scorer.
// This is the honest, dependency-free core of the chat demo:
// chunk → tokenize → score → top-k with confidence.
// ─────────────────────────────────────────────────────────────

export interface RetrievedChunk {
  chunk: KnowledgeChunk
  score: number
}

export interface RetrievalResult {
  top: RetrievedChunk[]
  bestScore: number
  confidence: 'high' | 'medium' | 'low'
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'what', 'which', 'who', 'whom', 'how', 'why', 'when', 'where',
  'do', 'does', 'did', 'done', 'can', 'could', 'will', 'would', 'should',
  'i', 'me', 'my', 'you', 'your', 'he', 'she', 'it', 'they', 'them',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'from', 'by',
  'and', 'or', 'not', 'but', 'so', 'if', 'then', 'than', 'too', 'very',
  'tell', 'give', 'show', 'know', 'want', 'need', 'like', 'use', 'using',
  'his', 'her', 'their', 'this', 'that', 'these', 'those', 'there', 'any', 'much', 'many',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
}

// Precompute term frequencies once. Keywords are weighted 3× above body text.
const chunkTokens = knowledgeBase.map(() => ({ tf: new Map<string, number>() }))

// Fill term frequencies (keywords are weighted 3× above).
for (let i = 0; i < knowledgeBase.length; i++) {
  const chunk = knowledgeBase[i]
  const bodyTokens = tokenize(`${chunk.title} ${chunk.text}`)
  const keywordTokens = tokenize(chunk.keywords.join(' '))
  const tf = chunkTokens[i].tf
  for (const t of bodyTokens) tf.set(t, (tf.get(t) ?? 0) + 1)
  for (const t of keywordTokens) tf.set(t, (tf.get(t) ?? 0) + 3)
}

const docFreq = new Map<string, number>()
for (const { tf } of chunkTokens) {
  for (const term of tf.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1)
}
const N = knowledgeBase.length

export function retrieve(query: string): RetrievalResult {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) {
    return { top: [], bestScore: 0, confidence: 'low' }
  }

  const scored: RetrievedChunk[] = knowledgeBase.map((chunk, i) => {
    const tf = chunkTokens[i].tf
    let score = 0
    for (const token of queryTokens) {
      const freq = tf.get(token) ?? 0
      if (freq === 0) continue
      const idf = Math.log((N + 1) / ((docFreq.get(token) ?? 0) + 0.5))
      score += (1 + Math.log(freq)) * idf
    }
    return { chunk, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]?.score ?? 0

  // Normalize against a reference max score for this query length.
  const referenceMax = queryTokens.reduce((sum, token) => {
    const idf = Math.log((N + 1) / ((docFreq.get(token) ?? 0) + 0.5))
    return sum + (1 + Math.log(3)) * Math.max(idf, 1)
  }, 0)
  const normalized = referenceMax > 0 ? Math.min(1, best / referenceMax) : 0

  const confidence: RetrievalResult['confidence'] =
    normalized > 0.55 ? 'high' : normalized > 0.25 ? 'medium' : 'low'

  return {
    top: scored.filter((s) => s.score > 0).slice(0, 3),
    bestScore: normalized,
    confidence,
  }
}
