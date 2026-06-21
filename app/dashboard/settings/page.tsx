'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, RefreshCcw, Shield, Bell, Palette } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [baseline, setBaseline] = useState<number | null>(null)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    const b = localStorage.getItem('carbon_baseline')
    if (b) setBaseline(parseFloat(b))
  }, [])

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Manage your profile and preferences</p>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
            <User className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-white">Account</h2>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-4">
          <p className="text-sm text-amber-300 font-medium mb-1">Guest Session Active</p>
          <p className="text-xs text-white/40 mb-3">Your data is saved locally. Create an account to back it up to the cloud and access it anywhere.</p>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black transition-all hover:bg-amber-400">
            <Shield className="h-3.5 w-3.5" /> Create Account
          </Link>
        </div>
      </div>

      {/* Footprint */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
            <RefreshCcw className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-white">Footprint Baseline</h2>
        </div>
        {baseline ? (
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-4">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Baseline</p>
              <p className="text-2xl font-bold text-white">{(baseline / 1000).toFixed(1)} <span className="text-sm font-normal text-white/40">t CO₂/yr</span></p>
            </div>
            <Link href="/onboarding" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:text-white">
              Recalculate
            </Link>
          </div>
        ) : (
          <Link href="/onboarding" className="block rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4 text-center text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/12">
            Complete your assessment →
          </Link>
        )}
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
            <Bell className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-white">Preferences</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Daily nudge reminders</p>
            <p className="text-xs text-white/40">Get notified about your daily green actions</p>
          </div>
          <button
            onClick={() => setNotifications(n => !n)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${notifications ? 'bg-emerald-500' : 'bg-white/10'}`}
          >
            <motion.div
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
              animate={{ left: notifications ? '1.375rem' : '0.125rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* App info */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
            <Palette className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-white">About</h2>
        </div>
        <div className="space-y-2 text-sm text-white/40">
          <div className="flex justify-between"><span>Version</span><span className="text-white/60">1.0.0</span></div>
          <div className="flex justify-between"><span>Emission data</span><span className="text-white/60">IPCC / DEFRA</span></div>
          <div className="flex justify-between"><span>Last updated</span><span className="text-white/60">Jun 2026</span></div>
        </div>
      </div>
    </div>
  )
}
