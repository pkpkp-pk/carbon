'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, TrendingDown, Zap, Globe } from 'lucide-react'

const stats = [
  { label: 'Average global footprint', value: '4.7t', sub: 'CO₂ per year' },
  { label: 'Target by 2030', value: '2.3t', sub: 'CO₂ per year' },
  { label: 'Users can reduce by', value: '40%', sub: 'with simple swaps' },
]

const features = [
  {
    icon: Globe,
    title: 'Baseline Calculator',
    desc: 'Five smart questions map your exact footprint — transport, diet, home, shopping.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: TrendingDown,
    title: 'Live Virtual World',
    desc: 'Your personal ecosystem responds in real-time. Watch skies clear and forests grow as you improve.',
    color: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/20',
    iconColor: 'text-sky-400',
  },
  {
    icon: Zap,
    title: 'Nudge Engine',
    desc: 'Bite-sized daily actions personalised to your habits. Small steps, visible impact.',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[oklch(10%_0.008_240)]">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(96%_0.007_240) 1px,transparent 1px),linear-gradient(90deg,oklch(96%_0.007_240) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Nav */}
        <nav className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Carbon<span className="text-emerald-400">Sphere</span>
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-white/30 hover:text-white"
          >
            Sign in
          </Link>
        </nav>

        {/* Hero */}
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Make the invisible visible
            </span>

            <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              Your choices shape{' '}
              <span className="gradient-text">a living world</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg text-white/50 leading-relaxed">
              See your carbon footprint as a living ecosystem — then watch it
              thrive as you make smarter, smaller decisions every day.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-emerald-500/50 active:scale-100"
              >
                Calculate My Footprint
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-sm text-white/30">No sign-up required</p>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24 grid grid-cols-3 divide-x divide-white/5 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          {stats.map((s) => (
            <div key={s.label} className="px-8 py-6 text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">{s.value}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.sub}</p>
              <p className="mt-2 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-24 grid gap-5 md:grid-cols-3"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ${f.iconColor}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-white text-lg">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="relative inline-block overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-12">
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <Leaf className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h2 className="mb-3 text-3xl font-bold text-white">
              Start in 2 minutes
            </h2>
            <p className="mb-8 text-white/50">
              Answer 5 questions about how you live. Get your footprint instantly.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 font-bold text-white transition-all hover:bg-emerald-400 hover:scale-105"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
