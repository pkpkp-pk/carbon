'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateBaseline } from '@/lib/emissions'
import { MapPin, Car, Salad, Home, ShoppingBag, ChevronRight, ChevronLeft, Leaf } from 'lucide-react'

const STEPS = [
  { id: 'Location',  title: 'Where do you live?',        subtitle: 'Location determines your local energy grid emissions.',        icon: MapPin },
  { id: 'Transport', title: 'How do you get around?',     subtitle: 'Transport is the biggest lever for most people.',              icon: Car },
  { id: 'Diet',      title: 'What do you eat?',           subtitle: 'Food choice accounts for ~25% of global emissions.',           icon: Salad },
  { id: 'Home',      title: 'Tell us about your home.',   subtitle: 'Heating & cooling often surprises people.',                    icon: Home },
  { id: 'Shopping',  title: 'How do you shop?',           subtitle: 'Consumer goods carry embedded carbon from manufacturing.',     icon: ShoppingBag },
]

const OPTION_CLS = (active: boolean) =>
  `cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 select-none ${
    active
      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
      : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80'
  }`

function OptionGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { label: string; val: T }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((o) => (
        <button
          key={o.val}
          onClick={() => onChange(o.val)}
          className={OPTION_CLS(value === o.val)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-white/60">{label}</label>
        <span className="rounded-lg bg-white/5 px-3 py-1 text-sm font-bold text-emerald-400">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, oklch(62% 0.19 160) ${pct}%, oklch(32% 0.02 240) ${pct}%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-xs text-white/20">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    country: 'US',
    regionType: 'Suburban',
    transportModes: 'Car',
    weeklyKm: 150,
    flightsYear: 1,
    dietType: 'Meat-eater',
    foodSourcing: 'Supermarket',
    homeType: 'House',
    homeSize: 'Medium',
    energySource: 'Grid',
    heatingSystem: 'Gas',
    householdSize: 2,
    monthlySpend: 400,
    consumptionModifiers: 'Mostly New',
  })

  const set = <K extends keyof typeof data>(key: K, val: (typeof data)[K]) =>
    setData((d) => ({ ...d, [key]: val }))

  const finish = () => {
    const baseline = calculateBaseline(data)
    localStorage.setItem('carbon_baseline', baseline.toString())
    localStorage.setItem('carbon_onboarding_data', JSON.stringify(data))
    router.push('/dashboard')
  }

  const Icon = STEPS[step].icon

  return (
    <div className="relative min-h-screen bg-[oklch(10%_0.008_240)] flex items-center justify-center p-4 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-0 -right-20 h-80 w-80 rounded-full bg-sky-500/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Carbon<span className="text-emerald-400">Sphere</span>
          </span>
        </div>

        {/* Step progress */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const S = s.icon
            return (
              <div key={i} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                    i < step
                      ? 'bg-emerald-500 text-white'
                      : i === step
                      ? 'border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border border-white/10 bg-white/[0.03] text-white/20'
                  }`}
                >
                  {i < step ? '✓' : <S className="h-3 w-3" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px flex-1 bg-white/5">
                    <motion.div
                      className="h-full bg-emerald-500"
                      animate={{ width: i < step ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="glass rounded-2xl p-8"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{STEPS[step].title}</h2>
                <p className="mt-1 text-sm text-white/40">{STEPS[step].subtitle}</p>
              </div>
            </div>

            <div className="space-y-6">
              {step === 0 && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Country</label>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none"
                      value={data.country}
                      onChange={(e) => set('country', e.target.value)}
                    >
                      <option value="US">🇺🇸 United States</option>
                      <option value="UK">🇬🇧 United Kingdom</option>
                      <option value="EU">🇪🇺 European Union</option>
                      <option value="IN">🇮🇳 India</option>
                      <option value="AU">🇦🇺 Australia</option>
                      <option value="CA">🇨🇦 Canada</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Area type</label>
                    <OptionGroup
                      value={data.regionType as any}
                      options={[
                        { label: '🏙️ Urban', val: 'Urban' },
                        { label: '🏘️ Suburban', val: 'Suburban' },
                        { label: '🌾 Rural', val: 'Rural' },
                      ]}
                      onChange={(v) => set('regionType', v)}
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Primary mode</label>
                    <OptionGroup
                      value={data.transportModes as any}
                      options={[
                        { label: '🚗 Car', val: 'Car' },
                        { label: '🚌 Transit', val: 'Public Transit' },
                        { label: '🚲 Bike/Walk', val: 'Bicycle/Walk' },
                      ]}
                      onChange={(v) => set('transportModes', v)}
                    />
                  </div>
                  <Slider
                    label="Weekly distance"
                    value={data.weeklyKm}
                    min={0}
                    max={1000}
                    step={10}
                    unit="km"
                    onChange={(v) => set('weeklyKm', v)}
                  />
                  <Slider
                    label="Flights per year"
                    value={data.flightsYear}
                    min={0}
                    max={20}
                    step={1}
                    unit="flights"
                    onChange={(v) => set('flightsYear', v)}
                  />
                </>
              )}

              {step === 2 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">Diet type</label>
                  <OptionGroup
                    value={data.dietType as any}
                    options={[
                      { label: '🌱 Vegan', val: 'Vegan' },
                      { label: '🥗 Vegetarian', val: 'Vegetarian' },
                      { label: '🐟 Pescatarian', val: 'Pescatarian' },
                      { label: '🥩 Meat-eater', val: 'Meat-eater' },
                    ]}
                    onChange={(v) => set('dietType', v)}
                  />
                </div>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Energy source</label>
                    <OptionGroup
                      value={data.energySource as any}
                      options={[
                        { label: '⚡ Grid (Mixed)', val: 'Grid' },
                        { label: '☀️ Renewable', val: 'Renewable' },
                      ]}
                      onChange={(v) => set('energySource', v)}
                    />
                  </div>
                  <Slider
                    label="Household size"
                    value={data.householdSize}
                    min={1}
                    max={8}
                    step={1}
                    unit="people"
                    onChange={(v) => set('householdSize', v)}
                  />
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Home size</label>
                    <OptionGroup
                      value={data.homeSize as any}
                      options={[
                        { label: 'Small', val: 'Small' },
                        { label: 'Medium', val: 'Medium' },
                        { label: 'Large', val: 'Large' },
                      ]}
                      onChange={(v) => set('homeSize', v)}
                    />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <Slider
                    label="Monthly spend on goods"
                    value={data.monthlySpend}
                    min={0}
                    max={2000}
                    step={50}
                    unit="$"
                    onChange={(v) => set('monthlySpend', v)}
                  />
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Shopping habits</label>
                    <OptionGroup
                      value={data.consumptionModifiers as any}
                      options={[
                        { label: '🛍️ Mostly New', val: 'Mostly New' },
                        { label: '♻️ Secondhand', val: 'Mostly Secondhand' },
                      ]}
                      onChange={(v) => set('consumptionModifiers', v)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}
              <button
                onClick={step === STEPS.length - 1 ? finish : () => setStep((s) => s + 1)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-100"
              >
                {step === STEPS.length - 1 ? '🌍 See My World' : 'Continue'}
                {step < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-4 text-center text-xs text-white/20">
          Step {step + 1} of {STEPS.length} · No account required
        </p>
      </div>
    </div>
  )
}
