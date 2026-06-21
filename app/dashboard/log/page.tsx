'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Utensils, Zap, ShoppingBag, Plus, Leaf, TrendingDown } from 'lucide-react'

const CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: Car, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
  { id: 'food',      label: 'Food',      icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { id: 'energy',    label: 'Energy',    icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { id: 'shopping',  label: 'Shopping',  icon: ShoppingBag, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
]

const QUICK_ACTIONS = [
  { label: 'Cycled to work',       category: 'transport', impact: -4.2 },
  { label: 'Used public transit',  category: 'transport', impact: -2.1 },
  { label: 'Ate vegetarian meal',  category: 'food',      impact: -1.8 },
  { label: 'Skipped meat today',   category: 'food',      impact: -3.5 },
  { label: 'Turned off heating',   category: 'energy',    impact: -1.2 },
  { label: 'Bought secondhand',    category: 'shopping',  impact: -5.0 },
]

type LogEntry = { id: number; label: string; category: string; impact: number; time: string }

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, label: 'Cycled to work', category: 'transport', impact: -4.2, time: '8:32 AM' },
    { id: 2, label: 'Ate vegetarian meal', category: 'food', impact: -1.8, time: '12:45 PM' },
  ])
  const [selectedCat, setSelectedCat] = useState('transport')

  const log = (action: typeof QUICK_ACTIONS[0]) => {
    const now = new Date()
    setLogs(l => [{
      id: Date.now(),
      label: action.label,
      category: action.category,
      impact: action.impact,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }, ...l])
  }

  const totalSaved = logs.reduce((s, l) => s + Math.abs(l.impact), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Activity Log</h1>
        <p className="mt-1 text-sm text-white/40">Track daily actions and see your impact</p>
      </div>

      {/* Today's total */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/40">CO₂ saved today</p>
            <p className="text-3xl font-extrabold text-emerald-400">{totalSaved.toFixed(1)} <span className="text-lg font-medium text-white/40">kg</span></p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick log */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <h2 className="mb-2 text-lg font-bold text-white">Let&apos;s get logging</h2>
          {/* Category filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCat === c.id ? `${c.bg} ${c.border} ${c.color}` : 'border-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                <c.icon className="h-3 w-3" /> {c.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {QUICK_ACTIONS.filter(a => a.category === selectedCat).map((a, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => log(a)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
              >
                <div className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-white/30" />
                  <span className="text-sm text-white/80">{a.label}</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">−{Math.abs(a.impact)} kg</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Log history */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-semibold text-white">Today's History</h2>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Leaf className="mb-3 h-10 w-10 text-white/10" />
              <p className="text-sm text-white/30">No actions logged yet today.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((entry) => {
                const cat = CATEGORIES.find(c => c.id === entry.category)!
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cat.bg} ${cat.color}`}>
                      <cat.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{entry.label}</p>
                      <p className="text-xs text-white/30">{entry.time}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-emerald-400">−{Math.abs(entry.impact)} kg</span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
