import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />
      
      <div className="mb-8 p-4 bg-emerald-500/10 rounded-full">
        <Leaf className="w-16 h-16 text-emerald-400" />
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white">
        Make the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Invisible Visible</span>
      </h1>
      
      <p className="text-xl text-slate-300 max-w-2xl mb-12">
        Understand, track, and reduce your carbon footprint through simple actions. Watch your personal virtual world thrive as you make better choices.
      </p>

      <Link 
        href="/onboarding"
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-emerald-600 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative flex items-center gap-2">
          Calculate Your Baseline
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </main>
  )
}
