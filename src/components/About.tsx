import { motion } from 'motion/react'
import { Award, BadgeCheck } from 'lucide-react'
import { about } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from './SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * About — calm and editorial. The professional portrait lives in the
 * Hero now, so this section leans on typography, structure and a
 * single quiet geometric mark instead of imagery.
 */
export default function About() {
  return (
    <section id="about" className="section-pad border-t border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              kicker="About"
              title="Building systems that hold up in production."
            />

            <div className="mt-8 max-w-2xl space-y-5">
              {about.narrative.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="text-[17px] leading-relaxed text-ink-soft"
                >
                  {i === 0 ? (
                    <>
                      {p.split('Brototype')[0]}
                      <span className="font-medium text-ink">Brototype</span>
                      {p.split('Brototype')[1]}
                    </>
                  ) : (
                    <>
                      {p.split('HAIP')[0]}
                      <span className="font-medium text-ink">HAIP</span>
                      {p.split('HAIP')[1]}
                    </>
                  )}
                </motion.p>
              ))}
            </div>

            {/* Education — quiet, structured */}
            <div className="mt-10 max-w-2xl border-t border-line pt-6">
              {about.education.map((e, i) => (
                <motion.div
                  key={e.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-line py-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-ink">{e.title}</p>
                    <p className="max-w-md text-sm leading-relaxed text-ink-soft">{e.detail}</p>
                  </div>
                  <p className="text-sm tabular-nums text-ink-faint">{e.period}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Credentials column — minimal geometry, no photo */}
          <div className="lg:col-span-5">
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="rounded-2xl border border-line bg-paper-dim/50 p-7 lg:sticky lg:top-24"
            >
              <AboutMark />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Credentials</p>
              <ul className="mt-5 space-y-4">
                {about.credentials.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <span className="mt-0.5 text-teal">
                      {c.label.startsWith('Best') ? <Award size={17} aria-hidden /> : <BadgeCheck size={17} aria-hidden />}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{c.label}</p>
                      <p className="text-sm text-ink-soft">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">Languages</p>
                <p className="mt-2 text-sm text-ink-soft">{about.languages.join(' · ')}</p>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">Currently</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Completed the Data Scientist track at Brototype, Kochi — open to Data Scientist and
                  AI/ML Engineer roles in India, the UAE and Europe.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * AboutMark — the section's one quiet graphic: three nested arcs and a
 * diagonal baseline, an abstract nod to model layers settling onto
 * real ground. Draws once when scrolled into view.
 */
function AboutMark() {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 84"
      className="mb-6 h-auto w-full max-w-[240px]"
      role="presentation"
    >
      <motion.path
        d="M 12 72 Q 110 18 208 72"
        fill="none"
        stroke="var(--color-teal)"
        strokeOpacity={0.55}
        strokeWidth={1.6}
        initial={reducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease }}
      />
      <motion.path
        d="M 34 72 Q 110 34 186 72"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.3}
        strokeWidth={1.2}
        initial={reducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.15, ease }}
      />
      <motion.path
        d="M 56 72 Q 110 50 164 72"
        fill="none"
        stroke="var(--color-amber)"
        strokeOpacity={0.5}
        strokeWidth={1.2}
        initial={reducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.3, ease }}
      />
      <line x1={8} y1={72} x2={212} y2={72} stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth={1} />
      <circle cx={110} cy={44} r={3} fill="var(--color-teal)" />
    </svg>
  )
}
