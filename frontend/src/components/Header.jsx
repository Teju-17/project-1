import { Moon } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Influencer Credibility Auditor</h1>
        <p className="text-sm text-slate-500">AI/ML-powered fake follower detection dashboard</p>
      </div>
      <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" aria-label="Theme toggle">
        <Moon size={18} />
      </button>
    </header>
  )
}
