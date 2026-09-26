import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Copy, Github, Linkedin, Mail, Phone } from 'lucide-react'
import { profile } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import Magnetic from './Magnetic'
import SectionHeading from './SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  return (
    <section id="contact" className="section-pad relative overflow-hidden border-t border-line">
      {/* Minimal connection animation — two quiet arcs meeting at a node */}
      <svg
        aria-hidden
        viewBox="0 0 200 60"
        className="pointer-events-none absolute right-4 top-6 hidden h-14 w-56 opacity-70 lg:block"
      >
        <motion.path
          d="M 6 50 Q 70 44 100 30"
          fill="none"
          stroke="var(--color-teal)"
          strokeOpacity={0.45}
          strokeWidth={1.3}
          initial={reducedMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        />
        <motion.path
          d="M 194 10 Q 140 14 100 30"
          fill="none"
          stroke="var(--color-amber)"
          strokeOpacity={0.5}
          strokeWidth={1.3}
          initial={reducedMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25, ease }}
        />
        <circle cx={100} cy={30} r={3.2} fill="var(--color-teal)" />
        <circle cx={100} cy={30} r={7} fill="none" stroke="var(--color-teal)" strokeOpacity={0.35} />
      </svg>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <SectionHeading
            kicker="Contact"
            title="Hiring for an AI/ML role? Let's talk."
            description="I reply within a day. If the fit looks close, send a calendar link — I'll make time."
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="flex flex-col gap-3 md:items-end"
          >
            <Magnetic strength={4}>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2.5 rounded-lg px-1.5 py-0.5 text-lg font-medium text-ink transition-colors hover:text-teal"
              >
                <Mail
                  size={18}
                  className="text-teal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6"
                  aria-hidden
                />
                <span className="underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-teal/50">
                  {profile.email}
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={4}>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-teal"
              >
                <Phone
                  size={15}
                  className="text-teal transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden
                />
                {profile.phone}
              </a>
            </Magnetic>
            <Magnetic strength={3}>
              <button
                onClick={copyEmail}
                aria-live="polite"
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 md:w-auto ${
                  copied
                    ? 'border-teal bg-teal text-paper shadow-[0_8px_18px_-10px_rgba(47,93,80,0.7)]'
                    : 'border-line bg-paper-dim text-ink-soft hover:border-teal hover:bg-teal hover:text-paper'
                }`}
              >
                <motion.span animate={copied ? { scale: [1, 1.4, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
                  {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
                </motion.span>
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <Magnetic strength={3}>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/25 bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-paper hover:shadow-[0_12px_26px_-14px_rgba(47,93,80,0.6)]"
            >
              <Linkedin size={15} className="transition-transform duration-300 group-hover:scale-110" aria-hidden /> LinkedIn
            </a>
          </Magnetic>
          <Magnetic strength={3}>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/25 bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-paper hover:shadow-[0_12px_26px_-14px_rgba(47,93,80,0.6)]"
            >
              <Github size={15} className="transition-transform duration-300 group-hover:scale-110" aria-hidden /> GitHub
            </a>
          </Magnetic>
          <Magnetic strength={3}>
            <a
              href={`${import.meta.env.BASE_URL}soorya-t-resume.pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper shadow-[0_12px_26px_-14px_rgba(28,36,49,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal hover:shadow-[0_14px_28px_-12px_rgba(47,93,80,0.6)]"
            >
              Download résumé (PDF)
            </a>
          </Magnetic>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 text-sm text-ink-soft"
        >
          {profile.availability} · Based in {profile.location} · Remote-friendly
        </motion.p>
      </div>
    </section>
  )
}
