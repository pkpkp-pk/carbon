'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateBaseline } from '@/lib/emissions'
import { MapPin, Car, Salad, Home, ShoppingBag, ChevronRight, ChevronLeft, Leaf, Plus, Minus } from 'lucide-react'

const STEPS = [
  { id: 'Location',  title: 'Where do you live?',        subtitle: 'Location determines your local energy grid emissions.',      icon: MapPin },
  { id: 'Transport', title: 'How do you get around?',     subtitle: 'Add each mode you use — different trips, different distances.', icon: Car },
  { id: 'Diet',      title: 'What do you eat?',           subtitle: 'Food choice accounts for ~25% of global emissions.',         icon: Salad },
  { id: 'Home',      title: 'Tell us about your home.',   subtitle: 'Heating & cooling often surprises people.',                  icon: Home },
  { id: 'Shopping',  title: 'How do you shop?',           subtitle: 'Consumer goods carry embedded carbon from manufacturing.',   icon: ShoppingBag },
]

type TransportMode = { mode: string; weeklyKm: number }

const TRANSPORT_OPTIONS = [
  { val: 'Car',              label: '🚗 Car',           factor: 0.21 },
  { val: 'Motorcycle',       label: '🏍️ Motorcycle',   factor: 0.11 },
  { val: 'Public Transit',   label: '🚌 Bus/Train',     factor: 0.05 },
  { val: 'Bicycle/Walk',     label: '🚲 Bike/Walk',     factor: 0    },
  { val: 'Electric Vehicle', label: '⚡ EV',            factor: 0.05 },
]

const OPTION_CLS = (active: boolean) =>
  `cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 select-none ${
    active
      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
      : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80'
  }`

function OptionGroup<T extends string>({
  value, options, onChange,
}: { value: T; options: { label: string; val: T }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((o) => (
        <button key={o.val} onClick={() => onChange(o.val)} className={OPTION_CLS(value === o.val)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-white/60">{label}</label>
        <span className="rounded-lg bg-white/5 px-3 py-1 text-sm font-bold text-emerald-400">{value} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, oklch(62% 0.19 160) ${pct}%, oklch(32% 0.02 240) ${pct}%)` }}
      />
      <div className="mt-1 flex justify-between text-xs text-white/20">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}

function TransportBuilder({ modes, onChange }: {
  modes: TransportMode[]; onChange: (m: TransportMode[]) => void
}) {
  const addMode = () => {
    const used = new Set(modes.map(m => m.mode))
    const next = TRANSPORT_OPTIONS.find(o => !used.has(o.val))
    if (next) onChange([...modes, { mode: next.val, weeklyKm: 50 }])
  }
  const removeMode = (i: number) => onChange(modes.filter((_, idx) => idx !== i))
  const updateMode = (i: number, field: keyof TransportMode, val: string | number) =>
    onChange(modes.map((m, idx) => idx === i ? { ...m, [field]: val } : m))

  const totalWeeklyKm = modes.reduce((s, m) => s + m.weeklyKm, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40 uppercase tracking-wider">
          Total: <span className="text-emerald-400 font-bold">{totalWeeklyKm} km/week</span>
        </p>
        {modes.length < TRANSPORT_OPTIONS.length && (
          <button
            onClick={addMode}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
          >
            <Plus className="h-3 w-3" /> Add mode
          </button>
        )}
      </div>

      <AnimatePresence>
        {modes.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-white/8 bg-white/[0.03] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <select
                value={m.mode}
                onChange={e => updateMode(i, 'mode', e.target.value)}
                className="rounded-lg border border-white/10 bg-[oklch(18%_0.012_240)] px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
              >
                {TRANSPORT_OPTIONS.map(o => (
                  <option key={o.val} value={o.val} style={{ backgroundColor: '#1e293b', color: '#fff' }}>{o.label}</option>
                ))}
              </select>
              {modes.length > 1 && (
                <button onClick={() => removeMode(i)} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Slider
              label="Weekly distance"
              value={m.weeklyKm} min={0} max={500} step={5} unit="km"
              onChange={v => updateMode(i, 'weeklyKm', v)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [transportModes, setTransportModes] = useState<TransportMode[]>([{ mode: 'Car', weeklyKm: 150 }])
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
    // Merge multi-mode transport into single data
    const primaryMode = transportModes.sort((a, b) => b.weeklyKm - a.weeklyKm)[0]?.mode ?? 'Car'
    const totalKm = transportModes.reduce((s, m) => s + m.weeklyKm, 0)
    const mergedData = { ...data, transportModes: primaryMode, weeklyKm: totalKm }
    const baseline = calculateBaseline(mergedData)
    localStorage.setItem('carbon_baseline', baseline.toString())
    localStorage.setItem('carbon_onboarding_data', JSON.stringify(mergedData))
    router.push('/dashboard')
  }

  const Icon = STEPS[step].icon

  return (
    <div className="relative min-h-screen bg-[oklch(10%_0.008_240)] flex items-center justify-center p-4 overflow-hidden">
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
          <span className="text-lg font-bold text-white">Carbon<span className="text-emerald-400">Sphere</span></span>
        </div>

        {/* Step progress */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const S = s.icon
            return (
              <div key={i} className="flex flex-1 items-center gap-2">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border border-white/10 bg-white/[0.03] text-white/20'
                }`}>
                  {i < step ? '✓' : <S className="h-3 w-3" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px flex-1 bg-white/5">
                    <motion.div className="h-full bg-emerald-500" animate={{ width: i < step ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
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

              {/* Step 0 — Location */}
              {step === 0 && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Country</label>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-[oklch(18%_0.012_240)] px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none appearance-none"
                      value={data.country}
                      onChange={(e) => set('country', e.target.value)}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="US" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇺🇸 United States</option>
                      <option value="UK" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇬🇧 United Kingdom</option>
                      <option value="EU" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇪🇺 European Union</option>
                      <option value="IN" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇮🇳 India</option>
                      <option value="AU" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇦🇺 Australia</option>
                      <option value="CA" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇨🇦 Canada</option>
                      <option value="CN" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇨🇳 China</option>
                      <option value="BR" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🇧🇷 Brazil</option>
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

              {/* Step 1 — Transport (multi-mode) */}
              {step === 1 && (
                <>
                  <TransportBuilder modes={transportModes} onChange={setTransportModes} />
                  <Slider
                    label="Flights per year"
                    value={data.flightsYear} min={0} max={20} step={1} unit="flights"
                    onChange={(v) => set('flightsYear', v)}
                  />
                  <p className="text-xs text-white/30">💡 One long-haul flight ≈ 1.5 t CO₂</p>
                </>
              )}

              {/* Step 2 — Diet */}
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

              {/* Step 3 — Home */}
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
                    value={data.householdSize} min={1} max={8} step={1} unit="people"
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

              {/* Step 4 — Shopping */}
              {step === 4 && (
                <>
                  <Slider
                    label="Monthly spend on goods"
                    value={data.monthlySpend} min={0} max={2000} step={50} unit="$"
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
