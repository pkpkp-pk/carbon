'use client'

import { motion } from 'framer-motion'
import { WorldState, WORLD_STATE_COLORS } from '@/lib/world-state'
import { useEffect, useState } from 'react'

interface VirtualWorldProps {
  state: WorldState
}

const STATE_CONFIG = {
  Crisis: {
    skyTop: '#3d2a10',
    skyBot: '#6b3a1f',
    smokeOpacity: 0.8,
    vegColor: '#3d2a10',
    vegDensity: 0.2,
    waterColor: '#2a3d3d',
    label: 'Crisis',
    labelColor: '#ef4444',
    showSmog: true,
    showWildlife: false,
    showSolar: false,
  },
  Stressed: {
    skyTop: '#4a3d1a',
    skyBot: '#7a5c2a',
    smokeOpacity: 0.5,
    vegColor: '#4a5c2a',
    vegDensity: 0.4,
    waterColor: '#2a4a4a',
    label: 'Stressed',
    labelColor: '#f97316',
    showSmog: true,
    showWildlife: false,
    showSolar: false,
  },
  Recovering: {
    skyTop: '#1a3a4a',
    skyBot: '#2a5a7a',
    smokeOpacity: 0.2,
    vegColor: '#2a5c2a',
    vegDensity: 0.65,
    waterColor: '#1a4a6a',
    label: 'Recovering',
    labelColor: '#eab308',
    showSmog: false,
    showWildlife: false,
    showSolar: true,
  },
  Healthy: {
    skyTop: '#0c2d6e',
    skyBot: '#1a6aaf',
    smokeOpacity: 0,
    vegColor: '#1a7c1a',
    vegDensity: 0.8,
    waterColor: '#0a5a8a',
    label: 'Healthy',
    labelColor: '#4ade80',
    showSmog: false,
    showWildlife: true,
    showSolar: true,
  },
  Thriving: {
    skyTop: '#0a1f5c',
    skyBot: '#0e72c4',
    smokeOpacity: 0,
    vegColor: '#14a014',
    vegDensity: 1,
    waterColor: '#0870b0',
    label: 'Thriving',
    labelColor: '#34d399',
    showSmog: false,
    showWildlife: true,
    showSolar: true,
  },
}

// Animated Bird
function Bird({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g
      initial={{ x: -50, y }}
      animate={{ x: ['calc(-50px)', 'calc(110%)'] }}
      transition={{ duration: 8 + delay, repeat: Infinity, delay, ease: 'linear' }}
    >
      <motion.path
        d={`M${x},${y} Q${x + 8},${y - 5} ${x + 16},${y} Q${x + 24},${y - 5} ${x + 32},${y}`}
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.7"
        animate={{ d: [
          `M${x},${y} Q${x + 8},${y - 6} ${x + 16},${y} Q${x + 24},${y - 6} ${x + 32},${y}`,
          `M${x},${y} Q${x + 8},${y - 2} ${x + 16},${y} Q${x + 24},${y - 2} ${x + 32},${y}`,
        ]}}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </motion.g>
  )
}

