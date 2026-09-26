import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Ambient cursor field — a sparse set of drifting nodes that link to
 * nearby nodes and lean toward the cursor. Fixed, behind all content,
 * pointer-events: none. Disabled under reduced motion and on
 * touch/coarse pointers; density scales down on small screens.
 */
export default function CursorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)')
  const isSmall = useMediaQuery('(max-width: 640px)')

  useEffect(() => {
    if (reducedMotion || isTouch) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const mouse = { x: -9999, y: -9999 }

    const COUNT = isSmall ? 24 : 42
    const LINK = isSmall ? 100 : 150
    const MOUSE_LINK = 200
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
    }))

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onVis = () => {
      running = document.visibilityState === 'visible'
      if (running) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)

      const pts = nodes.map((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1
        // Gentle cursor attraction within range
        const px = n.x * w
        const py = n.y * h
        const mdx = mouse.x - px
        const mdy = mouse.y - py
        const md = Math.hypot(mdx, mdy)
        let x = px
        let y = py
        if (md < MOUSE_LINK && md > 0.01) {
          const pull = (1 - md / MOUSE_LINK) * 12
          x += (mdx / md) * pull
          y += (mdy / md) * pull
        }
        return { x, y }
      })

      // Links between neighbors
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            ctx.strokeStyle = `rgba(28, 36, 49, ${0.06 * (1 - d / LINK)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      // Links to cursor — teal, clearly visible near the pointer
      if (mouse.x > 0) {
        for (const p of pts) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
          if (d < MOUSE_LINK) {
            const t = 1 - d / MOUSE_LINK
            ctx.strokeStyle = `rgba(47, 93, 80, ${0.14 * t + 0.02})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      // Nodes — navy halo + teal core, brighter inside the cursor range
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        const near = d < MOUSE_LINK
        const t = near ? 1 - d / MOUSE_LINK : 0
        // Halo
        ctx.fillStyle = `rgba(47, 93, 80, ${0.05 + t * 0.08})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, near ? 3.6 + t * 1.6 : 3, 0, Math.PI * 2)
        ctx.fill()
        // Core
        ctx.fillStyle = near
          ? `rgba(35, 70, 60, ${0.5 + t * 0.2})`
          : 'rgba(28, 36, 49, 0.26)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, near ? 1.9 + t * 0.6 : 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseout', onLeave)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      running = false
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reducedMotion, isTouch, isSmall])

  if (reducedMotion || isTouch) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  )
}
