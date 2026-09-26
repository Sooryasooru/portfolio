import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { skillClusters, type SkillCluster } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from './SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Skills as a bubble system — a small amber core, six cluster bubbles,
 * and every skill as a floating bubble sized by proficiency. Bubbles
 * drift on a slow sine loop; click any bubble and the panel explains.
 */
export default function Skills() {
  const [selectedId, setSelectedId] = useState('rag')
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const selected = skillClusters.find((c) => c.id === selectedId) ?? skillClusters[0]

  return (
    <section id="skills" className="section-pad border-t border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          kicker="Skills — as deployed"
          title="Every bubble is a skill, sized by depth and proven by work."
          description="Bubble size reflects depth. The panel lists each skill with the project where it was used."
        />

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="relative overflow-hidden rounded-2xl border border-line bg-paper-dim/50 p-2 lg:col-span-7"
          >
            <BubbleMap
              selectedId={selectedId}
              selectedSkill={selectedSkill}
              onSelectCluster={(id) => {
                setSelectedId(id)
                setSelectedSkill(null)
              }}
              onSelectSkill={(clusterId, skillName) => {
                setSelectedId(clusterId)
                setSelectedSkill(skillName)
              }}
              onHoverSkill={setHoveredSkill}
            />
          </motion.div>

          <div className="lg:col-span-5">
            <SkillPanel cluster={selected} highlight={selectedSkill ?? hoveredSkill} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Bubble geometry ──────────────────────────────────────── */

const SIZE = 760
const C = SIZE / 2
const CLUSTER_RING = 176
const CORE_R = 34

/** Short labels keep bubble text inside the circle; full names live in the panel + tooltip. */
const ABBR: Record<string, string> = {
  'Data Structures & Algorithms': 'DSA',
  'Model Evaluation & Tuning': 'Model Eval',
  'Feature Engineering': 'Feature Eng',
  'Fine-tuning & PEFT (LoRA)': 'LoRA / PEFT',
  'Time-Series Forecasting': 'Time-Series',
  'Spark MLlib & Streaming': 'Spark MLlib',
  'Kafka & Messaging': 'Kafka',
  'IaC & Monitoring': 'IaC & Ops',
  'Testing (pytest) & Quality': 'pytest & QA',
  'EDA & Data Cleaning': 'EDA & Clean',
  'Transformers / Hugging Face': 'HF Transf.',
  'CI/CD (GitHub Actions)': 'CI/CD',
  'Docker & Compose': 'Docker',
  'AWS (EC2 / SageMaker)': 'AWS',
  'ETL & Airflow': 'ETL·Airflow',
  'Data Warehousing': 'Warehouse',
  'Hypothesis Testing': 'Hypothesis',
  'Anomaly Detection': 'Anomaly Det.',
  'Linear Algebra (PCA / SVD)': 'PCA / SVD',
  'XGBoost & Ensembles': 'XGBoost',
  'Matplotlib & Plotly': 'MPL·Plotly',
  'Dash & Streamlit': 'Dash·St.lit',
  'Data Storytelling': 'Storytelling',
  'Sentence-Transformers': 'Sentence-Tr.',
  'Git & GitHub': 'Git',
  'Prompt Engineering': 'Prompting',
  'Pandas & NumPy': 'Pandas·NumPy',
}

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) }
}

const skillRadius = (level: number) => 23 + (level - 60) * 0.2

/** Greedy word-wrap that fits a name into ≤2 lines inside a bubble. */
function fitText(name: string, r: number): { lines: string[]; fontSize: number } {
  const clean = name.replace(' & ', ' & ')
  for (let fs = 9; fs >= 6.4; fs -= 0.4) {
    const maxChars = Math.floor((1.58 * r) / (0.56 * fs))
    const words = clean.split(' ')
    const lines: string[] = []
    let current = ''
    for (const w of words) {
      const candidate = current ? `${current} ${w}` : w
      if (candidate.length <= maxChars) current = candidate
      else {
        if (current) lines.push(current)
        current = w
      }
    }
    if (current) lines.push(current)
    if (lines.length <= 2 && lines.every((l) => l.length <= maxChars)) {
      return { lines, fontSize: Math.round(fs * 10) / 10 }
    }
  }
  return { lines: [clean], fontSize: 6.4 }
}

interface Placed {
  clusterId: string
  name: string
  level: number
  evidenceSource: string
  x: number
  y: number
  r: number
  clusterIndex: number
  skillIndex: number
}

