import { useCallback, useEffect, useState } from 'react'

/**
 * Recruiter mode — persisted per session and deep-linkable via ?recruiter=1
 * so an HR contact can share a link that opens condensed.
 */
export function useRecruiterMode(): [boolean, (v: boolean) => void] {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    if (params.get('recruiter') === '1') {
      sessionStorage.setItem('recruiter-mode', '1')
      return true
    }
    return sessionStorage.getItem('recruiter-mode') === '1'
  })

  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search)
      setEnabled(params.get('recruiter') === '1' || sessionStorage.getItem('recruiter-mode') === '1')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const toggle = useCallback((v: boolean) => {
    setEnabled(v)
    if (v) sessionStorage.setItem('recruiter-mode', '1')
    else sessionStorage.removeItem('recruiter-mode')
  }, [])

  return [enabled, toggle]
}
