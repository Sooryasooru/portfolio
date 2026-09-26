import { profile } from '../data/content'

export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl justify-center px-5 text-xs text-ink-soft sm:px-6">
        <p>© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