function useBubbles() {
  return useMemo(() => {
    const clusters = skillClusters.map((c, i) => {
      const angle = i * (360 / skillClusters.length)
      const p = polar(CLUSTER_RING, angle)
      return { ...c, x: p.x, y: p.y, angle, index: i }
    })

    // Init each cluster's skills on a small ring around it.
    const skills: Placed[] = []
    for (const c of clusters) {
      const k = c.skills.length
      c.skills.forEach((s, si) => {
        const step = Math.min(38, 340 / k)
        const a = ((c.angle + (si - (k - 1) / 2) * step) * Math.PI) / 180
        const d = 108
        skills.push({
          clusterId: c.id,
          name: s.name,
          level: s.level,
          evidenceSource: s.evidenceSource,
          x: c.x + Math.cos(a) * d,
          y: c.y + Math.sin(a) * d,
          r: skillRadius(s.level),
          clusterIndex: c.index,
          skillIndex: si,
        })
      })
    }

    // Relaxation: GLOBAL pairwise separation (no cross-cluster piles),
    // spring toward own cluster, off the core, inside the canvas.
    for (let iter = 0; iter < 160; iter++) {
      // Skill ↔ skill separation (all pairs)
      for (let i = 0; i < skills.length; i++) {
        for (let j = i + 1; j < skills.length; j++) {
          const a = skills[i]
          const b = skills[j]
          let dx = b.x - a.x
          let dy = b.y - a.y
          let dist = Math.hypot(dx, dy)
          const min = a.r + b.r + 6
          if (dist < 0.01) {
            dx = 1
            dy = 0
            dist = 0.01
          }
          if (dist < min) {
            const push = ((min - dist) / 2) * 0.9
            const ux = dx / dist
            const uy = dy / dist
            a.x -= ux * push
            a.y -= uy * push
            b.x += ux * push
            b.y += uy * push
          }
        }
      }
      // Cluster ↔ skill separation
      for (const c of clusters) {
        for (const s of skills) {
          const dx = s.x - c.x
          const dy = s.y - c.y
          const dist = Math.hypot(dx, dy) || 0.01
          const min = 52 + s.r + 6
          if (dist < min) {
            const push = min - dist
            s.x += (dx / dist) * push
            s.y += (dy / dist) * push
          }
        }
      }
      // Springs + bounds
      for (const s of skills) {
        const c = clusters.find((cl) => cl.id === s.clusterId)!
        const dx = s.x - c.x
        const dy = s.y - c.y
        const d = Math.hypot(dx, dy) || 0.01
        const target = Math.min(Math.max(d, 100), 165)
        s.x = c.x + (dx / d) * (d + (target - d) * 0.1)
        s.y = c.y + (dy / d) * (d + (target - d) * 0.1)

        const cdx = s.x - C
        const cdy = s.y - C
        const cd = Math.hypot(cdx, cdy) || 0.01
        const minCore = CORE_R + 12 + s.r
        if (cd < minCore) {
          s.x = C + (cdx / cd) * minCore
          s.y = C + (cdy / cd) * minCore
        }
        const maxR = C - 6 - s.r
        if (cd > maxR) {
          s.x = C + (cdx / cd) * maxR
          s.y = C + (cdy / cd) * maxR
        }
      }
    }
    return { clusters, skills }
  }, [])
}

const INK = '#1C2431'
const TEAL = '#2F5D50'
const AMBER = '#C08A3E'

