'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { WorldState } from '@/lib/world-state'
import { useEffect, useRef, useState } from 'react'

interface VirtualWorldProps {
  state: WorldState
}

const STATE_CONFIG = {
  Crisis: {
    skyTop: '#1a0d00', skyBot: '#5c2a0a',
    smokeOpacity: 0.9, vegColor: '#2d1a08', vegDensity: 0.15,
    waterColor: '#1a2a2a', waterDark: '#050f0f',
    labelColor: '#ef4444', showSmog: true, showWildlife: false, showSolar: false,
    cloudColor: '#5a4a3a', sunOpacity: 0.15, sunColor: '#8b6020',
    groundColor: '#2a1a08', groundColor2: '#3a2210',
  },
  Stressed: {
    skyTop: '#2a1e08', skyBot: '#7a5218',
    smokeOpacity: 0.55, vegColor: '#3a4a1a', vegDensity: 0.38,
    waterColor: '#1e3838', waterDark: '#0a1818',
    labelColor: '#f97316', showSmog: true, showWildlife: false, showSolar: false,
    cloudColor: '#6a5a3a', sunOpacity: 0.45, sunColor: '#c09020',
    groundColor: '#2e2a10', groundColor2: '#3e3618',
  },
  Recovering: {
    skyTop: '#0d2030', skyBot: '#1a5070',
    smokeOpacity: 0.15, vegColor: '#1e4a1e', vegDensity: 0.6,
    waterColor: '#0e3c5c', waterDark: '#040e18',
    labelColor: '#eab308', showSmog: false, showWildlife: false, showSolar: true,
    cloudColor: '#3a5a7a', sunOpacity: 0.75, sunColor: '#f0e060',
    groundColor: '#162812', groundColor2: '#1e3818',
  },
  Healthy: {
    skyTop: '#0a1e5c', skyBot: '#0e5a9a',
    smokeOpacity: 0, vegColor: '#147814', vegDensity: 0.82,
    waterColor: '#0a4a7a', waterDark: '#030c18',
    labelColor: '#4ade80', showSmog: false, showWildlife: true, showSolar: true,
    cloudColor: '#2a4a8a', sunOpacity: 0.92, sunColor: '#fff8e0',
    groundColor: '#0e3010', groundColor2: '#124018',
  },
  Thriving: {
    skyTop: '#060e38', skyBot: '#0a5ca8',
    smokeOpacity: 0, vegColor: '#0ea010', vegDensity: 1,
    waterColor: '#0870b0', waterDark: '#020a18',
    labelColor: '#34d399', showSmog: false, showWildlife: true, showSolar: true,
    cloudColor: '#1a3a6a', sunOpacity: 1, sunColor: '#fffde8',
    groundColor: '#085010', groundColor2: '#0c6a14',
  },
}

// Floating cloud
function Cloud({ cx, cy, scale, speed, delay }: { cx: number; cy: number; scale: number; speed: number; delay: number }) {
  return (
    <motion.g
      initial={{ x: -30 }}
      animate={{ x: ['-30%', '130%'] }}
      transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }}
      style={{ opacity: 0.12 }}
    >
      <ellipse cx={cx} cy={cy} rx={18 * scale} ry={7 * scale} fill="white" />
      <ellipse cx={cx - 8 * scale} cy={cy - 3 * scale} rx={10 * scale} ry={6 * scale} fill="white" />
      <ellipse cx={cx + 8 * scale} cy={cy - 2 * scale} rx={9 * scale} ry={5 * scale} fill="white" />
    </motion.g>
  )
}

// Bird (V-shaped wingbeat)
function Bird({ startX, y, speed, delay }: { startX: number; y: number; speed: number; delay: number }) {
  const [wing, setWing] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setWing(w => (w + 1) % 2), 400)
    return () => clearInterval(id)
  }, [])

  const up = wing === 0
  const d = up
    ? `M0,0 Q5,-4 10,0 Q15,-4 20,0`
    : `M0,0 Q5,-1 10,0 Q15,-1 20,0`

  return (
    <motion.g
      animate={{ x: [startX, 120] }}
      transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear', repeatDelay: 1 }}
      style={{ y }}
    >
      <path d={d} stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" />
    </motion.g>
  )
}

