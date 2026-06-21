'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, Settings, BarChart2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500" />
          <span className="font-bold text-xl text-white tracking-tight">Carbon<span className="text-emerald-400">Sphere</span></span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/dashboard/log" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
            <BarChart2 className="w-5 h-5" /> Activity Log
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-emerald-900/20 border border-emerald-800/30 rounded-xl mb-4">
            <h4 className="text-emerald-400 font-medium mb-1">Guest Session</h4>
            <p className="text-xs text-slate-400 mb-3">Your progress is saved locally. Secure it now.</p>
            <Link href="/login" className="block text-center text-sm bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium transition-colors">
              Secure Progress
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