// Animated tree
function Tree({ x, h, color, delay }: { x: number; h: number; color: string; delay: number }) {
  return (
    <motion.g
      animate={{ rotate: [-1, 1, -1] }}
      transition={{ duration: 3 + delay * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ transformOrigin: `${x}px 100%` }}
    >
      <rect x={x - 3} y={100 - h * 0.3} width={6} height={h * 0.3} fill="#5c3d1a" rx={2} />
      <motion.ellipse
        cx={x}
        cy={100 - h * 0.3}
        rx={h * 0.3}
        ry={h * 0.35}
        fill={color}
        animate={{ ry: [h * 0.35, h * 0.38, h * 0.35] }}
        transition={{ duration: 2 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.g>
  )
}

// Smoke stack
function SmokeStack({ x, opacity }: { x: number; opacity: number }) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={65} width={12} height={35} fill="#4a4a5a" rx={2} />
      <rect x={x + 14} y={72} width={8} height={28} fill="#3a3a4a" rx={2} />
      <motion.ellipse
        cx={x + 6}
        cy={60}
        rx={10}
        ry={10}
        fill="#808090"
        animate={{ cy: [60, 30], opacity: [0.6, 0], rx: [10, 20], ry: [10, 20] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.ellipse
        cx={x + 18}
        cy={68}
        rx={8}
        ry={8}
        fill="#909098"
        animate={{ cy: [68, 40], opacity: [0.5, 0], rx: [8, 15], ry: [8, 15] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
      />
    </g>
  )
}

// Solar panel on building
function SolarPanel({ x, y }: { x: number; y: number }) {
  return (
    <motion.g
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <rect x={x} y={y} width={14} height={8} rx={1} fill="#1a3a8a" stroke="#4a8af0" strokeWidth={0.5} />
      <line x1={x} x2={x + 14} y1={y + 4} y2={y + 4} stroke="#4a8af0" strokeWidth={0.5} />
      <line x1={x + 7} x2={x + 7} y1={y} y2={y + 8} stroke="#4a8af0" strokeWidth={0.5} />
    </motion.g>
  )
}

export default function VirtualWorld({ state }: VirtualWorldProps) {
  const [mounted, setMounted] = useState(false)
  const [prev, setPrev] = useState(state)
  const [current, setCurrent] = useState(state)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (state !== current) {
      setPrev(current)
      setCurrent(state)
    }
  }, [state])

  if (!mounted) return (
    <div className="w-full h-full bg-slate-900 animate-pulse rounded-xl flex items-center justify-center">
      <p className="text-slate-600 text-sm">Loading world...</p>
    </div>
  )

  const cfg = STATE_CONFIG[current]
  const trees = [10, 22, 34, 55, 67, 76, 88]
  const treeHeights = [22, 18, 25, 20, 23, 17, 21]

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: cfg.skyTop }} transition={{ duration: 2 }} />
            <motion.stop offset="100%" animate={{ stopColor: cfg.skyBot }} transition={{ duration: 2 }} />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: cfg.waterColor }} transition={{ duration: 2 }} />
            <motion.stop offset="100%" animate={{ stopColor: '#050f1a' }} transition={{ duration: 2 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <motion.rect width="100" height="100" fill="url(#skyGrad)" animate={{ opacity: 1 }} />

        {/* Smog overlay */}
        <motion.rect
          width="100" height="70"
          fill="#808060"
          animate={{ opacity: cfg.smokeOpacity * 0.35 }}
          transition={{ duration: 2 }}
        />

        {/* Sun */}
        <motion.circle
          cx="80" cy="14"
          animate={{
            r: cfg.smokeOpacity > 0.4 ? 3 : 7,
            opacity: cfg.smokeOpacity > 0.4 ? 0.3 : 0.95,
            fill: cfg.smokeOpacity > 0.4 ? '#c09020' : '#fffde0',
          }}
          filter="url(#glow)"
          transition={{ duration: 2 }}
        />

        {/* City silhouette */}
        <motion.g animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          {/* Buildings */}
          {[{x:5,w:10,h:28},{x:18,w:8,h:22},{x:28,w:12,h:35},{x:42,w:9,h:20},{x:53,w:11,h:30},{x:66,w:8,h:18},{x:76,w:10,h:25},{x:88,w:8,h:20}].map((b, i) => (
            <g key={i}>
              <motion.rect
                x={b.x} y={100 - b.h} width={b.w} height={b.h}
                animate={{ fill: current === 'Crisis' || current === 'Stressed' ? '#2a2a3a' : '#1a2a3a' }}
                transition={{ duration: 2 }}
              />
              {/* Windows */}
              {Array.from({ length: Math.floor(b.h / 6) }).map((_, j) => (
                <motion.rect
                  key={j}
                  x={b.x + 2} y={100 - b.h + 3 + j * 6} width={b.w - 4} height={3}
                  rx={0.5}
                  animate={{
                    fill: cfg.showSolar ? '#4af090' : '#f0d860',
                    opacity: cfg.showSolar ? 0.6 : 0.4
                  }}
                  transition={{ duration: 2 }}
                />
              ))}
              {/* Solar panels on rooftop */}
              {cfg.showSolar && <SolarPanel x={b.x + 1} y={100 - b.h - 9} />}
            </g>
          ))}

          {/* Factory smoke stacks — visible in Crisis/Stressed */}
          <SmokeStack x={30} opacity={cfg.smokeOpacity} />
          <SmokeStack x={62} opacity={cfg.smokeOpacity * 0.7} />
        </motion.g>

        {/* Mid-ground hills */}
        <motion.ellipse
          cx="25" cy="100" rx="35" ry="18"
          animate={{ fill: cfg.vegColor, ry: 18 + cfg.vegDensity * 5 }}
          transition={{ duration: 2 }}
        />
        <motion.ellipse
          cx="78" cy="100" rx="32" ry="15"
          animate={{ fill: cfg.vegColor }}
          transition={{ duration: 2 }}
        />

        {/* Trees */}
        {trees.slice(0, Math.ceil(trees.length * cfg.vegDensity)).map((x, i) => (
          <Tree
            key={i}
            x={x}
            h={treeHeights[i]}
            color={cfg.vegColor}
            delay={i * 0.2}
          />
        ))}

        {/* Wildlife (birds) */}
        {cfg.showWildlife && (
          <>
            <Bird x={5} y={20} delay={0} />
            <Bird x={5} y={28} delay={2.5} />
            <Bird x={5} y={15} delay={5} />
          </>
        )}

        {/* Water */}
        <motion.rect
          x="0" y="88" width="100" height="12"
          fill="url(#waterGrad)"
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        {/* Water shimmer */}
        {[10, 25, 40, 55, 70, 85].map((wx, i) => (
          <motion.line
            key={i}
            x1={wx} y1="91" x2={wx + 8} y2="91"
            stroke="white" strokeWidth="0.8" strokeOpacity="0.2"
            animate={{ x1: [wx, wx + 4, wx], x2: [wx + 8, wx + 12, wx + 8], strokeOpacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          />
        ))}

        {/* Stars (only in Healthy/Thriving — clear sky) */}
        {(current === 'Healthy' || current === 'Thriving') &&
          [[8,5],[15,10],[35,3],[60,8],[72,4],[90,7],[45,12]].map(([sx, sy], i) => (
            <motion.circle
              key={i}
              cx={sx} cy={sy} r={0.5}
              fill="white"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))
        }
      </svg>

      {/* Overlay labels */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: `${cfg.labelColor}20`, color: cfg.labelColor, border: `1px solid ${cfg.labelColor}40` }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[oklch(10%_0.008_240)] to-transparent pointer-events-none" />
    </div>
  )
}
