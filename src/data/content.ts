// ─────────────────────────────────────────────────────────────
// Single source of truth. The site, the /resume page and the
// RAG chat widget all read from this module.
// ─────────────────────────────────────────────────────────────

export interface SocialLink {
  label: string
  href: string
}

export interface Skill {
  name: string
  /** Self-assessed proficiency, 0–100 */
  level: number
  /** One line of real evidence — a shipped project or the training program */
  evidence: string
  evidenceSource: string
}

export interface SkillCluster {
  id: string
  name: string
  short: string
  skills: Skill[]
}

export interface ProjectLink {
  label: string
  href: string
  live?: boolean
}

/** Short, real stage labels for the animated architecture diagram —
 *  every entry is condensed from the project's own `architecture`. */
export interface ProjectWithFlow extends Project {
  flow: string[]
}

export interface Project {
  id: string
  index: string
  name: string
  shortName: string
  tagline: string
  year: string
  problem: string
  contribution?: string
  architecture: string[]
  stack: string[]
  outcomes: string[]
  links: ProjectLink[]
}

export const profile = {
  name: 'Soorya T',
  title: 'Data Scientist · ML Engineer · AI Engineer',
  niche: 'End-to-end ML systems — data, models, RAG applications, deployment',
  pitch:
    'I build data, machine learning, and AI solutions — from analysis and modeling to production-ready applications.',
  proofLine: 'RAGAS 80+ · 6-service platform · live in production',
  availability: 'Open to roles — India · UAE · Europe',
  email: 'sooryat101@gmail.com',
  phone: '+91 7736163478',
  linkedin: 'https://linkedin.com/in/sooryat101',
  github: 'https://github.com/Sooryasooru',
  location: 'Ottapalam, Palakkad, India',
} as const

// ─────────────────────────────────────────────────────────────
// Photos — the formal portrait anchors the Hero; the candid one
// humanizes Beyond the Code.
// ─────────────────────────────────────────────────────────────

export const photos = {
  about: {
    src: '/images/soorya-about.png',
    alt: 'Soorya T at her development workstation, mid-build',
    caption: 'At the workstation',
  },
  candid: {
    src: '/images/soorya-candid.png',
    alt: 'Soorya T smiling during a break between build sessions',
    caption: 'Between build sessions',
  },
} as const

export const softSkills = [
  {
    name: 'Communication',
    icon: 'message',
    detail: 'Comfortable presenting technical work to non-technical rooms — from project demos to research talks.',
  },
  {
    name: 'Ownership',
    icon: 'target',
    detail: 'Took HAIP from empty repo to live domain end to end. I ship my own work, not handoffs.',
  },
  {
    name: 'Teamwork',
    icon: 'users',
    detail: 'Peer-review driven training culture — code reviews, pair debugging, shared wins.',
  },
  {
    name: 'Adaptability',
    icon: 'refresh',
    detail: 'Weekly demo cadence at Brototype: ship small, collect feedback, iterate fast.',
  },
  {
    name: 'Critical Thinking',
    icon: 'compass',
    detail: 'Baselines before complexity, evidence before claims — every model earns its place.',
  },
  {
    name: 'Problem Solving',
    icon: 'puzzle',
    detail: 'DSA-trained: break it down, pick the data structure, prove the complexity, then code.',
  },
] as const

export const about = {
  narrative: [
    'I completed a diploma in Computer Engineering, then joined the Data Scientist track at Brototype, Kochi, in August 2024. The program runs on production-style projects rather than coursework; I currently hold its Best Performer award for project week.',
    'My work covers the full pipeline: cleaning and validating data, building and evaluating models honestly, and deploying them as services with CI/CD. My capstone, HAIP — a six-service analytics platform with a two-stage RAG chatbot — runs on a live domain behind an automated deployment pipeline.',
  ],
  credentials: [
    { label: 'HackerRank SQL — Advanced', detail: 'certified' },
    { label: 'Best Performer Award', detail: 'Brototype' },
  ],
  education: [
    {
      period: 'Aug 2024 → 2026',
      title: 'Data Scientist track — Brototype, Kochi',
      detail: 'Production-oriented training across the full ML lifecycle: data engineering, statistics, classical ML, deep learning, NLP, big data (PySpark) and LLM application development. Best Performer Award.',
    },
    {
      period: '2021 → 2024',
      title: 'Diploma in Computer Engineering',
      detail: 'IPT and GPTC, Shoranur — State Board of Technical Education and Training, Kerala.',
    },
  ],
  languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
} as const

