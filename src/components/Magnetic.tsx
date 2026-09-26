import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Magnetic interaction — the wrapped element leans a few pixels toward
 * the cursor while hovered, then springs back on leave. A quiet premium
 * touch for CTAs, header buttons and contact links. Automatically
 * disabled on touch devices, small screens and under reduced motion.
 */
export default function Magnetic({
  children,
  strength = 5,
  className,
}: {
  children: ReactNode
  /** Max displacement in px. */
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)')
  const isSmall = useMediaQuery('(max-width: 639px)')

  const enabled = !reducedMotion && !isTouch && !isSmall

  const onMove = (e: MouseEvent) => {
    if (!enabled) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / 2 / rect.height - 0.5
    setOffset({ x: px * strength * 2, y: py * strength * 2 })
  }

  const onLeave = () => setOffset({ x: 0, y: 0 })

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={enabled ? { x: offset.x, y: offset.y } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`inline-block ${className ?? ''}`}
    >
      {children}
    </motion.span>
  )
}