// Animated tree with trunk + layered canopy
function Tree({ x, h, color, delay }: { x: number; h: number; color: string; delay: number }) {
  const trunkH = h * 0.28
  const trunkY = 100 - trunkH
  const canopyY = 100 - h
  return (
    <motion.g
      animate={{ rotate: [-0.8, 0.8] }}
      transition={{ duration: 3 + delay * 0.4, repeat: Infinity, ease: 'easeInOut', delay, repeatType: 'mirror' }}
      style={{ transformOrigin: `${x}px 100%` }}
    >
      {/* Trunk */}
      <rect x={x - 2} y={trunkY} width={4} height={trunkH} rx={1.5} fill="#4a2e10" />
      {/* Shadow canopy */}
      <ellipse cx={x} cy={canopyY + h * 0.1} rx={h * 0.28} ry={h * 0.32} fill={color} opacity={0.5} />
      {/* Main canopy */}
      <motion.ellipse
        cx={x} cy={canopyY}
        rx={h * 0.26} ry={h * 0.3}
        fill={color}
        animate={{ ry: [h * 0.3, h * 0.33, h * 0.3] }}
        transition={{ duration: 2.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay, repeatType: 'mirror' }}
      />
      {/* Highlight spot */}
      <ellipse cx={x - h * 0.08} cy={canopyY - h * 0.08} rx={h * 0.1} ry={h * 0.08} fill="rgba(255,255,255,0.08)" />
    </motion.g>
  )
}