// ─────────────────────────────────────────────────────────────
// Skills — structured around the Brototype Data Science curriculum,
// every entry backed by shipped projects or the training program.
// ─────────────────────────────────────────────────────────────

export const skillClusters: SkillCluster[] = [
  {
    id: 'aiml',
    name: 'AI & Machine Learning',
    short: 'AI/ML',
    skills: [
      {
        name: 'Machine Learning',
        level: 88,
        evidence: 'Random Forest admissions forecast and a loan-default classifier — trained, evaluated, deployed.',
        evidenceSource: 'HAIP + Loan Prediction',
      },
      {
        name: 'Deep Learning',
        level: 74,
        evidence: 'CNN/RNN fundamentals; encoder fine-tuning experiments for medical QA.',
        evidenceSource: 'Brototype training',
      },
      {
        name: 'NLP',
        level: 80,
        evidence: 'Scheme-matching engine and document chunking pipelines in production projects.',
        evidenceSource: 'Schemes Recommender + HAIP',
      },
      {
        name: 'Generative AI',
        level: 84,
        evidence: 'Grounded generation over Gemini/Groq with controlled prompting in HAIP.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'RAG',
        level: 90,
        evidence: 'Two-stage retrieval — FAISS bi-encoder + cross-encoder re-ranker, scored RAGAS 80+.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'LLMs',
        level: 84,
        evidence: 'LLM application layer over Gemini/Groq; Hugging Face fine-tuning experiments.',
        evidenceSource: 'HAIP + training',
      },
      {
        name: 'AI Agents',
        level: 82,
        evidence: 'LangGraph tool-calling agent routing between analytics and retrieval endpoints.',
        evidenceSource: 'HAIP',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data Foundations',
    short: 'Data',
    skills: [
      {
        name: 'Python',
        level: 92,
        evidence: 'Primary language across every service in HAIP — FastAPI, ETL, model and RAG layers.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'SQL',
        level: 90,
        evidence: 'Advanced-certified; analytics queries, joins and window logic over production data.',
        evidenceSource: 'HAIP + HackerRank Advanced',
      },
      {
        name: 'Pandas',
        level: 90,
        evidence: 'Daily driver — wrangling, grouping, merging and reshaping on every dataset I touch.',
        evidenceSource: 'All projects',
      },
      {
        name: 'NumPy',
        level: 88,
        evidence: 'Vectorized computation under every model and metric I build.',
        evidenceSource: 'All projects',
      },
      {
        name: 'Statistics',
        level: 82,
        evidence: 'Hypothesis testing, distributions and EDA discipline before any modeling.',
        evidenceSource: 'Brototype training',
      },
      {
        name: 'PySpark',
        level: 82,
        evidence: 'RDD, Spark SQL and DataFrame layers built for the medical-reports analytics pipeline.',
        evidenceSource: "Doctor's Report Analysis",
      },
    ],
  },
  {
    id: 'tools',
    name: 'ML Tooling',
    short: 'ML Tools',
    skills: [
      {
        name: 'Scikit-learn',
        level: 88,
        evidence: 'Classification/regression pipelines and evaluation harnesses; loan-default predictor shipped with tests.',
        evidenceSource: 'Loan Prediction',
      },
      {
        name: 'XGBoost',
        level: 80,
        evidence: 'Gradient-boosted baselines for admissions demand curves.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'Transformers',
        level: 78,
        evidence: 'Hugging Face encoder fine-tuning experiments for medical QA.',
        evidenceSource: 'Brototype training',
      },
      {
        name: 'FAISS',
        level: 86,
        evidence: 'Bi-encoder vector index — first stage of the two-stage retrieval pipeline.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'LangChain',
        level: 88,
        evidence: 'Document loaders, chunking and retrieval chains for the HAIP document bot.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'LangGraph',
        level: 80,
        evidence: 'Tool-calling agent that routes between analytics endpoints and retrieval.',
        evidenceSource: 'HAIP',
      },
    ],
  },
  {
    id: 'eng',
    name: 'Engineering & Cloud',
    short: 'Eng',
    skills: [
      {
        name: 'FastAPI',
        level: 84,
        evidence: 'Service layer for HAIP — async endpoints behind JWT auth.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'Docker',
        level: 88,
        evidence: 'Six containerized microservices in HAIP with per-service images.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'CI/CD',
        level: 82,
        evidence: 'HAIP: GHCR → EC2 automation. Loan project: pytest + pylint + black gates on every push.',
        evidenceSource: 'HAIP + Loan Prediction',
      },
      {
        name: 'Git',
        level: 85,
        evidence: 'Branching workflows, PRs and merge-conflict resolution across all project repos.',
        evidenceSource: 'All projects',
      },
      {
        name: 'AWS',
        level: 76,
        evidence: 'HAIP runs live on EC2; SageMaker deployment configuration in training.',
        evidenceSource: 'HAIP + training',
      },
    ],
  },
  {
    id: 'dataviz',
    name: 'Data Platforms & Visualization',
    short: 'Viz',
    skills: [
      {
        name: 'PostgreSQL',
        level: 84,
        evidence: 'Relational store with per-hospital isolation in HAIP; procedures, triggers, query tuning.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'BigQuery',
        level: 76,
        evidence: 'Warehouse layer for the PySpark discovery pipeline.',
        evidenceSource: 'Hospital Discovery Platform',
      },
      {
        name: 'Streamlit',
        level: 88,
        evidence: 'Role-based analytics app in HAIP; dashboard UI for the reports pipeline.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'Dash',
        level: 84,
        evidence: 'Interactive KPI dashboards over validated data with filters.',
        evidenceSource: 'HAIP',
      },
    ],
  },
  {
    id: 'soft',
    name: 'Professional Skills',
    short: 'Soft',
    skills: [
      {
        name: 'Problem Solving',
        level: 86,
        evidence: 'DSA-trained decomposition — break down, prove complexity, then implement.',
        evidenceSource: 'DSA track',
      },
      {
        name: 'Communication',
        level: 82,
        evidence: 'Project demos and research talks aimed at non-technical rooms.',
        evidenceSource: 'Brototype',
      },
      {
        name: 'Teamwork',
        level: 84,
        evidence: 'Peer-review culture — code reviews, pair debugging, shared wins.',
        evidenceSource: 'Brototype',
      },
      {
        name: 'Ownership',
        level: 90,
        evidence: 'HAIP from empty repo to live domain, end to end, solo-led.',
        evidenceSource: 'HAIP',
      },
      {
        name: 'Adaptability',
        level: 80,
        evidence: 'Weekly demo cadence: ship small, absorb feedback, iterate fast.',
        evidenceSource: 'Brototype',
      },
      {
        name: 'Critical Thinking',
        level: 82,
        evidence: 'Baselines before complexity, evidence before claims.',
        evidenceSource: 'All projects',
      },
    ],
  },
]

export const projects: ProjectWithFlow[] = [
  {
    id: 'haip',
    index: '01',
    flow: ['Hospital data', 'ETL & KPIs', 'Forecasting model', 'Two-stage RAG', 'LangGraph agent', 'APIs · nginx', 'Dashboards'],
    name: 'Healthcare Analytics & Intelligence Platform',
    shortName: 'HAIP',
    tagline: 'Flagship capstone — six services, live in production',
    year: '2026',
    problem:
      'Hospitals sit on operational data but lack accessible intelligence: admissions forecasting, KPI visibility and document-grounded answers all live in disconnected tools.',
    contribution:
      'Solo-built across the stack: the data ingestion and validation service, the Random Forest forecasting pipeline with leak-free features, the two-stage RAG service (FAISS bi-encoder + cross-encoder, RAGAS-evaluated), the LangGraph tool-calling agent, and the Docker/nginx deployment with its GitHub Actions pipeline to EC2.',
    architecture: [
      'Hospital data upload → validated analytics & KPI computation',
      'Random Forest admissions forecasting → staffing plan generation',
      'Two-stage RAG: FAISS bi-encoder retrieval → cross-encoder re-ranking (RAGAS 80+)',
      'LangGraph tool-calling agent routing between analytics and retrieval',
      'Gemini / Groq LLM layer behind controlled prompts',
      'Six containerized microservices behind nginx — JWT auth, per-hospital data isolation',
    ],
    stack: ['Python', 'FastAPI', 'LangChain', 'LangGraph', 'FAISS', 'Gemini / Groq', 'Docker', 'nginx', 'Dash', 'Streamlit'],
    outcomes: [
      'Live at med-haip.duckdns.org',
      'RAGAS 80+ on the document-grounded chatbot',
      'Fully automated CI/CD: GitHub Actions → GHCR → EC2',
      'Per-hospital data isolation under JWT authentication',
    ],
    links: [
      { label: 'Live platform', href: 'https://med-haip.duckdns.org', live: true },
      { label: 'GitHub', href: 'https://github.com/Sooryasooru' },
    ],
  },
  {
    id: 'discovery',
    index: '02',
    flow: ['Multi-city data', 'PySpark pipeline', 'Search & ratings', 'BigQuery warehouse'],
    name: 'Hospital & Doctor Discovery Platform',
    shortName: 'Discovery',
    tagline: 'Big data application — PySpark at scale',
    year: '2025',
    problem:
      'Finding the right hospital and doctor in a large city means cross-referencing scattered listings with no quality signal.',
    architecture: [
      'Large-scale hospital & doctor data ingestion and cleaning',
      'PySpark pipeline for city- and department-level search',
      'Ratings and review system layered on top of discovery',
      'BigQuery as the analytics warehouse layer',
    ],
    stack: ['Python', 'PySpark', 'MLlib', 'BigQuery', 'Big Data'],
    outcomes: [
      'Search across large multi-city datasets in seconds',
      'Community ratings integrated into doctor ranking',
      'End-to-end big-data pipeline, not a notebook demo',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Sooryasooru/healthcare-test-analytics-pyspark-mllib' }],
  },
  {
    id: 'reports',
    index: '03',
    flow: ['Report records', 'RDD · SQL · DataFrames', 'KPI engine', 'Plotly dashboard'],
    name: "Doctor's Report Analysis",
    shortName: 'Reports',
    tagline: 'Big-data analytics & interactive dashboard',
    year: '2025',
    problem:
      'Hospital test reports pile up faster than anyone can read them — workload distribution, demand trends and test-type mix stay invisible to decision makers.',
    architecture: [
      'Ingestion of medical report records (ReportID, patient, test type, doctor, date) into Spark',
      'Three processing layers: RDD transformations, Spark SQL, and DataFrame operations',
      'KPI engine: total reports, unique patients, most active doctor, monthly & quarterly trends',
      'Interactive Plotly dashboard with year- and doctor-level filters',
    ],
    stack: ['Python', 'PySpark', 'RDDs', 'Spark SQL', 'DataFrames', 'Plotly', 'Streamlit'],
    outcomes: [
      'Doctor workload and test-type distribution in one filtered view',
      'Monthly/quarterly trend analysis over the full report history',
      'Three Spark paradigms (RDD, SQL, DataFrame) applied to the same domain for correctness',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Sooryasooru/Doctor-s-Report-Analysis-' }],
  },
  {
    id: 'loan',
    index: '04',
    flow: ['Customer data', 'Preprocessing', 'Logistic Regression', 'Evaluation', 'model.pkl'],
    name: 'Loan Repayment Prediction System',
    shortName: 'FinVault',
    tagline: 'ML pipeline with CI/CD discipline',
    year: '2025',
    problem:
      'Lenders need an early, consistent signal on whether a customer will repay or default — and a model they can test, version and retrain automatically.',
    architecture: [
      'Modular ML pipeline: data loading → preprocessing → training → evaluation as separate units',
      'Logistic Regression classifier trained and evaluated with a held-out test split',
      'Accuracy, classification report and confusion matrix reported on every run',
      'Trained artifact serialized to models/model.pkl via joblib',
      'Quality gates: pytest suite, pylint linting, black formatting — all enforced in CI',
    ],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Logistic Regression', 'joblib', 'Pytest', 'Pylint', 'Black', 'GitHub Actions'],
    outcomes: [
      'One-command reproducible training run (python main.py)',
      'Automated tests and lint gates on every push via GitHub Actions',
      'Versioned model artifact ready for serving',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Sooryasooru/project-fin' }],
  },
  {
    id: 'schemes',
    index: '05',
    flow: ['Scheme catalogue', 'NLP preprocessing', 'Matching engine', 'Streamlit top-3'],
    name: 'Government Schemes Recommender',
    shortName: 'Schemes',
    tagline: 'NLP matching for public welfare access',
    year: '2024',
    problem:
      'Students miss out on government welfare because relevant schemes are scattered across portals and written in bureaucratic language.',
    architecture: [
      'Scheme catalogue scraped and normalized with NLP preprocessing',
      'Profile input: class, age, category',
      'Matching engine scores eligibility across the catalogue',
      'Streamlit UI returns the top 3 matches with official application links',
    ],
    stack: ['Python', 'NLP', 'Streamlit'],
    outcomes: [
      'Top-3 scheme matches in one query',
      'Direct official links — no portal hunting',
      'Designed for low-literacy users: minimal inputs',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Sooryasooru/DrugInfo-Explorer' }],
  },
]

export const roleFit = [
  {
    need: 'RAG & LLM systems',
    evidence: 'Two-stage retrieval (FAISS + cross-encoder) at RAGAS 80+, LangGraph tool-calling — in production on HAIP.',
  },
  {
    need: 'End-to-end ML delivery',
    evidence: 'Random Forest admissions forecasting feeding a staffing plan — from data validation to deployed service.',
  },
  {
    need: 'Production & DevOps discipline',
    evidence: 'Six Docker microservices, nginx routing, JWT auth, per-hospital isolation, GitHub Actions → GHCR → EC2.',
  },
  {
    need: 'Big data engineering',
    evidence: 'PySpark + BigQuery pipeline for multi-city discovery; RDD/SQL/DataFrame analytics on medical reports.',
  },
] as const

// ─────────────────────────────────────────────────────────────
// Story metrics — the "what I build" strip.
// ─────────────────────────────────────────────────────────────

export const storyMetrics = [
  { value: 'RAGAS 80+', label: 'grounded-answer score', detail: 'two-stage retrieval, measured with RAGAS' },
  { value: '6', label: 'production microservices', detail: 'Docker + nginx, one platform' },
  { value: '100%', label: 'CI/CD automated deploys', detail: 'GitHub Actions → GHCR → EC2' },
  { value: '5+', label: 'shipped projects', detail: 'ML, big data, dashboards, APIs' },
] as const

// ─────────────────────────────────────────────────────────────
// How I think — the pipeline I run on every problem.
// ─────────────────────────────────────────────────────────────

export const thinkingPipeline = [
  {
    step: '01',
    title: 'Frame the problem',
    detail: 'What decision does this system improve? Define the metric before touching data.',
    example: "HAIP: staffing decisions need a 30-day admissions forecast, not a dashboard 'someday'.",
  },
  {
    step: '02',
    title: 'Engineer the data',
    detail: 'Collection, cleaning, validation and leakage checks — done before any modelling starts.',
    example: 'RDD / Spark SQL / DataFrame layers cross-checked against each other in the reports pipeline.',
  },
  {
    step: '03',
    title: 'Model & evaluate honestly',
    detail: 'Baselines first, then complexity only if it earns its keep. Report what can fail.',
    example: 'Loan predictor: held-out split, classification report + confusion matrix on every run.',
  },
  {
    step: '04',
    title: 'Deploy like an engineer',
    detail: 'Containers, CI/CD, auth, isolation — the model is not the product, the service is.',
    example: 'Six HAIP microservices behind nginx, JWT auth, GitHub Actions → GHCR → EC2.',
  },
  {
    step: '05',
    title: 'Measure & iterate',
    detail: 'Grounded metrics (RAGAS), drift awareness, retraining paths — systems stay honest after launch.',
    example: 'Two-stage retrieval kept only after beating single-stage on a RAGAS eval harness.',
  },
] as const

// ─────────────────────────────────────────────────────────────
// Resume — mirrors Soorya's official one-pager (the attached PDF),
// rendered verbatim at /resume. Not derived from `projects`:
// this is the canonical, curated document.
// ─────────────────────────────────────────────────────────────

export const resumeData = {
  summary:
    'Data Scientist and Computer Engineer who builds and ships end-to-end ML and AI systems, from data engineering and modelling to RAG-based LLM applications, agentic systems, data visualization, and cloud deployment. Experienced across the modern ML stack and big-data tooling (Python, SQL, PySpark), with a focus on healthcare AI, retrieval-augmented generation, and production-style full-stack delivery. Recently led the design, build, and deployment of a six-service healthcare analytics platform with an automated CI/CD pipeline to a live cloud environment.',
  skills: [
    'Python · SQL · PySpark — RAG / LangChain / LangGraph — FAISS / Chroma / Vector DBs',
    'Scikit-learn · XGBoost — LLMs / Transformers — Embeddings / Sentence-Transformers',
    'TensorFlow / PyTorch — NLP / Hugging Face — NumPy / Pandas',
    'Big Data / PySpark — Statistics / EDA — Time-Series Forecasting',
    'FastAPI / Flask — Data Visualization (Streamlit / Dash) — Docker / Compose / nginx',
    'CI/CD (GitHub Actions) — AWS (EC2) / GCP / BigQuery — PostgreSQL / MongoDB / SQLite',
  ],
  projects: [
    {
      name: 'Healthcare Analytics & Intelligence Platform (HAIP)',
      meta: 'Capstone | Live — med-haip.duckdns.org',
      description:
        'End-to-end, six-service healthcare platform where a hospital uploads its data and receives validated analytics and KPIs, a user-trained ML model (Random Forest, leak-free pipeline), an admissions forecast with a staffing plan, a two-stage RAG chatbot (FAISS bi-encoder + cross-encoder re-ranker, RAGAS score 80+) over its own documents, and a LangGraph tool-calling agent. Built as containerised microservices behind an nginx reverse proxy with JWT auth and per-hospital isolation, and deployed to AWS EC2 through a fully automated CI/CD pipeline (GitHub Actions → GHCR → EC2) on a live domain.',
      stack: 'Python · FastAPI · Dash · Streamlit · scikit-learn · LangChain · LangGraph · FAISS · Sentence-Transformers · Gemini / Groq · Docker · nginx · GitHub Actions · AWS EC2',
    },
    {
      name: 'Hospital & Doctor Discovery Platform',
      meta: 'Big Data Project | GitHub — github.com/Sooryasooru/healthcare-test-analytics-pyspark-mllib',
      description:
        'A big-data application for finding better treatment: users select a city to see leading hospitals, drill into a department, and find top doctors, supported by a review and ratings system for hospitals and providers so patients can make informed choices.',
      stack: 'Python · PySpark · Big Data · Ratings/Review System',
    },
    {
      name: 'Government Schemes Recommender',
      meta: 'AI Project | GitHub — github.com/Sooryasooru/DrugInfo-Explorer',
      description:
        'An application that helps students discover government schemes they are often unaware of. The user enters details such as class, age, and category, and the system retrieves the top three most relevant government schemes with direct links to the official portals.',
      stack: 'Python · NLP · Recommendation · Streamlit',
    },
  ],
  education: [
    {
      title: 'Data Scientist Training',
      org: 'Brototype — Kochi, India',
      period: 'Aug 2024 – 2026',
      bullets: [
        'Trained intensively across the full ML lifecycle — data engineering, statistics, classical ML, deep learning, NLP, big data (PySpark), and LLM application development — through hands-on, production-oriented projects.',
        'Built and shipped production-grade AI applications in RAG, embeddings, and vector databases — with reproducible pipelines, RAGAS-based evaluation, and containerised deployment.',
        'Led the design and deployment of a six-service healthcare platform end to end — from data engineering and modelling through to an automated CI/CD pipeline running on a live cloud server — demonstrating ownership and cross-functional team leadership.',
      ],
    },
    {
      title: 'Diploma in Computer Engineering',
      org: 'IPT and GPTC, Shoranur — State Board of Technical Education and Training, Kerala',
      period: '2021 – 2024',
      bullets: [],
    },
  ],
  certifications: 'HackerRank SQL — Advanced Certification · Best Performer Award, Brototype (Project Week)',
  languages: 'English · Malayalam · Tamil · Hindi',
} as const

// ─────────────────────────────────────────────────────────────
// RAG knowledge base — chunked, tagged, retrieved by lib/retrieval.
// ─────────────────────────────────────────────────────────────

export interface KnowledgeChunk {
  id: string
  title: string
  source: string
  keywords: string[]
  text: string
}

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: 'haip-overview',
    title: 'HAIP — what it is',
    source: 'HAIP — overview',
    keywords: ['haip', 'platform', 'capstone', 'project', 'services', 'microservices', 'six'],
    text: 'HAIP (Healthcare Analytics & Intelligence Platform) is a six-service analytics platform and capstone project, live at med-haip.duckdns.org. It covers hospital data upload with validated analytics and KPIs, Random Forest admissions forecasting with a staffing plan, a two-stage RAG chatbot over documents, and a LangGraph tool-calling agent. Everything is containerized microservices behind nginx with JWT auth and per-hospital data isolation.',
  },
  {
    id: 'haip-rag',
    title: 'Two-stage RAG architecture',
    source: 'HAIP — RAG architecture',
    keywords: ['rag', 'retrieval', 'faiss', 'ragas', 'cross-encoder', 'encoder', 'rerank', 're-rank', 'chunking', 'embeddings', 'chatbot', 'documents'],
    text: 'The HAIP chatbot uses two-stage retrieval: a FAISS bi-encoder does fast first-pass retrieval over chunked documents, then a cross-encoder re-ranks the candidates for precision. Measured with RAGAS, the system scores 80+. This design trades a little latency for a large gain in answer grounding quality.',
  },
  {
    id: 'haip-agent',
    title: 'LangGraph tool-calling agent',
    source: 'HAIP — LangGraph agent',
    keywords: ['agent', 'langgraph', 'tool', 'calling', 'routing', 'orchestration'],
    text: 'HAIP includes a LangGraph-based tool-calling agent. It decides between analytics endpoints (KPIs, forecasts) and the RAG retrieval path depending on the question, so the same chat surface can answer both data questions and document questions.',
  },
  {
    id: 'haip-forecasting',
    title: 'Admissions forecasting & staffing',
    source: 'HAIP — forecasting',
    keywords: ['forecast', 'forecasting', 'admissions', 'random', 'forest', 'staffing', 'model', 'ml', 'prediction'],
    text: 'HAIP forecasts admissions with a Random Forest model and turns the forecast into a concrete staffing plan. The pipeline runs from validated uploaded data to KPIs to the prediction service, so admins get a full operational picture in one platform.',
  },
  {
    id: 'haip-devops',
    title: 'Deployment & CI/CD',
    source: 'HAIP — deployment',
    keywords: ['deploy', 'deployment', 'docker', 'nginx', 'ci', 'cd', 'github', 'actions', 'ec2', 'aws', 'ghcr', 'container', 'infrastructure', 'production', 'jwt', 'auth'],
    text: 'HAIP runs as six containerized microservices behind nginx on AWS EC2. CI/CD is fully automated with GitHub Actions: builds push images to GHCR, then deploy to EC2. JWT authentication secures the platform and each tenant\'s data stays isolated.',
  },
  {
    id: 'haip-stack',
    title: 'HAIP tech stack',
    source: 'HAIP — stack',
    keywords: ['stack', 'technologies', 'fastapi', 'langchain', 'gemini', 'groq', 'dash', 'streamlit', 'built'],
    text: 'HAIP is built with Python, FastAPI for the service layer, LangChain and LangGraph for LLM orchestration, FAISS for vector retrieval, Gemini and Groq as LLM providers, Docker and nginx for deployment, and Dash plus Streamlit for analytics interfaces.',
  },
  {
    id: 'discovery-project',
    title: 'Hospital & Doctor Discovery Platform',
    source: 'Hospital Discovery Platform',
    keywords: ['discovery', 'hospital', 'doctor', 'pyspark', 'big', 'data', 'ratings', 'reviews', 'search', 'city'],
    text: 'The Hospital & Doctor Discovery Platform is a big-data application for finding hospitals and doctors by city and department, with a ratings and review system. It is built with Python, PySpark and big-data tooling. Repository: github.com/Sooryasooru/healthcare-test-analytics-pyspark-mllib.',
  },
  {
    id: 'reports-project',
    title: "Doctor's Report Analysis",
    source: "Doctor's Report Analysis",
    keywords: ['reports', 'doctor', 'medical', 'pyspark', 'rdd', 'spark', 'dashboard', 'plotly', 'kpi', 'workload'],
    text: "Doctor's Report Analysis processes hospital medical test data with PySpark using RDD, Spark SQL and DataFrame operations. It computes KPIs such as total reports, unique patients, most active doctor and monthly/quarterly trends, visualized in an interactive Plotly dashboard inside Streamlit with year and doctor filters. Repository: github.com/Sooryasooru/Doctor-s-Report-Analysis-.",
  },
  {
    id: 'loan-project',
    title: 'Loan Repayment Prediction System',
    source: 'Loan Repayment Prediction',
    keywords: ['loan', 'finance', 'credit', 'default', 'logistic', 'regression', 'pytest', 'ci', 'pipeline', 'mlops', 'testing'],
    text: 'The Loan Repayment Prediction System predicts whether a customer will repay or default using a Logistic Regression model in a modular pipeline (data loading, preprocessing, training, evaluation). The trained artifact is serialized with joblib, and the project enforces pytest tests, pylint linting and black formatting through a GitHub Actions CI/CD pipeline. Repository: github.com/Sooryasooru/project-fin.',
  },
  {
    id: 'schemes-project',
    title: 'Government Schemes Recommender',
    source: 'Schemes Recommender',
    keywords: ['schemes', 'government', 'recommender', 'students', 'nlp', 'streamlit', 'scholarship', 'welfare'],
    text: 'The Government Schemes Recommender helps students discover relevant government schemes by entering their class, age and category. It returns the top 3 matches with official links. Built with Python, NLP and Streamlit. Repository: github.com/Sooryasooru/DrugInfo-Explorer.',
  },
  {
    id: 'education',
    title: 'Education & training',
    source: 'Education',
    keywords: ['education', 'brototype', 'training', 'diploma', 'computer', 'engineering', 'kochi', 'study', 'background'],
    text: 'Soorya holds a Diploma in Computer Engineering (IPT and GPTC, Shoranur, 2021–2024) and completed the Data Scientist training track at Brototype, Kochi (August 2024 – 2026). She received the Best Performer Award at Brototype and is HackerRank SQL Advanced certified. She is based in Ottapalam, Palakkad, India.',
  },
  {
    id: 'skills-overview',
    title: 'Skill highlights',
    source: 'Skills',
    keywords: ['skills', 'stack', 'technologies', 'python', 'sql', 'knows', 'good', 'strengths', 'tableau', 'power', 'bi', 'airflow', 'kubernetes', 'docker', 'aws', 'gcp'],
    text: 'Core strengths: Python, SQL, Pandas, NumPy and PySpark for data work; Machine Learning, Deep Learning, NLP and Statistics; Generative AI with RAG (FAISS + cross-encoder, RAGAS 80+), LLMs and LangGraph agents; Scikit-learn, XGBoost and Transformers as ML tools; engineering with FastAPI, Docker, CI/CD, Git and AWS; PostgreSQL, BigQuery, Streamlit and Dash for data platforms and visualization.',
  },
  {
    id: 'contact-info',
    title: 'Contact & availability',
    source: 'Contact',
    keywords: ['contact', 'email', 'hire', 'available', 'linkedin', 'github', 'reach', 'location', 'phone', 'visa'],
    text: 'Soorya T is open to Data Scientist and AI/ML Engineer roles in India, the UAE and Europe. Contact: sooryat101@gmail.com, +91 7736163478, linkedin.com/in/sooryat101, github.com/Sooryasooru. Based in Ottapalam, Palakkad, India.',
  },
  {
    id: 'achievements',
    title: 'Certifications & awards',
    source: 'Achievements',
    keywords: ['award', 'best', 'performer', 'hackerrank', 'sql', 'certified', 'certification', 'achievement'],
    text: 'Soorya received the Best Performer Award at Brototype (Project Week) and holds the HackerRank SQL (Advanced) certification.',
  },
]
