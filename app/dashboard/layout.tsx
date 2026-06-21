'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  Leaf,
  Shield,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/log', icon: BarChart2, label: 'Activity Log' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[oklch(10%_0.008_240)] text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/5 bg-[oklch(12%_0.009_240)] md:flex">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-white/5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">
            Carbon<span className="text-emerald-400">Sphere</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-emerald-400' : ''}`} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Secure Progress CTA */}
        <div className="p-3">
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/8 p-4">
            <div className="mb-1 flex items-center gap-2 text-emerald-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Guest Session</span>
            </div>
            <p className="mb-3 text-xs text-white/40 leading-relaxed">
              Create an account to save your progress and track over time.
            </p>
            <Link
              href="/login"
              className="block rounded-lg bg-emerald-500 py-2 text-center text-xs font-bold text-white transition-all hover:bg-emerald-400"
            >
              Secure My Progress
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-white/5 bg-[oklch(12%_0.009_240)/80] px-4 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold">Carbon<span className="text-emerald-400">Sphere</span></span>
        </div>
        <Link href="/login" className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400">
          Secure Progress
        </Link>
      </div>

      {/* Main */}
      <main className="flex-1 md:pl-60">
        <div className="min-h-screen p-4 pt-18 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
