import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircleQuestion, Send, X } from 'lucide-react'
import { profile } from '../../data/content'
import { retrieve } from '../../lib/retrieval'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  sources?: string[]
  confidence?: 'high' | 'medium' | 'low'
}

const SUGGESTIONS = [
  'What is HAIP?',
  'How does the RAG chatbot work?',
  "What's the deployment setup?",
  'Is Soorya available for hire?',
]

const FALLBACK = `I couldn't ground that in my resume — which is exactly what a RAG system should admit. Try asking about HAIP, the two-stage retrieval architecture, forecasting, deployment, skills or how to reach ${profile.name.split(' ')[0]}.`

let nextId = 1

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const composeAnswer = (query: string): { text: string; sources: string[]; confidence: 'high' | 'medium' | 'low' } => {
    const { top, confidence } = retrieve(query)
    if (top.length === 0 || confidence === 'low') {
      return { text: FALLBACK, sources: [], confidence: 'low' }
    }
    const primary = top[0].chunk
    let text = primary.text
    const sources = [primary.source]
    if (top[1] && top[1].score > top[0].score * 0.5) {
      text += `\n\n${top[1].chunk.text}`
      sources.push(top[1].chunk.source)
    }
    return { text, sources, confidence }
  }

  const send = (raw?: string) => {
    const query = (raw ?? input).trim()
    if (!query || thinking) return
    setInput('')
    setMessages((m) => [...m, { id: nextId++, role: 'user', text: query }])
    setThinking(true)

    const delay = reducedMotion ? 150 : 600
    window.setTimeout(() => {
      const answer = composeAnswer(query)
      setThinking(false)
      setMessages((m) => [...m, { id: nextId++, role: 'bot', text: answer.text, sources: answer.sources, confidence: answer.confidence }])
    }, delay)
  }

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Ask about my work — RAG chat demo'}
        aria-expanded={open}
        className="fixed bottom-6 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper shadow-lg transition hover:bg-teal md:bottom-8 md:right-8"
      >
        {open ? <X size={17} aria-hidden /> : <MessageCircleQuestion size={17} aria-hidden />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask my resume'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Resume chat — RAG demo"
            className="fixed inset-x-4 bottom-20 z-40 flex max-h-[70svh] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl sm:left-auto sm:right-6 sm:w-[390px] md:bottom-24 md:right-8"
          >
            {/* Header */}
            <div className="border-b border-line bg-paper-dim/70 px-5 py-4">
              <p className="font-display text-lg text-ink">Ask about my work</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                Client-side retrieval over my resume — the same idea as HAIP's RAG, running in your browser. No API, no keys.
              </p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="chat-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.length === 0 && !thinking && (
                <div className="space-y-3">
                  <p className="text-sm text-ink-soft">
                    Try one of these — or ask anything about my projects and skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-teal/35 bg-accent-soft/60 px-3 py-1.5 text-xs font-medium text-teal-deep transition hover:bg-teal hover:text-paper"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm leading-relaxed text-paper">
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div key={m.id} className="flex flex-col gap-1.5">
                    <TypeOut text={m.text} />
                    {m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-ink-soft">Grounded in</span>
                        {m.sources.map((s) => (
                          <span key={s} className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-teal-deep">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}

              {thinking && (
                <div className="flex items-center gap-1.5" aria-label="Retrieving">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
                      className="h-1.5 w-1.5 rounded-full bg-teal"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-center gap-2 border-t border-line px-4 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. How does the two-stage RAG work?"
                aria-label="Ask a question"
                className="h-10 flex-1 rounded-full border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-teal focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal text-paper transition hover:bg-teal-deep disabled:opacity-40"
              >
                <Send size={15} aria-hidden />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Reveals text word by word — a nod to token streaming, but honest: it's local. */
function TypeOut({ text }: { text: string }) {
  const reducedMotion = usePrefersReducedMotion()
  const words = text.split(' ')
  const [visible, setVisible] = useState(reducedMotion ? words.length : 0)

  useEffect(() => {
    if (reducedMotion) {
      setVisible(words.length)
      return
    }
    setVisible(0)
    const interval = window.setInterval(() => {
      setVisible((v) => {
        if (v >= words.length) {
          window.clearInterval(interval)
          return v
        }
        return v + 2
      })
    }, 24)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reducedMotion])

  return (
    <p className="max-w-[92%] whitespace-pre-line rounded-2xl rounded-bl-sm border border-line bg-paper-dim/60 px-4 py-2.5 text-sm leading-relaxed text-ink">
      {words.slice(0, visible).join(' ')}
      {visible < words.length && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-teal align-middle" />}
    </p>
  )
}
