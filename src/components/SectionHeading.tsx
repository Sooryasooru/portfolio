import { motion } from 'motion/react'

interface Props {
  kicker: string
  title: string
  description?: string
}

export default function SectionHeading({ kicker, title, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-4 max-w-2xl text-ink-soft">{description}</p>}
    </motion.div>
  )
}