function BubbleMap({
  selectedId,
  selectedSkill,
  onSelectCluster,
  onSelectSkill,
  onHoverSkill,
}: {
  selectedId: string
  selectedSkill: string | null
  onSelectCluster: (id: string) => void
  onSelectSkill: (clusterId: string, skill: string) => void
  onHoverSkill: (skill: string | null) => void
}) {
  const { clusters, skills } = useBubbles()
  const svgRef = useRef<SVGSVGElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [hoverCluster, setHoverCluster] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<Record<string, { dx: number; dy: number }>>({})
  const dragState = useRef<{ id: string; startX: number; startY: number } | null>(null)
  const springRaf = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const [inView, setInView] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Gate the entrance choreography on the map actually being seen.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), {
      threshold: 0.25,
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const focusCluster = hoverCluster ?? selectedId
  // When a cluster is hovered, its skills come forward and others recede.
  const dimmed = (clusterId: string) =>
    hoverCluster !== null && clusterId !== hoverCluster

  const onMove = (e: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    setCursor({
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    })
  }

  /** Drag a bubble: follows the pointer, springs back on release. */
  const startDrag = (id: string) => (e: React.PointerEvent) => {
    e.preventDefault()
    dragState.current = { id, startX: e.clientX, startY: e.clientY }
    const move = (ev: PointerEvent) => {
      const st = dragState.current
      if (!st) return
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const scaleX = SIZE / rect.width
      const scaleY = SIZE / rect.height
      setDragOffset((prev) => ({
        ...prev,
        [st.id]: { dx: (ev.clientX - st.startX) * scaleX, dy: (ev.clientY - st.startY) * scaleY },
      }))
    }
    const up = () => {
      const st = dragState.current
      dragState.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (!st) return
      // Spring back to rest
      const decay = () => {
        let settled = true
        setDragOffset((prev) => {
          const o = prev[st.id]
          if (!o || (Math.abs(o.dx) < 0.5 && Math.abs(o.dy) < 0.5)) {
            const next = { ...prev }
            delete next[st.id]
            return next
          }
          settled = false
          return { ...prev, [st.id]: { dx: o.dx * 0.82, dy: o.dy * 0.82 } }
        })
        if (!settled) springRaf.current = requestAnimationFrame(decay)
      }
      springRaf.current = requestAnimationFrame(decay)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  /** Cursor influence: gentle displacement + highlight radius, per bubble. */
  const influence = (x: number, y: number, r: number) => {
    if (!cursor) return { dx: 0, dy: 0, glow: 0 }
    const dx = x - cursor.x
    const dy = y - cursor.y
    const d = Math.hypot(dx, dy)
    const range = r + 90
    if (d > range || d < 0.01) return { dx: 0, dy: 0, glow: 0 }
    const f = 1 - d / range
    return { dx: (dx / d) * f * 14, dy: (dy / d) * f * 14, glow: f }
  }

  return (
    <div ref={wrapRef} className="relative">
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full select-none"
      role="img"
      aria-label="Skill knowledge graph — hover to explore, click a cluster or skill for evidence"
      onMouseMove={onMove}
      onMouseLeave={() => setCursor(null)}
    >
      <defs>
        <radialGradient id="cluster-sheen" cx="0.5" cy="0.25" r="0.8">
          <stop offset="0%" stopColor="#FAF8F3" stopOpacity={0.32} />
          <stop offset="55%" stopColor="#FAF8F3" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#FAF8F3" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="core-sheen" cx="0.5" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#FAF8F3" stopOpacity={0.3} />
          <stop offset="60%" stopColor="#FAF8F3" stopOpacity={0} />
        </radialGradient>
        <filter id="bubble-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1C2431" floodOpacity="0.14" />
        </filter>
      </defs>
      {/* Soft connector: core → clusters */}
      {clusters.map((c) => {
        const active = selectedId === c.id
        const hovered = focusCluster === c.id
        return (
          <motion.line
            key={`l-${c.id}`}
            x1={C}
            y1={C}
            x2={c.x}
            y2={c.y}
            stroke={active || hovered ? TEAL : INK}
            strokeOpacity={active ? 0.55 : hovered ? 0.4 : hoverCluster !== null ? 0.05 : 0.14}
            strokeWidth={active || hovered ? 2 : 1.1}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 + c.index * 0.07, ease }}
          />
        )
      })}

      {/* Soft connector: cluster → its skill bubbles */}
      {skills.map((s) => {
        const c = clusters.find((cl) => cl.id === s.clusterId)!
        const active = selectedId === s.clusterId
        const hovered = focusCluster === s.clusterId
        const mx = (c.x + s.x) / 2 + (s.y - c.y) * 0.12
        const my = (c.y + s.y) / 2 - (s.x - c.x) * 0.12
        return (
          <motion.path
            key={`p-${s.clusterId}-${s.name}`}
            d={`M ${c.x} ${c.y} Q ${mx} ${my} ${s.x} ${s.y}`}
            fill="none"
            stroke={active || hovered ? TEAL : INK}
            strokeOpacity={hovered ? 0.45 : active ? 0.38 : hoverCluster !== null ? 0.05 : 0.16}
            strokeWidth={hovered ? 1.5 : active ? 1.3 : 1}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 + s.skillIndex * 0.04, ease }}
          />
        )
      })}

      {/* Cursor thread lines — faint teal links from cursor to nearest bubbles */}
      {cursor && (
        <g aria-hidden>
          {skills
            .map((s) => ({ s, d: Math.hypot(s.x - cursor.x, s.y - cursor.y) }))
            .sort((a, b) => a.d - b.d)
            .slice(0, 4)
            .filter(({ d }) => d < 220)
            .map(({ s, d }) => (
              <line
                key={`t-${s.clusterId}-${s.name}`}
                x1={cursor.x}
                y1={cursor.y}
                x2={s.x}
                y2={s.y}
                stroke={TEAL}
                strokeOpacity={0.22 * (1 - d / 220)}
                strokeWidth={1}
              />
            ))}
        </g>
      )}

      {/* Core */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
      >
        <circle cx={C} cy={C} r={34} fill={AMBER} />
        <circle cx={C} cy={C} r={34} fill="url(#core-sheen)" />
        <circle cx={C} cy={C} r={41} fill="none" stroke={AMBER} strokeOpacity={0.4} strokeWidth={1.5} />
        <circle cx={C} cy={C} r={49} fill="none" stroke={AMBER} strokeOpacity={0.18} strokeWidth={1} strokeDasharray="2 6" className="spin-slow" style={{ transformOrigin: `${C}px ${C}px` }} />
        <text x={C} y={C + 3.5} textAnchor="middle" className="fill-paper font-semibold" style={{ fontSize: 11 }}>
          Soorya
        </text>
      </motion.g>

      {/* Cluster bubbles */}
      {clusters.map((c, i) => {
        const active = selectedId === c.id
        const hovered = hoverCluster === c.id
        const faded = hoverCluster !== null && !hovered
        return (
          <motion.g
            key={`c-${c.id}`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease }}
            onClick={() => onSelectCluster(c.id)}
            onMouseEnter={() => setHoverCluster(c.id)}
            onMouseLeave={() => setHoverCluster(null)}
            onFocus={() => setHoverCluster(c.id)}
            onBlur={() => setHoverCluster(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectCluster(c.id)
              }
            }}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`${c.name} — ${c.skills.length} skills. Activate to list them.`}
          >
            <motion.g
              animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {(() => {
                const inf = influence(c.x, c.y, 50)
                return (
                  <>
                    <circle
                      cx={c.x + inf.dx}
                      cy={c.y + inf.dy}
                      r={active ? 52 : hovered ? 51 : 47}
                      fill={active ? TEAL : INK}
                      fillOpacity={hovered && !active ? 0.9 : 1}
                      opacity={(1 - inf.glow * 0.08) * (faded ? 0.3 : 1)}
                      className="transition-all duration-300"
                    />
                    {(() => {
                      const r = active ? 52 : hovered ? 51 : 47
                      return (
                        <circle
                          cx={c.x + inf.dx}
                          cy={c.y + inf.dy - r * 0.3}
                          r={r * 0.75}
                          fill="url(#cluster-sheen)"
                          opacity={0.5}
                          pointerEvents="none"
                        />
                      )
                    })()}
                    <circle
                      cx={c.x + inf.dx}
                      cy={c.y + inf.dy}
                      r={active ? 60 : hovered ? 58 : 54}
                      fill="none"
                      stroke={active || hovered ? TEAL : 'transparent'}
                      strokeOpacity={active ? 0.6 : 0.5}
                      strokeWidth={1.5}
                      className="transition-all duration-300"
                    />
                    {(active || hovered) && !reducedMotion && (
                      <circle
                        cx={c.x + inf.dx}
                        cy={c.y + inf.dy}
                        r={active ? 67 : 65}
                        fill="none"
                        stroke={TEAL}
                        strokeOpacity={0.4}
                        strokeWidth={1}
                        strokeDasharray="3 7"
                        className="spin-slow"
                        style={{ transformOrigin: `${c.x + inf.dx}px ${c.y + inf.dy}px` }}
                      />
                    )}
                  </>
                )
              })()}
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                className="pointer-events-none fill-paper font-semibold"
                style={{ fontSize: 13 }}
              >
                {c.short}
              </text>
            </motion.g>
          </motion.g>
        )
      })}

      {/* Skill bubbles */}
      {skills.map((s, i) => {
        const hot = selectedSkill === s.name
        const isDimmed = dimmed(s.clusterId)
        const inFocusedCluster = focusCluster === s.clusterId
        const fill = hot ? TEAL : inFocusedCluster ? '#DCE7E1' : '#FAF8F3'
        const stroke = hot ? TEAL : inFocusedCluster ? 'rgba(47,93,80,0.55)' : '#C9C2B0'
        const textFill = hot ? '#FAF8F3' : inFocusedCluster ? '#23463C' : '#44505E'
        const fit = fitText(ABBR[s.name] ?? s.name, s.r)
        return (
          <motion.g
            key={`s-${s.clusterId}-${s.name}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: isDimmed ? 0.3 : 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: inView ? 0.15 + i * 0.02 : 0, ease }}
            onClick={() => onSelectSkill(s.clusterId, s.name)}
            onPointerDown={startDrag(`${s.clusterId}-${s.name}`)}
            onMouseEnter={() => onHoverSkill(s.name)}
            onMouseLeave={() => onHoverSkill(null)}
            onFocus={() => onHoverSkill(s.name)}
            onBlur={() => onHoverSkill(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectSkill(s.clusterId, s.name)
              }
            }}
            style={{ cursor: 'grab' }}
            role="button"
            tabIndex={0}
            aria-label={`${s.name} — proficiency ${s.level}% — used in ${s.evidenceSource ?? 'shipped work'}`}
          >            <motion.g
              animate={reducedMotion ? undefined : { y: [0, -3.5, 0] }}
              transition={{ duration: 4.2 + (i % 6) * 0.45, repeat: Infinity, ease: 'easeInOut' }}
            >              {(() => {
                const inf = influence(s.x, s.y, s.r)
                const drag = dragOffset[`${s.clusterId}-${s.name}`] ?? { dx: 0, dy: 0 }
                const bx = s.x + inf.dx + drag.dx
                const by = s.y + inf.dy + drag.dy
                const hoveredNow = inf.glow > 0.35
                const engaged = hot || hoveredNow
                // Proficiency ring — arc length is the actual level, 0–100.
                const ringR = s.r + 4.5
                const ringCirc = 2 * Math.PI * ringR
                return (
                  <>
                    <circle
                      cx={bx}
                      cy={by}
                      r={s.r + inf.glow * 3}
                      fill={fill}
                      stroke={engaged ? TEAL : stroke}
                      strokeWidth={hot ? 2 : engaged ? 1.8 : 1.4}
                      opacity={isDimmed ? 0.35 : 1}
                      filter={engaged || inFocusedCluster ? 'url(#bubble-shadow)' : undefined}
                      className="transition-all duration-300"
                    />
                    {engaged && (
                      <circle
                        cx={bx}
                        cy={by}
                        r={ringR}
                        fill="none"
                        stroke={hot ? AMBER : TEAL}
                        strokeOpacity={hot ? 0.95 : 0.8}
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeDasharray={`${(s.level / 100) * ringCirc} ${ringCirc}`}
                        transform={`rotate(-90 ${bx} ${by})`}
                        pointerEvents="none"
                      />
                    )}
                    <text
                      x={bx}
                      y={by}
                      textAnchor="middle"
                      pointerEvents="none"
                      fill={textFill}
                      fontWeight={hot ? 700 : 500}
                      style={{ fontSize: fit.fontSize }}
                    >
                      {fit.lines.map((line, li) => (
                        <tspan
                          key={li}
                          x={bx}
                          y={by + 3 + (li - (fit.lines.length - 1) / 2) * (fit.fontSize + 1.5)}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </>
                )
  })()}
              <title>{`${s.name} — ${s.level}%`}</title>
            </motion.g>
          </motion.g>
        )
      })}
    </svg>
    </div>
  )
}

/* ── Detail panel ─────────────────────────────────────────── */

function SkillPanel({ cluster, highlight }: { cluster: SkillCluster; highlight: string | null }) {
  const listRef = useRef<HTMLUListElement>(null)

  // Bring the highlighted skill into view — hover in the map, detail in the panel.
  useEffect(() => {
    if (!highlight) return
    const el = listRef.current?.querySelector(`[data-skill="${CSS.escape(highlight)}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [highlight])

  return (
    <motion.div
      key={cluster.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6 md:p-7"
      aria-live="polite"
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal">{cluster.name}</p>

      <ul ref={listRef} className="chat-scroll mt-6 flex-1 space-y-5 overflow-y-auto pr-1 max-h-[560px]">
        {cluster.skills.map((skill, i) => {
          const hot = highlight === skill.name
          return (
            <motion.li
              key={skill.name}
              data-skill={skill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundColor: hot ? 'rgba(232, 239, 234, 0.9)' : 'rgba(0,0,0,0)',
              }}
              transition={{ duration: 0.4, delay: hot ? 0 : 0.05 + i * 0.06, ease }}
              className={`-m-2 rounded-lg p-2 ${hot ? 'ring-1 ring-teal/40' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-ink">{skill.name}</span>
                <span className="text-xs tabular-nums text-ink-soft">{skill.level}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease }}
                  className="h-full rounded-full bg-teal"
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {skill.evidence}{' '}
                <span className="whitespace-nowrap text-xs font-medium text-teal-deep">— {skill.evidenceSource}</span>
              </p>
            </motion.li>
          )
        })}
      </ul>
    </motion.div>
  )
}
