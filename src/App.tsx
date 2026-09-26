import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useRecruiterMode } from './hooks/useRecruiterMode'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import Header from './components/Header'
import Hero from './components/Hero'
import Story from './components/Story'
import About from './components/About'
import Thinking from './components/Thinking'
import Skills from './components/Skills'
import Projects from './components/Projects'
import BeyondCode from './components/BeyondCode'
import Contact from './components/Contact'
import Footer from './components/Footer'
import RecruiterView from './components/RecruiterView'
import CursorField from './components/CursorField'
import ChatWidget from './components/chat/ChatWidget'

const Resume = lazy(() => import('./pages/Resume'))

export default function App() {
  const isResume =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/resume') || new URLSearchParams(window.location.search).get('view') === 'resume')
  const [recruiterMode, setRecruiterMode] = useRecruiterMode()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isResume) {
    return (
      <Suspense fallback={null}>
        <Resume />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen">
      <CursorField />
      <Header recruiterMode={recruiterMode} onToggleRecruiter={() => setRecruiterMode(!recruiterMode)} />

      <main>
        <AnimatePresence mode="wait">
          {recruiterMode ? (
            <RecruiterView key="recruiter" />
          ) : (
            <div key="full">
              <Hero />
              <Story />
              <About />
              <Thinking />
              <Skills />
              <Projects />
              <BeyondCode />
              <Contact />
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <AnimatePresence>{showTop && <ScrollTop />}</AnimatePresence>
      <ChatWidget />
    </div>
  )
}

function ScrollTop() {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-24 right-5 z-30 grid h-10 w-10 place-items-center rounded-full border border-line bg-paper/90 text-ink-soft shadow-sm backdrop-blur transition hover:border-teal hover:text-teal md:bottom-8 md:right-8"
    >
      <ArrowUp size={16} aria-hidden />
    </motion.button>
  )
}

