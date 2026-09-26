import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown, ExternalLink, Github, X } from 'lucide-react'
import { projects, type ProjectWithFlow } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from './SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>('haip')
  const [caseStudyOpen, setCaseStudyOpen] = useState(false)

  return (
    <section id="projects" className="section-pad border-t border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          kicker="Projects — flagship first"
          title="Systems that run, not demos that scroll."
          description="Hover a row to see its pipeline move. HAIP opens into a full case study."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="mt-12 divide-y divide-line border-y border-line"
        >
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              open={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
              onOpenCaseStudy={p.id === 'haip' ? () => setCaseStudyOpen(true) : undefined}
            />
          ))}
        </motion.div>
      </div>

      <CaseStudy project={projects[0]} open={caseStudyOpen} onClose={() => setCaseStudyOpen(false)} />
    </section>
  )
}

/* ── Per-project identity glyphs — small technical marks, one each ── */

function ProjectGlyph({ id, className }: { id: string; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {id === 'haip' && (
        <>
          <path d="M12 3.5 19 8v8l-7 4.5L5 16V8l7-4.5Z" {...common} />
          <circle cx={12} cy={12} r={2.2} fill="currentColor" stroke="none" />
        </>
      )}
      {id === 'discovery' && (
        <>
          <path d="M4 7.5h13M7 12h13M4 16.5h13" {...common} />
        </>
      )}
      {id === 'reports' && (
        <>
          <path d="M5 19V13M10.5 19V8.5M16 19v-4M21 19V5.5" {...common} />
        </>
      )}
      {id === 'loan' && (
        <>
          <path d="M4 15a8 8 0 0 1 16 0" {...common} />
          <path d="M12 15l4.5-5" {...common} />
          <circle cx={12} cy={15} r={1.6} fill="currentColor" stroke="none" />
        </>
      )}
      {id === 'schemes' && (
        <>
          <path d="M4 12h5M9 12c4 0 3-5.5 7-5.5M9 12c4 0 3 5.5 7 5.5" {...common} />
          <circle cx={19} cy={6.5} r={1.5} fill="currentColor" stroke="none" />
          <circle cx={19} cy={17.5} r={1.5} fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  )
}

function ProjectCard({
  project,
  open,
  onToggle,
  onOpenCaseStudy,
}: {
  project: ProjectWithFlow
  open: boolean
  onToggle: () => void
  onOpenCaseStudy?: () => void
}) {
  const reducedMotion = usePrefersReducedMotion()
  const canHover = useMediaQuery('(hover: hover) and (min-width: 640px)')
  const [hoverP, setHoverP] = useState(0)

  // The row activates on hover (desktop) or when open.
  const lineActive = open || (canHover && hoverP > 0)

  return (
    <div
      onMouseEnter={() => setHoverP(1)}
      onMouseLeave={() => setHoverP(0)}
      className="relative transition-colors"
    >
      {/* High-contrast hover wash — left teal edge, background shift, visible ring */}
      <motion.span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] origin-top rounded-full bg-teal"
        initial={false}
        animate={{ scaleY: lineActive ? 1 : 0, opacity: lineActive ? 1 : 0 }}
        transition={{ duration: 0.35, ease }}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 rounded-xl transition-all duration-300 ${
          lineActive
            ? 'bg-paper-dim/70 shadow-[inset_0_0_0_1px_rgba(47,93,80,0.28),0_10px_26px_-20px_rgba(28,36,49,0.4)]'
            : 'bg-transparent shadow-none'
        }`}
      />

      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group relative z-10 flex w-full items-center gap-4 rounded-xl px-3 py-6 text-left transition-colors focus-visible:bg-paper-dim/60 sm:gap-8 sm:px-5"
      >
        {/* Number — slides up and is replaced by an arrow on hover */}
        <span className="relative hidden h-10 w-10 shrink-0 overflow-hidden sm:block" aria-hidden>
          <motion.span
            className="absolute inset-0 font-display text-2xl tabular-nums text-teal/70"
            initial={false}
            animate={reducedMotion ? undefined : { y: lineActive ? '-100%' : '0%' }}
            transition={{ duration: 0.35, ease }}
          >
            {project.index}
          </motion.span>
          <motion.span
            className="absolute inset-0 grid place-items-center text-teal"
            initial={false}
            animate={reducedMotion ? undefined : { y: lineActive ? '0%' : '100%' }}
            transition={{ duration: 0.35, ease }}
          >
            <ArrowRight size={20} />
          </motion.span>
        </span>
        <span className="font-display text-2xl tabular-nums text-teal/70 sm:hidden">{project.index}</span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <motion.span
              className="font-display text-xl text-ink underline-offset-4 transition decoration-teal/60 group-hover:text-teal-deep group-hover:underline sm:text-2xl"
              initial={false}
              animate={canHover && !reducedMotion ? { x: lineActive ? 4 : 0 } : undefined}
              transition={{ duration: 0.35, ease }}
            >
              {project.name}
            </motion.span>
            {project.links.some((l) => l.live) && (
              <span className="rounded-full bg-teal px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
                Live
              </span>
            )}
          </span>
          <span className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
            <ProjectGlyph id={project.id} className="h-4 w-4 shrink-0 text-teal/80" />
            {project.tagline} · {project.year}
          </span>

          {/* Architecture mini-flow — activates on hover/open, unique per project */}
          <FlowStrip project={project} active={lineActive} />
        </span>

        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease }} className="text-ink-soft">
          <ChevronDown size={20} aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="relative z-10 overflow-hidden"
          >
            <div className="grid gap-8 pb-10 pl-3 pr-3 sm:pl-[5.5rem] sm:pr-5 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">Problem</h3>
                <p className="mt-2 leading-relaxed text-ink">{project.problem}</p>

                <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">Stack</h3>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:bg-accent-soft hover:text-teal-deep hover:shadow-[0_6px_14px_-8px_rgba(47,93,80,0.5)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                {onOpenCaseStudy && (
                  <button
                    onClick={onOpenCaseStudy}
                    className="group/btn mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper shadow-[0_10px_24px_-12px_rgba(28,36,49,0.6)] transition hover:bg-teal hover:shadow-[0_12px_28px_-10px_rgba(47,93,80,0.55)]"
                  >
                    Read the full case study
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">Outcome</h3>
                <ul className="mt-2 space-y-1.5">
                  {project.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" aria-hidden />
                      {o}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
                        link.live
                          ? 'bg-teal text-paper shadow-[0_10px_22px_-12px_rgba(47,93,80,0.6)] hover:bg-teal-deep hover:shadow-[0_14px_26px_-12px_rgba(47,93,80,0.65)]'
                          : 'border border-ink/25 bg-paper text-ink hover:border-teal hover:bg-teal hover:text-paper hover:shadow-[0_10px_22px_-12px_rgba(47,93,80,0.55)]'
                      }`}
                    >
                      {link.live ? <ExternalLink size={14} aria-hidden /> : <Github size={14} aria-hidden />}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── FlowStrip — the project's real pipeline as a one-line diagram.
 * Nodes are the actual flow stages (content.ts), dots stream along
 * the connectors while the row is active. Pure presentation, hidden
 * on small screens. ─────────────────────────────────────────── */

const STRIP_W = 760
const STRIP_H = 44

function FlowStrip({ project, active }: { project: ProjectWithFlow; active: boolean }) {
  const reducedMotion = usePrefersReducedMotion()
  const stages = project.flow
  const pad = 46
  const step = (STRIP_W - pad * 2) / Math.max(stages.length - 1, 1)
  const y = STRIP_H / 2

  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={{ opacity: active ? 1 : 0, height: active ? STRIP_H : 0 }}
      transition={{ duration: 0.4, ease }}
      className="mt-2 block overflow-hidden"
    >
      <svg viewBox={`0 0 ${STRIP_W} ${STRIP_H}`} className="h-11 w-full max-w-2xl" role="presentation">
        {/* Connectors with streaming dashes */}
        {stages.slice(0, -1).map((_, i) => {
          const x1 = pad + i * step + 8
          const x2 = pad + (i + 1) * step - 8
          return (
            <g key={`c-${i}`}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="var(--color-teal)" strokeOpacity={0.25} strokeWidth={1.2} />
              {!reducedMotion && active && (
                <motion.line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="var(--color-teal)"
                  strokeWidth={1.6}
                  strokeDasharray="4 10"
                  initial={{ strokeDashoffset: 28 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
                />
              )}
            </g>
          )
        })}

        {/* Stage nodes + labels */}
        {stages.map((label, i) => {
          const x = pad + i * step
          return (
            <g key={`n-${i}`}>
              <circle cx={x} cy={y} r={4.2} fill="var(--color-paper)" stroke="var(--color-teal)" strokeWidth={1.4} />
              <circle cx={x} cy={y} r={1.7} fill="var(--color-teal)" />
              <text x={x} y={y + 16} textAnchor="middle" fill="#525F6E" style={{ fontSize: 8, fontWeight: 600 }}>
                {label.length > 20 ? `${label.slice(0, 19)}…` : label}
              </text>
            </g>
          )
        })}
      </svg>
    </motion.span>
  )
}

/* ── HAIP case study — dedicated detail view ──────────────── */

function CaseStudy({ project, open, onClose }: { project: ProjectWithFlow; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} — case study`}
        >
          <motion.article
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto max-w-3xl rounded-2xl border border-line bg-paper shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-line bg-paper/95 px-6 py-5 backdrop-blur sm:px-9">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Case study · {project.year}</p>
                <h2 className="mt-1.5 font-display text-2xl leading-tight text-ink sm:text-3xl">{project.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">{project.tagline}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close case study"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-paper"
              >
                <X size={17} aria-hidden />
              </button>
            </div>

            <div className="space-y-9 px-6 py-8 sm:px-9">
              {/* Architecture — animated flow diagram first, list as the accessible fallback */}
              <Block title="Architecture">
                <FlowDiagram project={project} />
                <ol className="mt-5 space-y-2.5">
                  {project.architecture.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                      <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-teal">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </Block>

              {/* Problem */}
              <Block title="Problem">
                <p className="leading-relaxed text-ink">{project.problem}</p>
              </Block>

              {/* Contribution */}
              {project.contribution && (
                <Block title="My contribution">
                  <p className="leading-relaxed text-ink">{project.contribution}</p>
                </Block>
              )}

              {/* Stack */}
              <Block title="Tech stack">
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line bg-paper-dim px-3.5 py-1.5 text-xs font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:bg-accent-soft hover:text-teal-deep"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Block>

              {/* Results — amber, proof only */}
              <Block title="Results">
                <ul className="space-y-2">
                  {project.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber" aria-hidden />
                      {o}
                    </li>
                  ))}
                </ul>
              </Block>

              {/* Links */}
              <div className="flex flex-wrap gap-3 border-t border-line pt-7">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 ${
                      link.live
                        ? 'bg-teal text-paper shadow-[0_10px_22px_-12px_rgba(47,93,80,0.6)] hover:bg-teal-deep'
                        : 'border border-ink/25 bg-paper text-ink hover:border-teal hover:bg-teal hover:text-paper'
                    }`}
                  >
                    {link.live ? <ExternalLink size={14} aria-hidden /> : <Github size={14} aria-hidden />}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Animated architecture diagram — nodes + flowing dots + arrows ── */

const FLOW_W = 720
const FLOW_H = 132

function FlowDiagram({ project }: { project: ProjectWithFlow }) {
  const reducedMotion = usePrefersReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const stages = project.flow
  const nodeW = 92
  const gap = (FLOW_W - stages.length * nodeW) / (stages.length + 1)
  const y = FLOW_H / 2

  const centers = stages.map((_, i) => gap + nodeW / 2 + i * (nodeW + gap))

  return (
    <div ref={wrapRef} className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
        className="h-auto w-full min-w-[560px]"
        role="img"
        aria-label={`Data flow: ${stages.join(' → ')}`}
      >
        <defs>
          <marker id="flow-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0.8 L7 4 L0 7.2" fill="none" stroke="#2F5D50" strokeWidth={1.3} strokeLinecap="round" />
          </marker>
        </defs>

        {/* Connecting segments — base + animated dash flow + arrowheads */}
        {centers.slice(0, -1).map((cx, i) => {
          const x1 = cx + nodeW / 2 + 3
          const x2 = centers[i + 1] - nodeW / 2 - 7
          return (
            <g key={`seg-${i}`}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#D8D2C4" strokeWidth={1.4} />
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="var(--color-teal)"
                strokeOpacity={0.5}
                strokeWidth={1.3}
                strokeDasharray="3 6"
                markerEnd="url(#flow-arrow)"
                opacity={inView ? 1 : 0}
              >
                {!reducedMotion && inView && (
                  <animate attributeName="stroke-dashoffset" from={9} to={0} dur="0.9s" repeatCount="indefinite" />
                )}
              </line>
              {/* Flow dots — three per segment, staggered */}
              {!reducedMotion && inView && (
                <>
                  {[0, 1, 2].map((d) => (
                    <motion.circle
                      key={`dot-${i}-${d}`}
                      r={2.2}
                      fill="var(--color-teal)"
                      initial={{ cx: x1, cy: y, opacity: 0 }}
                      animate={{ cx: [x1, x2], opacity: [0, 0.9, 0.9, 0] }}
                      transition={{
                        duration: 1.6,
                        delay: i * 0.35 + d * 0.5,
                        repeat: Infinity,
                        repeatDelay: (stages.length - 1) * 0.35 - 1 + d * 0,
                        ease: 'linear',
                        times: [0, 0.15, 0.85, 1],
                      }}
                    />
                  ))}
                </>
              )}
            </g>
          )
        })}

        {/* Stage nodes — numbered, stronger border */}
        {stages.map((label, i) => {
          const cx = centers[i]
          const drawDelay = 0.15 + i * 0.12
          return (
            <motion.g
              key={`n-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: drawDelay, ease }}
            >
              <rect
                x={cx - nodeW / 2}
                y={y - 21}
                width={nodeW}
                height={42}
                rx={10}
                fill="#F2EFE7"
                stroke="var(--color-teal)"
                strokeOpacity={0.55}
                strokeWidth={1.2}
              />
              <circle cx={cx - nodeW / 2 + 10} cy={y - 13} r={5.5} fill="var(--color-teal)" />
              <text
                x={cx - nodeW / 2 + 10}
                y={y - 10.6}
                textAnchor="middle"
                fill="#FAF8F3"
                style={{ fontSize: 7, fontWeight: 700 }}
              >
                {i + 1}
              </text>
              <text
                x={cx}
                y={y + 6}
                textAnchor="middle"
                fill="#1C2431"
                style={{ fontSize: 10.5, fontWeight: 600 }}
              >
                {wrapLabel(label, 16).map((line, li, arr) => (
                  <tspan key={li} x={cx} y={y + 6 + (li - (arr.length - 1) / 2) * 12}>
                    {line}
                  </tspan>
                ))}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

function wrapLabel(label: string, maxChars: number): string[] {
  if (label.length <= maxChars) return [label]
  const words = label.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const cand = cur ? `${cur} ${w}` : w
    if (cand.length <= maxChars) cur = cand
    else {
      if (cur) lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 2)
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}