// Smoke puff
function SmokePuff({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.circle
      cx={x} cy={y} r={6}
      fill="#888898"
      initial={{ cy: y, opacity: 0.5, r: 6 }}
      animate={{ cy: y - 25, opacity: 0, r: 16 }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  )
}

// Factory with smoke
function Factory({ x, h, smokeOpacity }: { x: number; h: number; smokeOpacity: number }) {
  return (
    <g>
      <rect x={x} y={100 - h} width={14} height={h} fill="#2a2a38" rx={1} />
      <rect x={x + 15} y={100 - h * 0.7} width={10} height={h * 0.7} fill="#22222e" rx={1} />
      {/* Chimney */}
      <rect x={x + 3} y={100 - h - 10} width={4} height={10} fill="#3a3a48" />
      <rect x={x + 18} y={100 - h * 0.7 - 8} width={3} height={8} fill="#2e2e3c" />
      {/* Smoke */}
      {smokeOpacity > 0 && (
        <g opacity={smokeOpacity}>
          <SmokePuff x={x + 5} y={100 - h - 10} delay={0} />
          <SmokePuff x={x + 5} y={100 - h - 10} delay={1.5} />
          <SmokePuff x={x + 19.5} y={100 - h * 0.7 - 8} delay={0.8} />
        </g>
      )}
    </g>
  )
}

// Solar panel array
function SolarArray({ x, y }: { x: number; y: number }) {
  return (
    <motion.g animate={{ opacity: [0.65, 1, 0.65] }} transition={{ duration: 3, repeat: Infinity }}>
      <rect x={x} y={y} width={16} height={9} rx={1} fill="#0f2860" stroke="#2a5af0" strokeWidth={0.4} />
      <line x1={x} x2={x + 16} y1={y + 4.5} y2={y + 4.5} stroke="#2a5af0" strokeWidth={0.4} />
      <line x1={x + 5.3} x2={x + 5.3} y1={y} y2={y + 9} stroke="#2a5af0" strokeWidth={0.4} />
      <line x1={x + 10.6} x2={x + 10.6} y1={y} y2={y + 9} stroke="#2a5af0" strokeWidth={0.4} />
      {/* Glint */}
      <motion.rect x={x + 1} y={y + 1} width={3} height={2} rx={0.5} fill="white" opacity={0}
        animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />
    </motion.g>
  )
}

// Butterfly (Healthy/Thriving)
function Butterfly({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g
      animate={{ x: [x, x + 6, x + 2, x + 8, x], y: [y, y - 3, y + 2, y - 1, y] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <motion.g animate={{ scaleX: [1, -1, 1] }} transition={{ duration: 1, repeat: Infinity, delay }}>
        <ellipse cx={-3} cy={0} rx={4} ry={2.5} fill="#ff80ff" opacity={0.6} />
        <ellipse cx={-2} cy={2} rx={3} ry={2} fill="#ff60ff" opacity={0.5} />
        <ellipse cx={3} cy={0} rx={4} ry={2.5} fill="#ff80ff" opacity={0.6} />
        <ellipse cx={2} cy={2} rx={3} ry={2} fill="#ff60ff" opacity={0.5} />
      </motion.g>
    </motion.g>
  )
}

const BUILDINGS = [
  { x: 2,  w: 10, h: 32 }, { x: 14, w: 8,  h: 24 }, { x: 24, w: 13, h: 40 },
  { x: 39, w: 9,  h: 22 }, { x: 50, w: 12, h: 34 }, { x: 64, w: 8,  h: 20 },
  { x: 74, w: 11, h: 28 }, { x: 87, w: 9,  h: 22 },
]
const TREES_DATA = [
  { x: 8,  h: 20 }, { x: 18, h: 16 }, { x: 30, h: 22 },
  { x: 48, h: 18 }, { x: 58, h: 24 }, { x: 72, h: 19 },
  { x: 82, h: 21 }, { x: 92, h: 17 },
]

export default function VirtualWorld({ state }: VirtualWorldProps) {
  const [mounted, setMounted] = useState(false)
  const [current, setCurrent] = useState(state)
  const prev = useRef(state)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (state !== prev.current) { prev.current = state; setCurrent(state) }
  }, [state])

  if (!mounted) return (
    <div className="w-full h-full rounded-xl bg-[oklch(14%_0.01_240)] animate-pulse flex items-center justify-center">
      <p className="text-white/20 text-sm">Loading world…</p>
    </div>
  )

  const cfg = STATE_CONFIG[current]
  const visibleTrees = Math.ceil(TREES_DATA.length * cfg.vegDensity)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl select-none">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <linearGradient id="wvSky" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: cfg.skyTop }} transition={{ duration: 2.5 }} />
            <motion.stop offset="100%" animate={{ stopColor: cfg.skyBot }} transition={{ duration: 2.5 }} />
          </linearGradient>
          <linearGradient id="wvWater" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: cfg.waterColor }} transition={{ duration: 2.5 }} />
            <motion.stop offset="100%" animate={{ stopColor: cfg.waterDark }} transition={{ duration: 2.5 }} />
          </linearGradient>
          <linearGradient id="wvGround" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: cfg.groundColor }} transition={{ duration: 2.5 }} />
            <motion.stop offset="100%" animate={{ stopColor: cfg.groundColor2 }} transition={{ duration: 2.5 }} />
          </linearGradient>
          <radialGradient id="wvSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor={cfg.sunColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={cfg.sunColor} stopOpacity="0" />
          </radialGradient>
          <filter id="wvGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="wvSmogFilter">
            <feColorMatrix type="saturate" values="0.3" />
          </filter>
          <clipPath id="worldClip"><rect width="100" height="100" /></clipPath>
        </defs>

        <g clipPath="url(#worldClip)">
          {/* Sky */}
          <rect width="100" height="100" fill="url(#wvSky)" />

          {/* Stars — clear sky only */}
          {(current === 'Healthy' || current === 'Thriving') && (
            <AnimatePresence>
              {[[8,4],[14,9],[28,3],[42,7],[55,5],[68,3],[78,8],[90,6],[35,13],[62,11]].map(([sx, sy], i) => (
                <motion.circle key={i} cx={sx} cy={sy} r={0.4} fill="white"
                  initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.9, 0.3] }} exit={{ opacity: 0 }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </AnimatePresence>
          )}

          {/* Sun with halo */}
          <motion.g animate={{ opacity: cfg.sunOpacity }} transition={{ duration: 2.5 }}>
            <circle cx="82" cy="13" r="14" fill="url(#wvSun)" opacity={0.25} />
            <circle cx="82" cy="13" r="7" fill={cfg.sunColor} filter="url(#wvGlow)" />
            <circle cx="82" cy="13" r="5" fill="white" opacity={0.9} />
          </motion.g>

          {/* Clouds */}
          <Cloud cx={20} cy={12} scale={0.9} speed={28} delay={0} />
          <Cloud cx={55} cy={8}  scale={0.7} speed={35} delay={8} />
          <Cloud cx={80} cy={16} scale={1.1} speed={22} delay={4} />

          {/* Smog overlay */}
          <motion.rect width="100" height="100" fill="#706040"
            animate={{ opacity: cfg.smokeOpacity * 0.4 }} transition={{ duration: 2.5 }}
          />

          {/* Distant hills */}
          <motion.ellipse cx="15" cy="82" rx="28" ry="14"
            animate={{ fill: cfg.vegColor, opacity: 0.55 }} transition={{ duration: 2.5 }}
          />
          <motion.ellipse cx="88" cy="84" rx="22" ry="12"
            animate={{ fill: cfg.vegColor, opacity: 0.45 }} transition={{ duration: 2.5 }}
          />

          {/* City */}
          {BUILDINGS.map((b, i) => {
            const isCrisis = current === 'Crisis' || current === 'Stressed'
            const buildingFill = isCrisis ? '#1e1e2a' : '#162030'
            const winColor = cfg.showSolar ? '#50e080' : '#f0d050'
            return (
              <g key={i}>
                <motion.rect x={b.x} y={100 - b.h} width={b.w} height={b.h}
                  animate={{ fill: buildingFill }} transition={{ duration: 2.5 }} rx={0.5}
                />
                {/* Antenna */}
                <line x1={b.x + b.w / 2} x2={b.x + b.w / 2} y1={100 - b.h} y2={100 - b.h - 4} stroke="#2a2a3a" strokeWidth={0.6} />
                {/* Windows */}
                {Array.from({ length: Math.floor((b.h - 4) / 7) }).map((_, j) => (
                  <motion.rect
                    key={j}
                    x={b.x + 1.5} y={100 - b.h + 3 + j * 7} width={b.w - 3} height={3.5} rx={0.5}
                    animate={{ fill: winColor, opacity: cfg.showSolar ? 0.55 : 0.35 }}
                    transition={{ duration: 2.5 }}
                  />
                ))}
                {/* Rooftop solar */}
                {cfg.showSolar && <SolarArray x={b.x + 0.5} y={100 - b.h - 11} />}
              </g>
            )
          })}

          {/* Factories (Crisis/Stressed) */}
          {cfg.smokeOpacity > 0 && (
            <>
              <Factory x={27} h={24} smokeOpacity={cfg.smokeOpacity} />
              <Factory x={60} h={20} smokeOpacity={cfg.smokeOpacity * 0.7} />
            </>
          )}

          {/* Ground */}
          <motion.path
            d="M0,82 Q25,78 50,80 Q75,78 100,82 L100,100 L0,100 Z"
            animate={{ fill: cfg.groundColor }} transition={{ duration: 2.5 }}
          />

          {/* Trees */}
          {TREES_DATA.slice(0, visibleTrees).map((t, i) => (
            <Tree key={i} x={t.x} h={t.h} color={cfg.vegColor} delay={i * 0.25} />
          ))}

          {/* Butterflies (Healthy/Thriving) */}
          {cfg.showWildlife && (
            <>
              <Butterfly x={15} y={60} delay={0} />
              <Butterfly x={45} y={65} delay={1.5} />
              <Butterfly x={70} y={58} delay={3} />
            </>
          )}

          {/* Birds */}
          {cfg.showWildlife && (
            <>
              <Bird startX={-20} y={18} speed={10} delay={0} />
              <Bird startX={-20} y={24} speed={13} delay={3} />
              <Bird startX={-20} y={14} speed={16} delay={7} />
            </>
          )}

          {/* Water */}
          <motion.rect x="0" y="90" width="100" height="10" fill="url(#wvWater)"
            animate={{ opacity: 1 }} transition={{ duration: 2.5 }}
          />
          {/* Ripples */}
          {[8, 22, 38, 54, 70, 86].map((wx, i) => (
            <motion.ellipse key={i} cx={wx} cy={94} rx={5} ry={1.2}
              fill="none" stroke="white" strokeWidth={0.5} strokeOpacity={0.15}
              animate={{ rx: [3, 7, 3], strokeOpacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
            />
          ))}
          {/* Water shimmer lines */}
          {[12, 30, 50, 68, 85].map((wx, i) => (
            <motion.line key={i} x1={wx} x2={wx + 6} y1={92} y2={92}
              stroke="white" strokeWidth={0.7}
              animate={{ x1: [wx, wx + 3, wx], x2: [wx + 6, wx + 9, wx + 6], strokeOpacity: [0.1, 0.35, 0.1] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            />
          ))}
        </g>
      </svg>

      {/* State label */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          style={{ background: `${cfg.labelColor}18`, color: cfg.labelColor, border: `1px solid ${cfg.labelColor}35` }}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: cfg.labelColor }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {current}
        </motion.span>
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[oklch(10%_0.008_240)/70] to-transparent pointer-events-none" />
    </div>
  )
}
