import { motion } from 'motion/react'
import { storyMetrics } from '../data/content'

const ease = [0.22, 1, 0.36, 1] as const

/** Deterministic mini-bar heights per metric — visual rhythm, not data. */
const BARS = [0.55, 0.8, 1, 0.68]

/**
 * Evidence strip — the "what I build" proof moment between hero and
 * about. Hover: the numeral lifts into teal, an amber proof tick draws
 * beneath it, and a small metric-bar visualization rises along the
 * baseline. Amber stays proof-only, per the design language.
 */
export default function Story() {
  return (
    <section aria-label="Evidence at a glance" className="border-y border-line bg-paper-dim/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px lg:grid-cols-4">
        {storyMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease }}
            className="group relative flex flex-col gap-1 px-6 py-8 transition-colors duration-300 hover:bg-paper md:py-10"
          >
            <span className="font-display text-4xl font-medium tracking-tight text-ink transition-all duration-300 group-hover:text-teal-deep md:text-5xl">
              {m.value}
            </span>
            {/* Amber proof tick — draws on hover */}
            <span
              aria-hidden
              className="absolute left-6 top-6 h-[3px] w-8 origin-left scale-x-0 rounded-full bg-amber transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <span className="mt-2 text-sm font-medium text-teal">{m.label}</span>
            <span className="text-xs leading-relaxed text-ink-soft">{m.detail}</span>

            {/* Mini metric visualization — rises on hover, amber-tipped */}
            <span aria-hidden className="mt-4 flex h-6 items-end gap-1">
              {BARS.map((h, bi) => (
                <span
                  key={bi}
                  className="evidence-bar w-2 rounded-sm"
                  style={{
                    height: `${h * 100}%`,
                    background:
                      bi === BARS.length - 1
                        ? 'var(--color-amber)'
                        : 'var(--color-teal)',
                    opacity: bi === BARS.length - 1 ? 0.85 : 0.28,
                    transitionDelay: `${bi * 60}ms`,
                  }}
                />
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
