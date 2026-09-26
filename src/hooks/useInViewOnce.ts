import { useEffect, useState } from 'react'

/**
 * Fires once when the element scrolls into view (with a small margin).
 * Returns a ref callback to attach to the observed element.
 */
export function useInViewOnce<T extends Element>(): [(node: T | null) => void, boolean] {
  const [node, setNode] = useState<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!node || inView) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, inView])

  return [setNode, inView]
}
