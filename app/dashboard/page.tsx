'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import VirtualWorld from '@/components/world/VirtualWorld'
import { getPlatformWorldState, WorldState } from '@/lib/world-state'
import {
  Leaf, Zap, Car, Utensils, Home, ShoppingBag,
  TrendingDown, ArrowRight, RefreshCcw
} from 'lucide-react'
import Link from 'next/link'

const WORLD_RANGES = [
  { state: 'Crisis',     range: '> 12t',  color: '#ef4444', pct: 100 },
  { state: 'Stressed',   range: '8–12t',  color: '#f97316', pct: 75  },
  { state: 'Recovering', range: '4–8t',   color: '#eab308', pct: 50  },
  { state: 'Healthy',    range: '2–4t',   color: '#4ade80', pct: 25  },
  { state: 'Thriving',   range: '< 2t',   color: '#34d399', pct: 10  },
]

const NUDGES = [
  { icon: Zap,         color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'Switch to green energy', impact: '−1.2t / yr', cta: 'Find plan' },
  { icon: Car,         color: 'text-sky-400',    bg: 'bg-sky-400/10',    title: 'Bike once a week',       impact: '−210 kg / yr', cta: 'Log ride' },
  { icon: Utensils,    color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Try a meat-free day',  impact: '−55 kg / trip', cta: 'Commit' },
]

const BREAKDOWN = [
  { label: 'Transport',  icon: Car,         pct: 38 },
  { label: 'Diet',       icon: Utensils,    pct: 28 },
  { label: 'Home',       icon: Home,        pct: 22 },
  { label: 'Shopping',   icon: ShoppingBag, pct: 12 },
]

const GLOBAL_AVG = 4700 // kg

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-white/[0.03] p-5 ${className}`}>
      {children}
    </div>
  )
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-white/40">{label}</span>
      <span className="ml-auto text-xs font-semibold" style={{ color }}>{value}</span>
    </div>
  )
}

export default function Dashboard() {
  const [baseline, setBaseline] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('carbon_baseline')
    if (saved) setBaseline(parseFloat(saved))
  }, [])

  if (!mounted) return null

  if (!baseline) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-10">
          <Leaf className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          <h2 className="mb-2 text-xl font-bold">No footprint data yet</h2>
          <p className="mb-6 text-sm text-white/40">Complete the 5-step assessment to see your world.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-bold text-white transition-all hover:bg-emerald-400"
          >
            Start Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  const tons = baseline / 1000
  const state = getPlatformWorldState(baseline)
  const vsGlobal = ((baseline - GLOBAL_AVG) / GLOBAL_AVG) * 100
  const worldCfg = WORLD_RANGES.find((w) => w.state === state) ?? WORLD_RANGES[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Your Ecosystem</h1>
          <p className="mt-1 text-sm text-white/40">Based on your lifestyle assessment</p>
        </div>
        <Link
          href="/onboarding"
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white"
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Recalculate
        </Link>
      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Virtual World — takes 2 cols on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-72 overflow-hidden rounded-2xl border border-white/5 lg:col-span-2 lg:h-auto lg:min-h-[340px]"
        >
          <VirtualWorld state={state} />
        </motion.div>

        {/* Right column — footprint summary + world scale */}
        <div className="flex flex-col gap-5">
          {/* Footprint number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="mb-3 flex items-center gap-2 text-white/40 text-xs font-medium uppercase tracking-wider">
                <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Annual Footprint
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-white">{tons.toFixed(1)}</span>
                <span className="mb-1 text-base text-white/30 font-medium">tons CO₂</span>
              </div>
              <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${vsGlobal > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                <TrendingDown className="h-3.5 w-3.5" />
                {Math.abs(vsGlobal).toFixed(0)}% {vsGlobal > 0 ? 'above' : 'below'} global average
              </div>
            </Card>
          </motion.div>

          {/* World state scale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">World Scale</p>
              <div className="space-y-2">
                {WORLD_RANGES.map((w) => (
                  <div key={w.state} className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${w.state === state ? 'bg-white/5' : ''}`}>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: w.color, boxShadow: w.state === state ? `0 0 8px ${w.color}` : 'none' }}
                    />
                    <span className={`flex-1 text-sm ${w.state === state ? 'font-bold text-white' : 'text-white/30'}`}>{w.state}</span>
                    <span className="text-xs" style={{ color: w.state === state ? w.color : '#ffffff20' }}>{w.range}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">Footprint Breakdown</p>
            <div className="space-y-4">
              {BREAKDOWN.map(({ label, icon: Icon, pct }) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-sm text-white/70">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.4 + BREAKDOWN.indexOf({ label, icon: Icon, pct }) * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Nudge engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">Today's Nudges</p>
            <div className="space-y-3">
              {NUDGES.map((n) => (
                <div
                  key={n.title}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.bg} ${n.color}`}>
                    <n.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{n.title}</p>
                    <p className="text-xs text-emerald-400">{n.impact}</p>
                  </div>
                  <button className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white group-hover:border-emerald-500/30 group-hover:text-emerald-400">
                    {n.cta}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
