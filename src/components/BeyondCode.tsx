import { useState } from 'react'
import { motion } from 'motion/react'
import { Compass, MessageSquare, Puzzle, RefreshCw, Target, Users } from 'lucide-react'
import { photos, softSkills } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from './SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

const ICONS = {
  message: MessageSquare,
  target: Target,
  users: Users,
  refresh: RefreshCw,
  compass: Compass,
  puzzle: Puzzle,
} as const

/**
 * Beyond the code — the person behind the technical work.
 * Desktop: a balanced two-column composition — the candid photo as
 * the anchor inside a warm card, three floating habit labels orbiting
 * its corners, a fixed description slot beside the photo, and the six
 * habits as a quiet interactive list next to it. Mobile: stacks
 * photo → description → habit list. No technical-diagram look.
 */
export default function BeyondCode() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="beyond" className="section-pad border-t border-line bg-paper-dim/40">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          kicker="Beyond the code"
          title="The person behind the technical work."
          description="Six working habits, one person — hover a habit to see where it comes from."
        />

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-12">
          {/* ── Photo anchor + floating labels + fixed reveal ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease }}
            className="relative flex flex-col items-stretch overflow-hidden rounded-2xl border border-line bg-paper p-6 shadow-[0_20px_50px_-30px_rgba(28,36,49,0.35)] sm:flex-row sm:items-center sm:p-8 lg:col-span-7"
          >
            {/* Mobile photo — stacked first */}
            <div className="order-1 mb-4 sm:hidden">
              <FloatingLabels active={active} setActive={setActive} compact />
            </div>

            {/* Desktop photo + floating labels */}
            <div className="relative hidden shrink-0 sm:block sm:order-1 sm:w-[46%]">
              <FloatingLabels active={active} setActive={setActive} />
            </div>

            {/* Fixed description slot — steady height, no layout shift */}
            <div className="relative order-2 flex min-h-[132px] flex-1 items-center sm:order-2 sm:min-h-[168px] sm:pl-8">
              <div className="relative w-full">
                <motion.p
                  aria-hidden={active !== null}
                  animate={{ opacity: active === null ? 1 : 0, y: active === null ? 0 : -8 }}
                  transition={{ duration: 0.3, ease }}
                  className={`text-[15px] leading-relaxed text-ink-soft sm:text-base ${active !== null ? 'pointer-events-none' : ''}`}
                >
                  Models and metrics only tell half the story — the other half is how the work
                  gets done. Hover a habit to see where each one comes from.
                </motion.p>
                <div className="absolute inset-0" aria-live="polite">
                  {active !== null && (
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <p className="flex items-center gap-2 font-display text-lg text-ink">
                        <span className="text-teal">
                          {(() => {
                            const Icon = ICONS[softSkills[active].icon as keyof typeof ICONS] ?? Target
                            return <Icon size={17} aria-hidden />
                          })()}
                        </span>
                        {softSkills[active].name}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                        {softSkills[active].detail}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>


          </motion.div>

          {/* ── Habit list — the six, quiet and interactive ── */}
          <ul className="flex flex-col justify-center gap-2.5 lg:col-span-5">
            {softSkills.map((s, i) => {
              const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Target
              const lit = active === i
              return (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                    lit
                      ? 'border-teal/60 bg-accent-soft shadow-[0_10px_24px_-14px_rgba(47,93,80,0.45)]'
                      : 'border-line bg-paper hover:border-teal/40'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors duration-300 ${
                      lit ? 'bg-teal text-paper' : 'bg-accent-soft text-teal'
                    }`}
                  >
                    <Icon size={16} aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className={`block font-medium transition-colors ${lit ? 'text-teal-deep' : 'text-ink'}`}>
                      {s.name}
                    </span>
                    {/* Detail inline on touch/small screens; hover-reveal slot on desktop */}
                    <span className={`mt-0.5 block text-sm leading-snug text-ink-soft lg:hidden ${lit ? '' : 'hidden'}`}>
                      {s.detail}
                    </span>
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ scaleX: lit ? 1 : 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="hidden h-[2px] w-8 origin-left rounded-full bg-teal lg:block"
                  />
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ── Photo with three floating habit labels ────────────────────
 * A warm portrait card; labels drift gently and light up when their
 * habit is hovered in the list. The labels sit near the photo's
 * corners, connected by a short curved thread. ─────────────────── */

const FLOATERS: { index: number; style: React.CSSProperties }[] = [
  { index: 1, style: { top: '-7%', left: '-14%' } }, // Ownership
  { index: 0, style: { bottom: '9%', right: '-11%' } }, // Communication
  { index: 4, style: { bottom: '-7%', left: '-10%' } }, // Critical Thinking
]

function FloatingLabels({
  active,
  setActive,
  compact = false,
}: {
  active: number | null
  setActive: (i: number | null) => void
  compact?: boolean
}) {
  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)')

  return (
    <div className={`relative ${compact ? 'mx-auto max-w-[260px]' : ''}`}>
      {/* Photo card */}
      <div
        className={`portrait-frame group relative overflow-hidden rounded-2xl border border-line bg-paper-dim shadow-[0_18px_44px_-24px_rgba(28,36,49,0.5)] ${
          compact ? '' : 'aspect-[4/5]'
        }`}
        style={compact ? { aspectRatio: '4 / 5' } : undefined}
      >
        <img
          src={photos.candid.src}
          alt={photos.candid.alt}
          loading="lazy"
          decoding="async"
          width={445}
          height={597}
          className="portrait-img h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute bottom-2.5 left-3 rounded bg-ink/70 px-2 py-0.5 font-display text-[11px] text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {photos.candid.caption}
        </span>
      </div>

      {/* Floating labels */}
      {FLOATERS.map((f) => {
        const s = softSkills[f.index]
        const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Target
        const lit = active === f.index
        return (
          <motion.button
            key={s.name}
            type="button"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 + f.index * 0.08, ease }}
            onMouseEnter={() => setActive(f.index)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(lit ? null : f.index)}
            onFocus={() => setActive(f.index)}
            onBlur={() => setActive(null)}
            aria-label={`${s.name} — ${s.detail}`}
            style={f.style}
            className={`absolute z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-paper/95 py-1.5 pl-2 pr-3 text-xs font-semibold shadow-[0_8px_20px_-10px_rgba(28,36,49,0.4)] backdrop-blur transition-colors duration-300 ${
              lit ? 'border-teal text-teal-deep' : 'border-line text-ink'
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full transition-colors duration-300 ${
                lit ? 'bg-teal text-paper' : 'bg-accent-soft text-teal'
              }`}
            >
              <Icon size={11} aria-hidden />
            </span>
            {s.name}
            {!isTouch && !reducedMotion && (
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-3 h-1 w-1 rounded-full bg-teal"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.4 + f.index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.button>
        )
      })}

      {/* One quiet connecting thread, photo to the nearest label */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -right-8 top-1/2 hidden h-16 w-10 -translate-y-1/2 lg:block"
      >
        <path d="M 2 50 Q 50 38 96 46" fill="none" stroke="var(--color-teal)" strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray="3 4" />
        <circle cx={96} cy={46} r={2} fill="var(--color-teal)" fillOpacity={0.5} />
      </svg>
    </div>
  )
}
