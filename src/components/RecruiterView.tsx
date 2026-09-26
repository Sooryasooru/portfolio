import { motion } from 'motion/react'
import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react'
import { profile, projects, roleFit } from '../data/content'

const ease = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

export default function RecruiterView() {
  const haip = projects[0]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:px-6">
      <motion.p variants={item} className="text-xs font-medium uppercase tracking-[0.22em] text-teal">
        60-second view — for the time-constrained
      </motion.p>

      <motion.h1 variants={item} className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
        {profile.name} — {profile.title}
      </motion.h1>

      <motion.p variants={item} className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
        {profile.niche}. Flagship work is <span className="font-medium text-ink">live in production</span> — not a demo reel.
      </motion.p>

      {/* Role fit matrix */}
      <motion.section variants={item} className="mt-12" aria-label="Role fit">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">What you're hiring for → evidence</h2>
        <dl className="mt-4 divide-y divide-line border-y border-line">
          {roleFit.map((r) => (
            <div key={r.need} className="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
              <dt className="font-medium text-ink sm:col-span-2">{r.need}</dt>
              <dd className="text-sm leading-relaxed text-ink-soft sm:col-span-3">{r.evidence}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      {/* Condensed flagship */}
      <motion.section variants={item} className="mt-10 rounded-2xl border border-line bg-paper-dim/60 p-6 md:p-8" aria-label="Flagship project">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl text-ink">{haip.shortName} — {haip.name}</h2>
          <span className="rounded-full bg-teal px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
            Live
          </span>
        </div>

        <p className="mt-3 leading-relaxed text-ink-soft">{haip.problem}</p>

        <ul className="mt-5 grid gap-2.5 text-sm text-ink sm:grid-cols-2">
          <li className="rounded-lg border border-line bg-paper p-3">
            <span className="font-medium text-amber-deep">RAGAS 80+</span> — two-stage retrieval: FAISS bi-encoder → cross-encoder re-rank
          </li>
          <li className="rounded-lg border border-line bg-paper p-3">
            <span className="font-medium text-amber-deep">6 services</span> — Docker microservices behind nginx, JWT auth, per-hospital isolation
          </li>
          <li className="rounded-lg border border-line bg-paper p-3">
            <span className="font-medium text-amber-deep">RF forecasting</span> — admissions prediction wired to a staffing plan
          </li>
          <li className="rounded-lg border border-line bg-paper p-3">
            <span className="font-medium text-amber-deep">CI/CD</span> — GitHub Actions → GHCR → EC2, zero manual deploys
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={haip.links.find((l) => l.live)?.href ?? haip.links[0].href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-medium text-paper transition hover:bg-teal-deep"
          >
            <ExternalLink size={14} aria-hidden /> Open the live platform
          </a>
          <a
            href={haip.links[haip.links.length - 1].href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-sm font-medium text-ink transition hover:border-teal hover:text-teal"
          >
            <Github size={14} aria-hidden /> GitHub
          </a>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section variants={item} className="mt-10" aria-label="Contact">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Next step</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-teal"
          >
            <Mail size={15} aria-hidden /> {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-teal hover:bg-teal hover:text-paper"
          >
            <Linkedin size={15} aria-hidden /> LinkedIn
          </a>
          <a
            href={`${import.meta.env.BASE_URL}soorya-t-resume.pdf`}
            className="rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-teal hover:bg-teal hover:text-paper"
          >
            Résumé (print → PDF)
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          {profile.availability} · Based in {profile.location} · {profile.phone}
        </p>
      </motion.section>
    </motion.div>
  )
}
