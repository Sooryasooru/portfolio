import { ArrowLeft, Printer } from 'lucide-react'
import { profile, resumeData } from '../data/content'

export default function Resume() {
  return (
    <div className="min-h-screen bg-paper-dim py-6 print:bg-white print:py-0">
      {/* Toolbar — hidden when printing */}
      <div className="no-print mx-auto mb-6 flex max-w-[820px] items-center justify-between px-4">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-teal">
          <ArrowLeft size={15} aria-hidden /> Back to portfolio
        </a>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-teal-deep"
        >
          <Printer size={15} aria-hidden /> Save as PDF
        </button>
      </div>

      {/* A4 sheet — mirrors the official resume document */}
      <article className="resume-sheet mx-auto max-w-[820px] bg-white px-10 py-10 text-ink shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-14">
        <header>
          <h1 className="font-display text-[2.6rem] font-semibold uppercase tracking-[0.08em] leading-none">
            Soorya T
          </h1>
          <p className="mt-1.5 text-[13px] font-medium text-teal">
            Data Scientist | Machine Learning & AI Engineer
          </p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">
            {profile.email} | {profile.phone} | Ottapalam, Palakkad | {profile.linkedin.replace('https://', '')} |{' '}
            {profile.github.replace('https://', '')}
          </p>
        </header>

        <Section title="Summary">
          <p className="text-[12.5px] leading-relaxed text-ink">{resumeData.summary}</p>
        </Section>

        <Section title="Skills">
          <div className="space-y-1">
            {resumeData.skills.map((line) => (
              <p key={line} className="text-[12.5px] font-medium leading-relaxed text-ink-soft">
                {line}
              </p>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          {resumeData.projects.map((p) => (
            <div key={p.name} className="mt-3 first:mt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[13.5px] font-semibold">{p.name}</h3>
                <span className="text-[11px] text-ink-soft">{p.meta}</span>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink">{p.description}</p>
              <p className="mt-1 text-[11.5px] text-ink-soft">{p.stack}</p>
            </div>
          ))}
        </Section>

        <Section title="Education & Training">
          {resumeData.education.map((e) => (
            <div key={e.title} className="mt-3 first:mt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[13.5px] font-semibold">{e.title}</h3>
                <span className="text-[11px] text-ink-soft">{e.period}</span>
              </div>
              <p className="text-[11.5px] text-ink-soft">{e.org}</p>
              {e.bullets.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {e.bullets.map((b) => (
                    <li key={b.slice(0, 24)} className="flex gap-2 text-[12.5px] leading-relaxed text-ink">
                      <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-teal" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>

        <Section title="Certifications & Awards">
          <p className="text-[12.5px] leading-relaxed text-ink">{resumeData.certifications}</p>
        </Section>

        <Section title="Languages">
          <p className="text-[12.5px] text-ink-soft">{resumeData.languages}</p>
        </Section>
      </article>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 border-t border-line pt-3.5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}
