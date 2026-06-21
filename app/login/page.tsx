'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSecureProgress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // In a real app, this would use signIn('credentials', ...) and save the local onboarding data to the server
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false)
      // Clear local state if we were migrating it, but we'll leave it for now
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Secure Your Progress</h1>
        <p className="text-slate-400 mb-8">Create an account to save your dashboard, daily logs, and compete with friends.</p>

        <form onSubmit={handleSecureProgress} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Username</label>
            <input 
              type="text"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <input 
              type="password"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
          >
            {loading ? 'Securing...' : 'Create Account & Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
