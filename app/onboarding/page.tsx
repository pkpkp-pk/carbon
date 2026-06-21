'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateBaseline } from '@/lib/emissions'

const STEPS = [
  { id: 'Location', title: 'Where do you live?' },
  { id: 'Transport', title: 'How do you get around?' },
  { id: 'Diet', title: 'What do you eat?' },
  { id: 'Home', title: 'Tell us about your home' },
  { id: 'Shopping', title: 'Shopping habits' }
]

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    country: 'US',
    regionType: 'Suburban',
    transportModes: 'Car',
    weeklyKm: 100,
    flightsYear: 1,
    dietType: 'Meat-eater',
    foodSourcing: 'Supermarket',
    homeType: 'House',
    homeSize: 'Medium',
    energySource: 'Grid',
    heatingSystem: 'Gas',
    householdSize: 2,
    monthlySpend: 500,
    consumptionModifiers: 'New'
  })

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      finishOnboarding()
    }
  }

  const finishOnboarding = () => {
    const baseline = calculateBaseline(data)
    // Save to local storage for guest session
    localStorage.setItem('carbon_baseline', baseline.toString())
    localStorage.setItem('carbon_onboarding_data', JSON.stringify(data))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.id} className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: i <= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700"
          >
            <h2 className="text-3xl font-bold mb-6">{STEPS[step].title}</h2>
            
            {/* Form Fields Based on Step */}
            <div className="space-y-6">
              {step === 0 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-2">Country</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                      value={data.country}
                      onChange={e => setData({...data, country: e.target.value})}
                    >
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="EU">European Union</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Region Type</label>
                    <div className="flex gap-2">
                      {['Urban', 'Suburban', 'Rural'].map(r => (
                        <button 
                          key={r}
                          onClick={() => setData({...data, regionType: r})}
                          className={`flex-1 py-3 rounded-lg border ${data.regionType === r ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'border-slate-700 hover:border-slate-500'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-2">Primary Transport</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                      value={data.transportModes}
                      onChange={e => setData({...data, transportModes: e.target.value})}
                    >
                      <option>Car</option>
                      <option>Public Transit</option>
                      <option>Bicycle/Walk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Weekly Distance (km): {data.weeklyKm}</label>
                    <input 
                      type="range" min="0" max="1000" step="10"
                      className="w-full accent-emerald-500"
                      value={data.weeklyKm}
                      onChange={e => setData({...data, weeklyKm: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Flights per year: {data.flightsYear}</label>
                    <input 
                      type="range" min="0" max="20"
                      className="w-full accent-emerald-500"
                      value={data.flightsYear}
                      onChange={e => setData({...data, flightsYear: parseInt(e.target.value)})}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-2">Diet Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Vegan', 'Vegetarian', 'Pescatarian', 'Meat-eater'].map(d => (
                        <button 
                          key={d}
                          onClick={() => setData({...data, dietType: d})}
                          className={`p-3 rounded-lg border ${data.dietType === d ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'border-slate-700 hover:border-slate-500'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-2">Household Size</label>
                    <input 
                      type="number" min="1" max="10"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                      value={data.householdSize}
                      onChange={e => setData({...data, householdSize: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Energy Source</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                      value={data.energySource}
                      onChange={e => setData({...data, energySource: e.target.value})}
                    >
                      <option>Grid (Mixed)</option>
                      <option>Renewable (Solar/Wind)</option>
                    </select>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-2">Monthly Spend on Goods ($)</label>
                    <input 
                      type="number" step="100"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                      value={data.monthlySpend}
                      onChange={e => setData({...data, monthlySpend: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Shopping Habits</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                      value={data.consumptionModifiers}
                      onChange={e => setData({...data, consumptionModifiers: e.target.value})}
                    >
                      <option>Mostly New</option>
                      <option>Mostly Secondhand</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={handleNext}
              className="mt-8 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
            >
              {step === STEPS.length - 1 ? 'See My Footprint' : 'Continue'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
