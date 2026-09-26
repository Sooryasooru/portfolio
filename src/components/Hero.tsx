import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { photos, profile } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import Magnetic from './Magnetic'

const ease = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

/** Proof metrics — evidence from shipped work, understated. */
const PROOF = [
  { value: 'RAGAS 80+', label: 'Grounded answers' },
  { value: '6', label: 'Services' },
  { value: 'Live', label: 'In production' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  return (
    <section ref={ref} id="top" className="hero-wash relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-24 pt-32 sm:px-6 lg:grid-cols-12 lg:gap-8">
        {/* ── LEFT — person, profession, work ─────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={reducedMotion ? undefined : { y: contentY }}
          className="relative z-10 lg:col-span-7"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal-mist/50 px-3 py-1 text-xs font-medium text-teal-deep"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            {profile.availability}
          </motion.p>

          {/* Identity first — the name is the h1 of the portfolio */}
          <motion.h1
            variants={item}
            className="mt-6 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl md:text-[4.2rem]"
          >
            Soorya T<span className="text-teal">.</span>
          </motion.h1>

          <motion.h2
            variants={item}
            className="mt-4 max-w-2xl font-display text-[1.9rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-[2.8rem]"
          >
            Turning data into <span className="text-teal">intelligent systems</span> that solve real-world problems.
          </motion.h2>

          <motion.p variants={item} className="mt-4 text-base font-medium text-ink-soft sm:text-lg">
            Data Scientist <span aria-hidden className="mx-1.5 text-teal">·</span> ML Engineer
            <span aria-hidden className="mx-1.5 text-teal">·</span> AI Engineer
          </motion.p>

          <motion.p variants={item} className="mt-5 max-w-xl leading-relaxed text-ink-soft">
            {profile.pitch}
          </motion.p>

          {/* Proof — quiet evidence from shipped work */}
          <motion.dl variants={item} className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {PROOF.map((m) => (
              <div key={m.value} className="border-l-2 border-amber/70 pl-3">
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-display text-lg font-semibold text-ink sm:text-xl">{m.value}</dd>
                <dd className="text-xs uppercase tracking-[0.12em] text-ink-soft">{m.label}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic strength={4}>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-teal"
              >
                View projects
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic strength={4}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:border-teal hover:bg-teal hover:text-paper"
              >
                Contact
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ── RIGHT — professional portrait, quietly alive ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="relative z-10 lg:col-span-5"
        >
          <PortraitNetwork />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.25em] text-ink-soft">Scroll</span>
        <motion.span
          animate={reducedMotion ? undefined : { scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="grid h-8 w-px origin-top place-items-start bg-ink/30"
        >
          <ArrowDown size={10} className="-ml-[4.5px] text-teal" />
        </motion.span>
      </motion.div>
    </section>
  )
}

/* ── Portrait + restrained data motif ──────────────────────────
 * The photo is the anchor. A thin Data → ML → AI → Systems spine,
 * a handful of small nodes and hairline connectors keep it personal
 * rather than product-y. Cursor influence is subtle — noticeable
 * only once you interact. Touch and reduced motion get it static.
 * ──────────────────────────────────────────────────────────────── */

const NET_W = 560
const NET_H = 680
const PHOTO = { x: 96, y: 84, w: 372, h: 500 }

interface NetNode {
  x: number
  y: number
  depth: 1 | -1 | 0.5
  tone: 'teal' | 'navy'
}

const NODES: NetNode[] = [
  { x: 150, y: 64, depth: 1, tone: 'teal' },
  { x: 330, y: 40, depth: -1, tone: 'navy' },
  { x: 486, y: 118, depth: 1, tone: 'teal' },
  { x: 516, y: 320, depth: -1, tone: 'navy' },
  { x: 452, y: 500, depth: 1, tone: 'teal' },
  { x: 250, y: 618, depth: -1, tone: 'navy' },
  { x: 72, y: 520, depth: 1, tone: 'teal' },
  { x: 40, y: 300, depth: 0.5, tone: 'teal' },
  { x: 66, y: 150, depth: 0.5, tone: 'navy' },
]

/** Data → ML → AI → Systems — a quiet spine along the right edge. */
const LANE = [
  { x: 486, y: 470, label: 'Data' },
  { x: 486, y: 372, label: 'ML' },
  { x: 486, y: 274, label: 'AI' },
  { x: 486, y: 176, label: 'Systems' },
]

function PortraitNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)')
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const interactive = !reducedMotion && !isTouch

  const onMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return
    if (raf.current) return
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    raf.current = requestAnimationFrame(() => {
      setMouse({ x: nx, y: ny })
      raf.current = 0
    })
  }

  const onMouseLeave = () => {
    if (!interactive) return
    setMouse({ x: 0, y: 0 })
  }

  // Gentle parallax — small amplitudes on purpose.
  const shift = (depth: number, amp: number) => ({
    x: mouse.x * depth * amp,
    y: mouse.y * depth * amp,
  })
  const frameShift = shift(1, 2)

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative mx-auto w-full max-w-[420px]"
    >
      <svg viewBox={`0 0 ${NET_W} ${NET_H}`} className="h-auto w-full">
        {/* Far nodes — drift faintly against the cursor */}
        {NODES.filter((n) => n.depth === -1).map((n, i) => {
          const s = shift(-1, 5)
          return <NetDot key={`f${i}`} x={n.x + s.x} y={n.y + s.y} r={2.6} tone={n.tone} delay={i * 0.12} />
        })}

        {/* Mid nodes */}
        {NODES.filter((n) => n.depth === 0.5).map((n, i) => {
          const s = shift(0.5, 4)
          return <NetDot key={`m${i}`} x={n.x + s.x} y={n.y + s.y} r={2} tone={n.tone} delay={0.3 + i * 0.1} />
        })}

        {/* Data → ML → AI → Systems spine */}
        <g>
          <path
            d={`M ${LANE[0].x} ${LANE[0].y} L ${LANE[LANE.length - 1].x} ${LANE[LANE.length - 1].y}`}
            stroke="var(--color-teal)"
            strokeOpacity={0.22}
            strokeWidth={1}
            strokeDasharray="2 6"
          />
          {LANE.map((n, i) => (
            <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.12, ease }}
              >
                <circle r={i === LANE.length - 1 ? 4.5 : 3.5} fill="var(--color-paper)" stroke="var(--color-teal)" strokeOpacity={0.7} strokeWidth={1.2} />
                <circle r={1.7} fill={i === LANE.length - 1 ? 'var(--color-amber)' : 'var(--color-teal)'} />
                <text x={12} y={3} fill="#8A94A1" style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '0.14em' }}>
                  {n.label.toUpperCase()}
                </text>
              </motion.g>
            </g>
          ))}
          {/* One small, slow pulse along the spine */}
          {!reducedMotion && !isTouch && (
            <motion.circle
              r={1.8}
              fill="var(--color-amber)"
              initial={{ cy: LANE[0].y, opacity: 0 }}
              animate={{ cy: [LANE[0].y, LANE[LANE.length - 1].y], opacity: [0, 0.6, 0.6, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'linear', times: [0, 0.12, 0.85, 1] }}
              cx={LANE[0].x}
            />
          )}
        </g>

        {/* Near nodes — hairline connectors to the photo, gentle follow */}
        {NODES.filter((n) => n.depth === 1).map((n, i) => {
          const s = shift(1, 8)
          const nx = n.x + s.x
          const ny = n.y + s.y
          const ax = Math.min(Math.max(nx, PHOTO.x), PHOTO.x + PHOTO.w)
          const ay = Math.min(Math.max(ny, PHOTO.y), PHOTO.y + PHOTO.h)
          return (
            <g key={`n${i}`}>
              <line x1={nx} y1={ny} x2={ax} y2={ay} stroke="var(--color-teal)" strokeOpacity={0.25} strokeWidth={0.9} />
              <NetDot x={nx} y={ny} r={3.2} tone={n.tone} delay={0.15 + i * 0.1} />
            </g>
          )
        })}

        {/* Photo — simple editorial frame */}
        <g transform={`translate(${frameShift.x} ${frameShift.y})`}>
          <foreignObject x={PHOTO.x} y={PHOTO.y} width={PHOTO.w} height={PHOTO.h}>
            <div className="hero-frame group relative h-full w-full overflow-hidden rounded-[14px] bg-paper-dim">
              <img
                src={photos.about.src}
                alt={photos.about.alt}
                width={650}
                height={664}
                decoding="async"
                className="portrait-img h-full w-full object-cover object-top"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent p-3.5 pt-10 opacity-0 transition-all duration-500 ease-out translate-y-1.5 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-display text-[13px] text-paper">{photos.about.caption}</span>
              </figcaption>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  )
}

/** A network node — outer plain <g> carries geometry, inner motion.g only fades in. */
function NetDot({ x, y, r, tone, delay = 0 }: { x: number; y: number; r: number; tone: 'teal' | 'navy'; delay?: number }) {
  const fill = tone === 'teal' ? 'var(--color-teal)' : '#1C2431'
  const halo = tone === 'teal' ? 'rgba(47, 93, 80, 0.1)' : 'rgba(28, 36, 49, 0.08)'
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay, ease }}>
      <circle cx={x} cy={y} r={r * 1.7} fill={halo} />
      <circle cx={x} cy={y} r={r} fill={fill} fillOpacity={0.8} />
    </motion.g>
  )
}
