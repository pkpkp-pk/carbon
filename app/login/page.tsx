'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, ArrowLeft, Shield, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      // If there's existing onboarding data, sync it to DB
      const onboardingRaw = localStorage.getItem('carbon_onboarding_data')
      const baseline = localStorage.getItem('carbon_baseline')
      if (onboardingRaw && baseline && data.id) {
        const onboardingData = JSON.parse(onboardingRaw)
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.id, data: onboardingData }),
        })
      }

      // Persist auth state (including DB id)
      localStorage.setItem('carbon_user', JSON.stringify({
        id: data.id,
        username: data.username,
        grn_id: data.grn_id,
        isGuest: false,
      }))

      router.push('/dashboard')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(10%_0.008_240)] flex items-center justify-center p-4">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/8 blur-[100px]" />

      <div className="relative w-full max-w-sm">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard
        </Link>

        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Carbon<span className="text-emerald-400">Sphere</span></span>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white">Secure your progress</h1>
          <p className="mb-7 text-sm text-white/40">
            Create a free account. Your guest assessment will be migrated automatically.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-white/80">Username</label>
              <input
                id="username" type="text" required minLength={3} maxLength={30}
                placeholder="e.g. greenwarrior42"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder-white/40 transition-all focus:border-emerald-500/50 focus:outline-none focus:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">Password</label>
              <input
                id="password" type="password" required minLength={6}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder-white/40 transition-all focus:border-emerald-500/50 focus:outline-none focus:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(10%_0.008_240)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Securing…
                </span>
              ) : '🌿 Create Account & Save'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-white/20">
            Already have an account? Signing in with the same username + password works too.
          </p>
        </div>
      </div>
    </div>
  )
}
