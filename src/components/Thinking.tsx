import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { thinkingPipeline } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const ease = [0.22, 1, 0.36, 1] as const

/** Minimal engineering glyphs, one per step — draw when the step activates. */
function StepGlyph({ index, active }: { index: number; active: boolean }) {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const }
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`h-5 w-5 transition-opacity duration-500 ${active ? 'opacity-90' : 'opacity-25'}`}
    >
      {index === 0 && (
        <>
          <circle cx={12} cy={12} r={8.5} {...c} />
          <circle cx={12} cy={12} r={2} fill="currentColor" stroke="none" />
          <path d="M12 3.5V8M12 16v4.5" {...c} />
        </>
      )}
      {index === 1 && (
        <>
          <ellipse cx={12} cy={6.5} rx={7} ry={2.8} {...c} />
          <path d="M5 6.5v11c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-11" {...c} />
          <path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" {...c} />
        </>
      )}
      {index === 2 && (
        <>
          <path d="M4 17.5 9.5 10l3.5 4 6.5-8" {...c} />
          <path d="M15 6h4.5v4.5" {...c} />
        </>
      )}
      {index === 3 && (
        <>
          <rect x={4} y={4} width={7} height={7} rx={1.5} {...c} />
          <rect x={13} y={13} width={7} height={7} rx={1.5} {...c} />
          <path d="M11 7.5h5.5v5.5M13 16.5H7.5V11" {...c} />
        </>
      )}
      {index === 4 && (
        <>
          <path d="M4 15a8 8 0 0 1 16 0" {...c} strokeDasharray="2.5 3" />
          <circle cx={12} cy={15} r={1.8} fill="currentColor" stroke="none" />
          <path d="M12 4.5v3M20 15h-2.5M6.5 15H4" {...c} />
        </>
      )}
    </svg>
  )
}

/**
 * "How I think" — the five-step pipeline I run on every problem,
 * rendered as a vertical journey whose connecting line fills as the
 * user scrolls. Steps become active by scroll position (or hover):
 * the number fills teal, the glyph draws in, the example emphasizes.
 */
export default function Thinking() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [scrollIdx, setScrollIdx] = useState(0)
  const canHover = useMediaQuery('(hover: hover)')
  const reducedMotion = usePrefersReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.72', 'end 0.55'],
  })
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.04, 1])
  const spineScale = useSpring(rawScale, { stiffness: 90, damping: 26 })
  const spineOpacity = useTransform(scrollYProgress, [0, 0.02, 1], [0, 1, 1])

  // Scroll-driven active step — last step whose node is above 68% of the viewport.
  useEffect(() => {
    if (reducedMotion) return
    const rows = listRef.current?.querySelectorAll<HTMLElement>('[data-step-row]')
    if (!rows || rows.length === 0) return
    const onScroll = () => {
      let idx = 0
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.68) idx = i
      })
      setScrollIdx(idx)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  const activeIdx = hoverIdx ?? (reducedMotion ? null : scrollIdx)

  return (
    <section id="thinking" className="section-wash section-pad border-t border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease }}
              className="text-xs font-medium uppercase tracking-[0.22em] text-teal"
            >
              How I think
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl"
            >
              Every problem runs through the same pipeline.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.16, ease }}
              className="mt-4 leading-relaxed text-ink-soft"
            >
              Five steps, no shortcuts. The same discipline that ships a six-service platform
              also ships a single model file with tests.
            </motion.p>
          </div>

          <div className="relative md:col-span-8">
            {/* Spine — base line plus a scroll-filled progress overlay */}
            <span aria-hidden className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-px bg-line" />
            <motion.span
              aria-hidden
              className="absolute left-[14.5px] top-2 w-[2px] origin-top rounded-full bg-teal"
              style={{ scaleY: spineScale, opacity: spineOpacity, height: 'calc(100% - 16px)' }}
            />

            <div ref={listRef} className="space-y-8">
              {thinkingPipeline.map((s, i) => {
                const active = activeIdx === i
                const passed = !reducedMotion && scrollIdx >= i
                return (
                  <motion.div
                    key={s.step}
                    data-step-row
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease }}
                    onMouseEnter={canHover ? () => setHoverIdx(i) : undefined}
                    onMouseLeave={canHover ? () => setHoverIdx(null) : undefined}
                    className="relative flex gap-6 pl-0"
                  >
                    <span
                      className={`relative z-10 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                        active
                          ? 'border-teal bg-teal text-paper shadow-[0_6px_16px_-6px_rgba(47,93,80,0.6)]'
                          : passed
                            ? 'border-teal bg-teal-mist text-teal-deep'
                            : 'border-teal/40 bg-paper text-teal'
                      }`}
                    >
                      {s.step}
                    </span>
                    <div className="flex-1 border-b border-line pb-8 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-4">
                        <h3
                          className={`font-display text-xl transition-all duration-300 ${
                            active ? 'text-teal-deep' : 'text-ink'
                          }`}
                        >
                          {s.title}
                        </h3>
                        <span className={`text-teal transition-all duration-500 ${active ? 'scale-100' : 'scale-90'}`}>
                          <StepGlyph index={i} active={active} />
                        </span>
                      </div>
                      <p className={`mt-1.5 text-sm leading-relaxed transition-colors duration-300 ${active ? 'text-ink' : 'text-ink-soft'}`}>
                        {s.detail}
                      </p>
                      <p
                        className={`mt-2 rounded-md px-2 py-1.5 -mx-2 text-sm leading-relaxed transition-all duration-300 ${
                          active ? 'bg-accent-soft text-teal-deep' : 'text-teal-deep/80'
                        }`}
                      >
                        <span className="font-medium">In practice — </span>
                        {s.example}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
