'use client'

import { useEffect, useState } from 'react'
import VirtualWorld from '@/components/world/VirtualWorld'
import { getPlatformWorldState } from '@/lib/world-state'
import { ArrowRight, Leaf, Zap, Car } from 'lucide-react'

export default function Dashboard() {
  const [baseline, setBaseline] = useState<number | null>(null)
  
  useEffect(() => {
    const saved = localStorage.getItem('carbon_baseline')
    if (saved) setBaseline(parseFloat(saved))
  }, [])

  if (baseline === null) return <div className="p-8 text-center animate-pulse">Loading environment...</div>

  const state = getPlatformWorldState(baseline)
  
  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Your Ecosystem</h1>
          <p className="text-slate-400">Current status: <span className="font-semibold text-emerald-400">{state}</span></p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
          Log Activity <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Virtual World (1/3 of the screen visually) */}
      <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <VirtualWorld state={state} />
      </div>

      {/* Dashboard Stats (2/3 of the screen visually) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
            <div className="p-2 bg-slate-800 rounded-lg"><Leaf className="w-5 h-5" /></div>
            <h3 className="font-medium">Annual Footprint</h3>
          </div>
          <p className="text-4xl font-bold text-white">{(baseline / 1000).toFixed(1)} <span className="text-lg text-slate-500 font-medium">tons CO₂</span></p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-2">
          <h3 className="font-medium text-slate-400 mb-4">Nudge Engine</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-full"><Zap className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-white">Switch to Green Energy</h4>
                  <p className="text-sm text-slate-400">Save up to 1.2 tons/yr</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">Action</button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full"><Car className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-white">Bike to work tomorrow</h4>
                  <p className="text-sm text-slate-400">Save 4 kg CO₂ per trip</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">Commit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
