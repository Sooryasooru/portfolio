import { useState } from 'react'
import { motion } from 'motion/react'
import { Clock, Menu, X } from 'lucide-react'
import { profile } from '../data/content'

interface Props {
  recruiterMode: boolean
  onToggleRecruiter: () => void
}

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Header({ recruiterMode, onToggleRecruiter }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Soorya T — home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal font-display text-sm font-semibold text-paper">
            ST
          </span>
          <span className="hidden text-sm font-medium text-ink sm:block">{profile.name}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm text-ink-soft transition hover:text-ink"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-[2.5px] w-full origin-left scale-x-0 rounded-full bg-teal transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleRecruiter}
            aria-pressed={recruiterMode}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 sm:text-sm ${
              recruiterMode
                ? 'bg-teal text-paper shadow-[0_8px_20px_-8px_rgba(47,93,80,0.7)] ring-1 ring-teal-deep/40'
                : 'border border-teal/45 text-teal hover:border-teal hover:bg-teal hover:text-paper hover:shadow-[0_8px_20px_-8px_rgba(47,93,80,0.6)]'
            }`}
          >
            <Clock size={14} aria-hidden />
            {recruiterMode ? 'Exit recruiter mode' : 'Recruiter mode'}
            {recruiterMode && (
              <span aria-hidden className="relative ml-0.5 flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-paper" />
              </span>
            )}
          </button>

          <a
            href={`${import.meta.env.BASE_URL}soorya-t-resume.pdf`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-ink px-3.5 py-1.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-paper hover:shadow-[0_10px_22px_-12px_rgba(28,36,49,0.7)] sm:inline-block"
          >
            Résumé
          </a>

          <button
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-accent-soft hover:text-teal md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-paper px-5 py-4 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-ink-soft"
              >
                {item.label}
              </a>
            ))}
            <a href={`${import.meta.env.BASE_URL}soorya-t-resume.pdf`} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal">
              Résumé →
            </a>
          </div>
        </nav>
      )}
    </motion.header>
  )
}
