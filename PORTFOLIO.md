# Portfolio — Full Project Documentation

Complete record of everything built for the Soorya T portfolio, from first decisions to final state.

---

## 1. Foundation

| Decision | Outcome |
|---|---|
| Theme | Editorial light: paper `#FAF8F3`, ink `#1C2431`, clinical teal `#2F5D50`, amber `#C08A3E` reserved for proof metrics, line `#E4E0D4` |
| Stack | Vite · React 19 · TypeScript · Tailwind CSS v4 · `motion` (Framer Motion successor) · lucide-react · self-hosted Fraunces + Inter |
| 3D | React Three Fiber was installed initially, then **fully removed** — replaced with pure SVG graphics (bundle cut ~1 MB) |
| Router | None — SPA; `/resume` or `?view=resume` renders the resume; `?recruiter=1` opens recruiter mode |
| Content | `src/data/content.ts` is the single source of truth for site, resume and chat |
| Positioning | Healthcare niche removed from all copy (kept only as HAIP's project name); location: Ottapalam, Palakkad; phone: +91 7736163478 |

## 2. Page structure (final)

1. **Header** — ST monogram, nav with animated teal underline hover, Recruiter mode toggle, Résumé link, mobile menu.
2. **Hero** — availability chip; headline "I build machine-learning systems that hold up in production. Soorya T."; subtitle; pitch; amber proof line "RAGAS 80+ · 6-service platform · live in production"; View projects / Contact; faint watermark (2.2%); grid lines; washes; scroll hint. No photo.
3. **Evidence strip** — RAGAS 80+ · 6 microservices · 100% CI/CD automated deploys · 5+ projects.
4. **About** — no photo; two-paragraph narrative (diploma → Brototype Aug 2024 + Best Performer; full-pipeline work + HAIP live); education table; sticky credentials panel (HackerRank SQL Advanced, Best Performer Award, Languages, Currently).
5. **How I think** — 5-step pipeline spine: Frame the problem → Engineer the data → Model & evaluate honestly → Deploy like an engineer → Measure & iterate — each with a real project example.
6. **Skills** — SVG bubble map: amber core → 6 cluster bubbles (AI/ML, Data, ML Tools, Eng, Viz, Soft) → 35 skill bubbles sized by proficiency. Physics-packed (no overlaps), drift animation, cursor repulsion + glow, teal thread-lines to nearest bubbles, draggable with spring-back, click → evidence panel with bars + project citation.
7. **Projects** — flagship-first accordion. HAIP opens a dedicated **case-study modal** (Problem, My contribution, 6-step Architecture, Tech stack, Results, Live/GitHub). Others: Discovery (PySpark), Doctor's Report Analysis (RDD/SQL/DataFrame + Plotly), Loan Repayment Prediction (Logistic Regression + pytest CI), Schemes Recommender (NLP/Streamlit) — each with exact repo URLs.
8. **Beyond the Code** — single presentation photo with hover-reveal caption; "How I work" soft-skill cards (Communication, Ownership, Teamwork, Adaptability, Critical Thinking, Problem Solving).
9. **Contact** — email + copy button, phone tel link, LinkedIn, GitHub, résumé button, availability note.
10. **Footer** — stack credit.

## 3. Signature features

- **Recruiter mode** — header toggle + shareable `?recruiter=1`: role-fit matrix, condensed HAIP card with metric tiles, next-step contacts. Session-persisted.
- **RAG chat widget** — "Ask my resume": client-side TF-IDF retrieval over 15 knowledge chunks, streaming answers, "Grounded in" source chips, honest low-confidence fallback. Zero backend.
- **CursorField** — ambient fixed canvas: 46 drifting nodes, neighbor links, cursor links; disabled under reduced-motion; pauses on hidden tabs.
- **Resume page** (`/resume` / `?view=resume`) — verbatim official resume (summary, 6 skill lines, HAIP/Discovery/Schemes, education bullets, certifications, languages), A4 print styles, Save as PDF.
- **Case-study modal** — Esc/backdrop close, scroll lock, sticky header.
- **Accessibility** — aria labels, keyboard support, focus-visible rings, reduced-motion handling everywhere.

## 4. Skills data (35 skills, 6 clusters)

- **AI/ML**: Machine Learning 88 · Deep Learning 74 · NLP 80 · Generative AI 84 · RAG 90 · LLMs 84 · AI Agents 82
- **Data**: Python 92 · SQL 90 · Pandas 90 · NumPy 88 · Statistics 82 · PySpark 82
- **ML Tools**: Scikit-learn 88 · XGBoost 80 · Transformers 78 · FAISS 86 · LangChain 88 · LangGraph 80
- **Eng**: FastAPI 84 · Docker 88 · CI/CD 82 · Git 85 · AWS 76
- **Viz**: PostgreSQL 84 · BigQuery 76 · Streamlit 88 · Dash 84
- **Soft**: Problem Solving 86 · Communication 82 · Teamwork 84 · Ownership 90 · Adaptability 80 · Critical Thinking 82

Every technical skill cites the project where it was used (HAIP, Loan Prediction, Doctor's Report Analysis, etc.); soft skills cite Brototype or the DSA track.

## 5. Files

```
package.json · vite.config.ts · tsconfig{,.app,.node}.json · index.html
vercel.json · public/_redirects · public/favicon.svg · README.md
src/main.tsx · src/App.tsx · src/styles/index.css
src/data/content.ts          ← single source of truth
src/lib/retrieval.ts         ← TF-IDF retrieval engine
src/hooks/                   ← usePrefersReducedMotion, useRecruiterMode, useMediaQuery
src/components/              ← Header, Hero, Story, About, Thinking, Skills,
                               Projects, BeyondCode, Contact, Footer,
                               RecruiterView, CursorField, SectionHeading,
                               chat/ChatWidget
src/pages/Resume.tsx
public/images/               ← soorya-profile.png, soorya-1..4.png (only -2 in use)
```

## 6. Performance

- Initial JS ≈ 64 KB gzip + 42 KB motion vendor; Resume lazy-loaded
- No three.js, no image in the critical path, 2 self-hosted variable fonts
- Static output — deploys to Vercel (`vercel.json` rewrites) or Netlify (`public/_redirects`)

## 7. Verified

- Production build clean (tsc + vite), zero console errors in browser
- Recruiter mode round-trip, chat grounding (incl. new projects), bubble drag/click, case-study modal, hover states, mobile layouts — all tested live
- Honest-language pass: no hype phrasing; every claim maps to verifiable work

## 8. Remaining before launch (recommended)

1. Compress `public/images/*` PNGs to WebP (largest is ~2 MB)
2. `git init` + first commit
3. Deploy: Vercel import (framework: Vite) or Netlify (build `npm run build`, publish `dist`)
4. Custom domain + update the HAIP live-link metadata if desired
