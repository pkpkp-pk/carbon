'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { WorldState } from '@/lib/world-state'
import { useEffect, useRef, useState } from 'react'

interface VirtualWorldProps { state: WorldState }

const CFG = {
  Crisis: {
    skyTop: '#1a0b00', skyBot: '#662200', sunCol: '#ff3300',
    mnt1: '#2a1100', mnt2: '#3b1800', mnt3: '#4d2000',
    ground: '#2a1a10', water: '#1a1005',
    tree: '#1a0d05', bldg: '#120800', win: '#ff2200',
    smoke: 0.9, smog: 0.7,
    hasNature: false, hasCars: true, hasFactories: true, hasTurbines: false
  },
  Stressed: {
    skyTop: '#332200', skyBot: '#886622', sunCol: '#ff9900',
    mnt1: '#3a2811', mnt2: '#4b3518', mnt3: '#5c4420',
    ground: '#332a1a', water: '#222a1a',
    tree: '#2d331a', bldg: '#1a1a1a', win: '#ffbb00',
    smoke: 0.5, smog: 0.4,
    hasNature: false, hasCars: true, hasFactories: true, hasTurbines: false
  },
  Recovering: {
    skyTop: '#002244', skyBot: '#226688', sunCol: '#ffee88',
    mnt1: '#113344', mnt2: '#1a4a5a', mnt3: '#226677',
    ground: '#1a3322', water: '#114466',
    tree: '#154422', bldg: '#152535', win: '#66ffcc',
    smoke: 0.1, smog: 0.1,
    hasNature: true, hasCars: true, hasFactories: false, hasTurbines: true
  },
  Healthy: {
    skyTop: '#003366', skyBot: '#3388cc', sunCol: '#ffffaa',
    mnt1: '#114466', mnt2: '#1a6688', mnt3: '#2288aa',
    ground: '#1a4422', water: '#1166aa',
    tree: '#156622', bldg: '#1a3a5a', win: '#88ffdd',
    smoke: 0, smog: 0,
    hasNature: true, hasCars: false, hasFactories: false, hasTurbines: true
  },
  Thriving: {
    skyTop: '#000a1f', skyBot: '#002244', sunCol: '#e0f0ff', // Night time thriving
    mnt1: '#001122', mnt2: '#001c3a', mnt3: '#002a55',
    ground: '#002211', water: '#004488',
    tree: '#003311', bldg: '#001122', win: '#aaffff',
    smoke: 0, smog: 0,
    hasNature: true, hasCars: false, hasFactories: false, hasTurbines: true
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 *  High-Detail SVG Components
 * ───────────────────────────────────────────────────────────────────────────── */

function OakTree({ x, y, scale, color }: { x:number; y:number; scale:number; color:string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 45,90 L 55,90 L 52,150 L 48,150 Z" fill="#2d1c10" />
      <path d="M 50,10 C 20,10 0,30 0,55 C 0,75 15,90 35,90 L 65,90 C 85,90 100,75 100,55 C 100,30 80,10 50,10 Z" fill={color} />
      <path d="M 50,20 C 30,20 15,35 15,55 C 15,70 25,80 40,80 L 60,80 C 75,80 85,70 85,55 C 85,35 70,20 50,20 Z" fill="#ffffff" opacity="0.08" />
    </g>
  )
}

function PineTree({ x, y, scale, color }: { x:number; y:number; scale:number; color:string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 45,120 L 55,120 L 55,150 L 45,150 Z" fill="#2d1c10" />
      <path d="M 50,0 L 90,50 L 70,50 L 100,90 L 80,90 L 110,130 L -10,130 L 20,90 L 0,90 L 30,50 L 10,50 Z" fill={color} />
      <path d="M 50,0 L 50,130 L -10,130 L 20,90 L 0,90 L 30,50 L 10,50 Z" fill="#ffffff" opacity="0.08" />
    </g>
  )
}

function Skyscraper({ x, y, scale, color, winColor }: { x:number; y:number; scale:number; color:string; winColor:string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 20,0 L 80,0 L 80,40 L 100,40 L 100,300 L 0,300 L 0,40 L 20,40 Z" fill={color} />
      <line x1="50" y1="0" x2="50" y2="-40" stroke={color} strokeWidth="3" />
      <circle cx="50" cy="-40" r="3" fill={winColor} opacity="0.8" />
      <g fill={winColor} opacity="0.4">
        {Array.from({length: 12}).map((_, i) => 
          <rect key={i} x="15" y={50 + i*20} width="70" height="8" />
        )}
      </g>
    </g>
  )
}

function House({ x, y, scale, color, winColor }: { x:number; y:number; scale:number; color:string; winColor:string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 0,50 L 50,0 L 100,50 L 100,120 L 0,120 Z" fill={color} />
      <path d="M 0,50 L 50,0 L 100,50 L 90,50 L 50,10 L 10,50 Z" fill="#000" opacity="0.2" />
      <rect x="40" y="70" width="20" height="50" fill={winColor} opacity="0.3" />
      <rect x="15" y="70" width="15" height="15" fill={winColor} opacity="0.5" />
      <rect x="70" y="70" width="15" height="15" fill={winColor} opacity="0.5" />
    </g>
  )
}

function Factory({ x, y, scale, color, smoke }: { x:number; y:number; scale:number; color:string; smoke:number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 0,100 L 0,40 L 30,20 L 30,40 L 60,20 L 60,40 L 90,20 L 90,100 Z" fill={color} />
      <rect x="70" y="-40" width="12" height="70" fill={color} />
      <rect x="25" y="-20" width="8" height="50" fill={color} />
      {smoke > 0 && (
        <g opacity={smoke}>
          {[0, 1.5, 3].map((delay, i) => (
            <motion.circle key={`s1-${i}`} cx="76" cy="-45" r="10" fill="#665544"
              animate={{ cy: [-45, -150], opacity: [0.6, 0], scale: [1, 3] }}
              transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeOut' }} />
          ))}
          {[0.5, 2.5, 4.5].map((delay, i) => (
            <motion.circle key={`s2-${i}`} cx="29" cy="-25" r="8" fill="#665544"
              animate={{ cy: [-25, -120], opacity: [0.6, 0], scale: [1, 2.5] }}
              transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeOut' }} />
          ))}
        </g>
      )}
      <rect x="20" y="60" width="50" height="40" fill="#ff4400" opacity="0.4" />
    </g>
  )
}

function WindTurbine({ x, y, scale }: { x:number; y:number; scale:number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 46,200 L 54,200 L 51.5,0 L 48.5,0 Z" fill="#a0b0c0" />
      <g transform="translate(50, 0)">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
          <ellipse cx="0" cy="-45" rx="3" ry="45" fill="#e0e8f0" />
          <ellipse cx="0" cy="-45" rx="3" ry="45" fill="#e0e8f0" transform="rotate(120)" />
          <ellipse cx="0" cy="-45" rx="3" ry="45" fill="#e0e8f0" transform="rotate(240)" />
          <circle cx="0" cy="0" r="5" fill="#8090a0" />
        </motion.g>
      </g>
    </g>
  )
}

function Bird({ x, y, scale, color, delay }: { x:number; y:number; scale:number; color:string; delay:number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const id = setInterval(() => setW(v=>(v+1)%2), 300); return ()=>clearInterval(id) }, [])
  const d = w === 0 
    ? "M 0,25 Q 25,0 50,25 Q 75,0 100,25 Q 70,20 50,40 Q 30,20 0,25 Z"
    : "M 0,25 Q 25,50 50,25 Q 75,50 100,25 Q 70,20 50,10 Q 30,20 0,25 Z"
  return (
    <motion.g animate={{ x: [-100, 1100] }} transition={{ duration: 15, repeat: Infinity, delay, ease: 'linear' }} style={{ y }}>
      <g transform={`scale(${scale})`}>
        <path d={d} fill={color} />
      </g>
    </motion.g>
  )
}

function Car({ x, y, scale, color, delay, direction }: { x:number; y:number; scale:number; color:string; delay:number; direction:1|-1 }) {
  return (
    <motion.g 
      initial={{ x: direction === 1 ? -100 : 1100 }}
      animate={{ x: direction === 1 ? 1100 : -100 }} 
      transition={{ duration: 8, repeat: Infinity, delay, ease: 'linear' }} 
      style={{ y }}
    >
      <g transform={`scale(${scale * direction}, ${scale}) translate(${direction === -1 ? -100 : 0}, 0)`}>
        <path d="M 0,30 L 15,10 L 60,10 L 75,30 L 100,30 L 100,60 L 0,60 Z" fill={color} />
        <circle cx="20" cy="60" r="14" fill="#111" />
        <circle cx="20" cy="60" r="6" fill="#888" />
        <circle cx="80" cy="60" r="14" fill="#111" />
        <circle cx="80" cy="60" r="6" fill="#888" />
        <path d="M 20,30 L 25,15 L 55,15 L 60,30 Z" fill="#fff" opacity="0.3" />
        <rect x="95" y="35" width="5" height="10" fill="#ffcc00" />
        <rect x="0" y="35" width="5" height="10" fill="#ff0000" />
      </g>
    </motion.g>
  )
}

function DetailedCloud({ x, y, scale, speed, delay, opacity }: { x:number; y:number; scale:number; speed:number; delay:number; opacity:number }) {
  return (
    <motion.g animate={{ x: [-200, 1200] }} transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }} style={{ y, opacity }}>
      <g transform={`scale(${scale})`}>
        <path d="M 30,40 C 30,15 55,5 75,20 C 95,-5 135,0 145,25 C 170,20 190,35 180,60 C 200,75 180,100 150,100 L 25,100 C 0,100 -10,70 10,50 C 0,35 15,10 30,40 Z" fill="#ffffff" />
      </g>
    </motion.g>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 *  Main Component
 * ───────────────────────────────────────────────────────────────────────────── */

export default function VirtualWorld({ state }: VirtualWorldProps) {
  const [mounted, setMounted] = useState(false)
  const [cur, setCur] = useState(state)
  const prev = useRef(state)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (state !== prev.current) { prev.current = state; setCur(state) } }, [state])

  if (!mounted) return (
    <div className="w-full h-full rounded-xl bg-[oklch(14%_0.01_240)] animate-pulse flex items-center justify-center">
      <p className="text-white/20 text-sm">Loading virtual environment…</p>
    </div>
  )

  const c = CFG[cur]
  const isNight = cur === 'Thriving'

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl select-none">
      <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" animate={{ stopColor: c.skyTop }} transition={{ duration: 2 }} />
            <motion.stop offset="100%" animate={{ stopColor: c.skyBot }} transition={{ duration: 2 }} />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor={c.sunCol} stopOpacity="0.8" />
            <stop offset="100%" stopColor={c.sunCol} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Sky */}
        <rect width="1000" height="500" fill="url(#skyGrad)" />

        {/* 1.5 Stars (Thriving/Night) */}
        <AnimatePresence>
          {isNight && Array.from({length: 40}).map((_, i) => (
            <motion.circle key={i}
              cx={Math.random() * 1000} cy={Math.random() * 250} r={Math.random() * 1.5 + 0.5} fill="#fff"
              initial={{ opacity: 0 }} animate={{ opacity: [0.1, 0.8, 0.1] }} exit={{ opacity: 0 }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }} />
          ))}
        </AnimatePresence>

        {/* 2. Sun / Moon */}
        <motion.g animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <circle cx="850" cy="120" r="80" fill="url(#sunGlow)" opacity={0.3} />
          <circle cx="850" cy="120" r="35" fill={c.sunCol} opacity={0.9} />
          <circle cx="850" cy="120" r="25" fill="#fff" opacity={0.9} />
          {isNight && (
            <g opacity={0.3} fill="#001133">
              <circle cx="840" cy="110" r="5" />
              <circle cx="860" cy="130" r="8" />
              <circle cx="835" cy="135" r="4" />
            </g>
          )}
        </motion.g>

        {/* 3. Clouds */}
        <DetailedCloud x={0} y={40} scale={0.8} speed={60} delay={0} opacity={0.15} />
        <DetailedCloud x={0} y={80} scale={1.2} speed={80} delay={-20} opacity={0.1} />
        <DetailedCloud x={0} y={20} scale={0.6} speed={50} delay={-40} opacity={0.2} />

        {/* Smog Overlay */}
        <motion.rect width="1000" height="500" fill="#554433"
          animate={{ opacity: c.smog }} transition={{ duration: 2 }} pointerEvents="none" />

        {/* 4. Mountains Back */}
        <motion.path d="M-100,500 L50,250 L200,320 L350,180 L550,280 L750,150 L950,300 L1100,500 Z"
          animate={{ fill: c.mnt1 }} transition={{ duration: 2 }} />
        
        {/* 5. Mountains Mid */}
        <motion.path d="M-100,500 Q150,280 300,350 T700,300 T1100,500 Z"
          animate={{ fill: c.mnt2 }} transition={{ duration: 2 }} />

        {/* 6. Cityscape & Wind Turbines */}
        <motion.g animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          {c.hasTurbines && (
            <>
              <WindTurbine x={150} y={200} scale={0.6} />
              <WindTurbine x={350} y={220} scale={0.5} />
              <WindTurbine x={650} y={180} scale={0.7} />
            </>
          )}
          <House x={50} y={320} scale={0.5} color={c.bldg} winColor={c.win} />
          <Skyscraper x={200} y={160} scale={0.8} color={c.bldg} winColor={c.win} />
          <Skyscraper x={280} y={120} scale={1.1} color={c.bldg} winColor={c.win} />
          <House x={380} y={340} scale={0.4} color={c.bldg} winColor={c.win} />
          <Skyscraper x={750} y={180} scale={0.9} color={c.bldg} winColor={c.win} />
          <House x={850} y={330} scale={0.6} color={c.bldg} winColor={c.win} />
          {c.hasFactories && (
            <>
              <Factory x={450} y={260} scale={0.8} color={c.bldg} smoke={c.smoke} />
              <Factory x={600} y={280} scale={0.6} color={c.bldg} smoke={c.smoke} />
            </>
          )}
        </motion.g>

        {/* 7. Mountains Front / Ground Base */}
        <motion.path d="M-100,500 Q200,360 500,400 T1100,500 Z"
          animate={{ fill: c.mnt3 }} transition={{ duration: 2 }} />

        {/* 8. Trees Back Layer */}
        {c.hasNature && (
          <motion.g animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <PineTree x={80} y={280} scale={0.5} color={c.tree} />
            <OakTree x={150} y={300} scale={0.4} color={c.tree} />
            <PineTree x={420} y={290} scale={0.6} color={c.tree} />
            <OakTree x={500} y={310} scale={0.5} color={c.tree} />
            <PineTree x={700} y={270} scale={0.4} color={c.tree} />
            <OakTree x={880} y={320} scale={0.5} color={c.tree} />
          </motion.g>
        )}

        {/* 9. River / Road */}
        {c.hasCars ? (
          // Road
          <motion.path d="M-100,480 Q400,430 1100,460 L1100,520 L-100,520 Z"
            animate={{ fill: '#1a1a1a' }} transition={{ duration: 2 }} />
        ) : (
          // River
          <motion.path d="M-100,480 Q400,430 1100,460 L1100,520 L-100,520 Z"
            animate={{ fill: c.water }} transition={{ duration: 2 }} />
        )}

        {/* 10. Vehicles & Animals */}
        {c.hasNature && (
          <>
            <Bird x={0} y={150} scale={0.2} color={c.bldg} delay={0} />
            <Bird x={0} y={180} scale={0.15} color={c.bldg} delay={3} />
            <Bird x={0} y={120} scale={0.25} color={c.bldg} delay={7} />
          </>
        )}
        {c.hasCars && (
          <>
            <Car x={0} y={430} scale={0.4} color="#ff3333" delay={0} direction={1} />
            <Car x={0} y={450} scale={0.5} color="#445566" delay={3} direction={-1} />
            <Car x={0} y={440} scale={0.45} color="#ddaa00" delay={5} direction={1} />
          </>
        )}

        {/* 11. Foreground Ground & Trees */}
        <motion.path d="M-100,500 Q300,460 1100,500 Z"
          animate={{ fill: c.ground }} transition={{ duration: 2 }} />
          
        {/* Big foreground trees for framing */}
        <motion.g animate={{ fill: c.tree }} transition={{ duration: 2 }}>
          <OakTree x={-20} y={280} scale={1.2} color={c.tree} />
          <PineTree x={850} y={220} scale={1.5} color={c.tree} />
          <PineTree x={950} y={260} scale={1.1} color={c.tree} />
        </motion.g>

      </svg>

      {/* State badge */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <motion.span key={cur} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-xl"
          style={{ background:`${c.win}18`, color:c.win, border:`1px solid ${c.win}40` }}>
          <motion.span className="h-2 w-2 rounded-full" style={{ backgroundColor:c.win, boxShadow: `0 0 8px ${c.win}` }}
            animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.5, repeat:Infinity }} />
          {cur}
        </motion.span>
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[oklch(10%_0.008_240)/80] to-transparent pointer-events-none" />
    </div>
  )
}
