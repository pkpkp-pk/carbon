'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { WorldState } from '@/lib/world-state'
import { useEffect, useRef, useState } from 'react'

interface VirtualWorldProps { state: WorldState }

const CFG = {
  Crisis:    { skyTop:'#110800', skyBot:'#4a1f08', ground:'#1e0f04', ground2:'#2e1808', vegColor:'#1e0e04', vegDensity:0.12, waterTop:'#121e1e', waterBot:'#04080a', smokeOp:0.95, sunOp:0.1, sunColor:'#7a4010', labelColor:'#ef4444', showWildlife:false, showSolar:false, showRain:true, showSmog:true },
  Stressed:  { skyTop:'#1e1504', skyBot:'#6a4410', ground:'#221a08', ground2:'#302410', vegColor:'#2e3a10', vegDensity:0.35, waterTop:'#162a2a', waterBot:'#061010', smokeOp:0.55, sunOp:0.4,  sunColor:'#b08010', labelColor:'#f97316', showWildlife:false, showSolar:false, showRain:false, showSmog:true },
  Recovering:{ skyTop:'#091828', skyBot:'#124060', ground:'#101e0c', ground2:'#182c12', vegColor:'#1a3e1a', vegDensity:0.58, waterTop:'#0c2e48', waterBot:'#030c14', smokeOp:0.12, sunOp:0.72, sunColor:'#e8d040', labelColor:'#eab308', showWildlife:false, showSolar:true,  showRain:false, showSmog:false },
  Healthy:   { skyTop:'#081650', skyBot:'#0c4e8a', ground:'#0c2a0e', ground2:'#103614', vegColor:'#126a12', vegDensity:0.82, waterTop:'#083e6a', waterBot:'#030a14', smokeOp:0,    sunOp:0.92, sunColor:'#fff4d0', labelColor:'#4ade80', showWildlife:true,  showSolar:true,  showRain:false, showSmog:false },
  Thriving:  { skyTop:'#04093a', skyBot:'#085caa', ground:'#064010', ground2:'#0a5a14', vegColor:'#0c9a10', vegDensity:1.0,  waterTop:'#0678b8', waterBot:'#020814', smokeOp:0,    sunOp:1.0,  sunColor:'#fff9e8', labelColor:'#34d399', showWildlife:true,  showSolar:true,  showRain:false, showSmog:false },
}

/* ─── Sub-components ─────────────────────────────────────── */

function RainDrop({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.line x1={x} x2={x - 1} y1={0} y2={6}
      stroke="#5a8aaa" strokeWidth={0.5} strokeOpacity={0.5}
      animate={{ y: [-10, 110], opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay, ease: 'linear' }}
    />
  )
}

function Cloud({ x, y, s, speed, delay, opacity = 0.14 }: { x:number; y:number; s:number; speed:number; delay:number; opacity?:number }) {
  return (
    <motion.g animate={{ x: [x - 120, 130] }} transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }} style={{ opacity }}>
      <ellipse cx={0} cy={y} rx={22*s} ry={8*s} fill="white" />
      <ellipse cx={-10*s} cy={y-5*s} rx={12*s} ry={7*s} fill="white" />
      <ellipse cx={10*s} cy={y-4*s} rx={10*s} ry={6*s} fill="white" />
      <ellipse cx={-20*s} cy={y-1*s} rx={7*s} ry={5*s} fill="white" />
      <ellipse cx={20*s} cy={y-1*s} rx={8*s} ry={5*s} fill="white" />
    </motion.g>
  )
}

// Deciduous tree — round multi-layered canopy
function TreeRound({ x, h, c, delay }: { x:number; h:number; c:string; delay:number }) {
  const trunkH = h * 0.3
  const canY = 100 - h
  const r = h * 0.28
  return (
    <motion.g style={{ transformOrigin:`${x}px 100%` }}
      animate={{ rotate:[-0.7, 0.7] }}
      transition={{ duration: 3 + delay*0.5, repeat:Infinity, ease:'easeInOut', delay, repeatType:'mirror' }}>
      {/* Shadow on ground */}
      <ellipse cx={x+3} cy={99} rx={r*0.9} ry={2} fill="black" opacity={0.15} />
      {/* Trunk */}
      <rect x={x-2.5} y={100-trunkH} width={5} height={trunkH} rx={2} fill="#3a2208" />
      {/* Trunk texture */}
      <line x1={x-1} x2={x-1} y1={100-trunkH+2} y2={100-trunkH/2} stroke="#2a1804" strokeWidth={0.6} opacity={0.5} />
      {/* Bottom canopy shadow */}
      <ellipse cx={x+1} cy={canY+r*0.4} rx={r*1.1} ry={r*0.9} fill={c} opacity={0.45} />
      {/* Main canopy */}
      <motion.ellipse cx={x} cy={canY} rx={r} ry={r*1.05} fill={c}
        animate={{ ry:[r*1.05, r*1.15, r*1.05] }}
        transition={{ duration:2+delay*0.4, repeat:Infinity, ease:'easeInOut', delay, repeatType:'mirror' }} />
      {/* Top highlight */}
      <ellipse cx={x-r*0.22} cy={canY-r*0.25} rx={r*0.35} ry={r*0.25} fill="white" opacity={0.07} />
      {/* Tiny top tuft */}
      <ellipse cx={x} cy={canY-r*0.8} rx={r*0.45} ry={r*0.38} fill={c} />
    </motion.g>
  )
}

// Pine tree — triangular stacked layers
function TreePine({ x, h, c, delay }: { x:number; h:number; c:string; delay:number }) {
  const w = h * 0.55
  return (
    <motion.g style={{ transformOrigin:`${x}px 100%` }}
      animate={{ rotate:[-0.5, 0.5] }}
      transition={{ duration:4+delay*0.3, repeat:Infinity, ease:'easeInOut', delay, repeatType:'mirror' }}>
      <ellipse cx={x+2} cy={99.5} rx={w*0.45} ry={1.5} fill="black" opacity={0.12} />
      {/* Trunk */}
      <rect x={x-1.5} y={100-h*0.2} width={3} height={h*0.2} rx={1} fill="#4a2a0a" />
      {/* 4 stacked triangular layers */}
      {[0,1,2,3].map(i => {
        const layerW = w * (1 - i * 0.18)
        const layerY = 100 - h*0.18 - i * h * 0.22
        return (
          <motion.polygon key={i}
            points={`${x},${layerY - h*0.28 + i*2} ${x - layerW/2},${layerY} ${x + layerW/2},${layerY}`}
            fill={c}
            animate={{ scaleX:[1, 1.03, 1] }}
            transition={{ duration:2.5+i*0.3, repeat:Infinity, ease:'easeInOut', delay:delay+i*0.2, repeatType:'mirror' }}
          />
        )
      })}
      {/* Snow on top (Thriving) */}
      <ellipse cx={x} cy={100-h*0.9} rx={w*0.12} ry={2} fill="white" opacity={0.15} />
    </motion.g>
  )
}

// Dead tree (Crisis)
function TreeDead({ x, h }: { x:number; h:number }) {
  return (
    <g>
      <rect x={x-2} y={100-h} width={4} height={h} rx={1.5} fill="#2a1808" />
      {/* Gnarled branches */}
      <line x1={x} x2={x-h*0.3} y1={100-h*0.7} y2={100-h*0.9} stroke="#2a1808" strokeWidth={2} strokeLinecap="round" />
      <line x1={x} x2={x+h*0.25} y1={100-h*0.6} y2={100-h*0.82} stroke="#2a1808" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={x-h*0.3} x2={x-h*0.42} y1={100-h*0.9} y2={100-h} stroke="#2a1808" strokeWidth={1} strokeLinecap="round" />
    </g>
  )
}

// Bush / shrub
function Bush({ x, y, r, c }: { x:number; y:number; r:number; c:string }) {
  return (
    <g>
      <ellipse cx={x} cy={y+r*0.3} rx={r*1.3} ry={r*0.55} fill={c} opacity={0.4} />
      <ellipse cx={x-r*0.4} cy={y} rx={r*0.7} ry={r*0.6} fill={c} />
      <ellipse cx={x+r*0.4} cy={y} rx={r*0.65} ry={r*0.55} fill={c} />
      <ellipse cx={x} cy={y-r*0.1} rx={r*0.8} ry={r*0.6} fill={c} />
      <ellipse cx={x} cy={y-r*0.4} rx={r*0.4} ry={r*0.35} fill={c} />
    </g>
  )
}

// Flower patch
function FlowerPatch({ x, y, color }: { x:number; y:number; color:string }) {
  const petals = [[-2,0],[2,0],[0,-2],[0,2],[-1.4,-1.4],[1.4,-1.4],[-1.4,1.4],[1.4,1.4]]
  return (
    <motion.g animate={{ rotate:[-2, 2] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut', repeatType:'mirror' }}
      style={{ transformOrigin:`${x}px ${y}px` }}>
      {petals.map(([dx,dy],i) => (
        <ellipse key={i} cx={x+dx} cy={y+dy} rx={1} ry={0.6} fill={color} opacity={0.8} />
      ))}
      <circle cx={x} cy={y} r={0.9} fill="#f0e060" />
      <line x1={x} x2={x} y1={y+0.9} y2={y+3} stroke="#2a6a10" strokeWidth={0.5} />
    </motion.g>
  )
}

// Grass blades
function GrassPatch({ x, y }: { x:number; y:number }) {
  return (
    <g>
      {[-2,-1,0,1,2].map((dx,i) => (
        <motion.line key={i}
          x1={x+dx*1.2} x2={x+dx*1.2 - 1 + i*0.3} y1={y} y2={y-3-i*0.3}
          stroke="#1a5010" strokeWidth={0.6} strokeLinecap="round"
          animate={{ x2:[x+dx*1.2-1+i*0.3, x+dx*1.2+0.5+i*0.2, x+dx*1.2-1+i*0.3] }}
          transition={{ duration:1.8+i*0.3, repeat:Infinity, ease:'easeInOut', delay:i*0.2, repeatType:'mirror' }}
        />
      ))}
    </g>
  )
}

// Mountain / distant ridge
function Mountains({ c1, c2 }: { c1:string; c2:string }) {
  return (
    <g opacity={0.6}>
      <path d="M0,72 L12,52 L24,68 L35,48 L48,65 L60,44 L72,62 L85,50 L100,66 L100,72 Z" fill={c1} />
      <path d="M0,74 L8,60 L18,70 L30,56 L42,70 L55,58 L68,68 L80,55 L95,68 L100,72 L100,74 Z" fill={c2} />
      {/* Snow caps on higher peaks */}
      <path d="M35,48 L38,54 L32,54 Z" fill="white" opacity={0.4} />
      <path d="M60,44 L63,51 L57,51 Z" fill="white" opacity={0.4} />
    </g>
  )
}

// Deer (Healthy / Thriving)
function Deer({ x, y, delay }: { x:number; y:number; delay:number }) {
  return (
    <motion.g
      animate={{ x:[x, x+8, x+16, x+12, x] }}
      transition={{ duration:12, repeat:Infinity, delay, ease:'easeInOut' }}>
      {/* Body */}
      <ellipse cx={0} cy={y} rx={4} ry={2.5} fill="#c08040" />
      {/* Head */}
      <circle cx={4.5} cy={y-2.5} r={2} fill="#c08040" />
      {/* Ear */}
      <ellipse cx={5.8} cy={y-4} rx={0.7} ry={1.2} fill="#c07030" />
      {/* Legs */}
      <line x1={-2} x2={-2.5} y1={y+2.5} y2={y+5.5} stroke="#a06030" strokeWidth={0.8} strokeLinecap="round" />
      <line x1={0} x2={0.5} y1={y+2.5} y2={y+5.5} stroke="#a06030" strokeWidth={0.8} strokeLinecap="round" />
      <line x1={2} x2={1.5} y1={y+2.5} y2={y+5.5} stroke="#a06030" strokeWidth={0.8} strokeLinecap="round" />
      <line x1={4} x2={4.5} y1={y+2} y2={y+5.5} stroke="#a06030" strokeWidth={0.8} strokeLinecap="round" />
      {/* Antlers */}
      <line x1={4.5} x2={3.5} y1={y-4.5} y2={y-7} stroke="#8a5020" strokeWidth={0.6} />
      <line x1={3.5} x2={2.5} y1={y-6} y2={y-7.5} stroke="#8a5020" strokeWidth={0.5} />
      <line x1={3.5} x2={4.5} y1={y-6} y2={y-7.5} stroke="#8a5020" strokeWidth={0.5} />
      {/* Tail */}
      <ellipse cx={-4.2} cy={y-0.5} rx={1.2} ry={0.8} fill="white" />
    </motion.g>
  )
}

// Rabbit
function Rabbit({ x, y, delay }: { x:number; y:number; delay:number }) {
  return (
    <motion.g
      animate={{ x:[x, x+3, x] }}
      transition={{ duration:4, repeat:Infinity, delay, ease:'easeInOut' }}>
      <ellipse cx={0} cy={y} rx={2.5} ry={2} fill="#d0c0a8" />
      <circle cx={1.5} cy={y-2.2} r={1.5} fill="#d0c0a8" />
      {/* Ears */}
      <ellipse cx={0.8} cy={y-4.2} rx={0.5} ry={1.8} fill="#d0c0a8" />
      <ellipse cx={0.8} cy={y-4.2} rx={0.25} ry={1.4} fill="#f0a0a0" />
      <ellipse cx={2.2} cy={y-4} rx={0.5} ry={1.8} fill="#d0c0a8" />
      <ellipse cx={2.2} cy={y-4} rx={0.25} ry={1.4} fill="#f0a0a0" />
      {/* Eye */}
      <circle cx={2.2} cy={y-2.5} r={0.35} fill="#1a0808" />
      {/* Nose */}
      <ellipse cx={2.8} cy={y-1.9} rx={0.3} ry={0.2} fill="#f08080" />
      {/* Tail */}
      <circle cx={-2.2} cy={y-0.5} r={0.8} fill="white" />
      {/* Legs */}
      <motion.g animate={{ y:[0, -0.5, 0] }} transition={{ duration:1.5, repeat:Infinity, delay }}>
        <line x1={-1} x2={-1.5} y1={y+2} y2={y+4} stroke="#c0b098" strokeWidth={0.6} />
        <line x1={1} x2={1.5} y1={y+2} y2={y+4} stroke="#c0b098" strokeWidth={0.6} />
      </motion.g>
    </motion.g>
  )
}

// Jumping fish
function Fish({ x, delay }: { x:number; delay:number }) {
  return (
    <motion.g
      animate={{ y:[0,-15,0], x:[x, x+3, x+6], rotate:[0,-30,0] }}
      transition={{ duration:2.5, repeat:Infinity, delay, ease:'easeInOut', repeatDelay:4 }}
      style={{ y:0 }}>
      <ellipse cx={0} cy={0} rx={4} ry={1.8} fill="#4090e0" />
      <path d="M4,0 L7,-2 L7,2 Z" fill="#3070c0" />
      <circle cx={-2} cy={-0.3} r={0.5} fill="white" />
      <circle cx={-2.1} cy={-0.4} r={0.25} fill="#101810" />
    </motion.g>
  )
}

// Firefly glow (Thriving night)
function Firefly({ x, y, delay }: { x:number; y:number; delay:number }) {
  return (
    <motion.g
      animate={{ x:[x, x+5, x+2, x-3, x], y:[y, y-4, y+3, y-2, y] }}
      transition={{ duration:5, repeat:Infinity, delay, ease:'easeInOut' }}>
      <motion.circle cx={0} cy={0} r={1.2} fill="#c0ff40"
        animate={{ opacity:[0, 0.9, 0], r:[0.8, 1.4, 0.8] }}
        transition={{ duration:1.2, repeat:Infinity, delay, ease:'easeInOut' }} />
      <motion.circle cx={0} cy={0} r={3} fill="#80ff00" opacity={0}
        animate={{ opacity:[0, 0.3, 0], r:[2, 5, 2] }}
        transition={{ duration:1.2, repeat:Infinity, delay, ease:'easeInOut' }} />
    </motion.g>
  )
}

// Bird V-silhouette
function Bird({ x, y, speed, delay }: { x:number; y:number; speed:number; delay:number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const id = setInterval(() => setW(v=>(v+1)%2), 350); return ()=>clearInterval(id) }, [])
  const d = w === 0 ? 'M0,0 Q5,-4 10,0 Q15,-4 20,0' : 'M0,0 Q5,-1 10,0 Q15,-1 20,0'
  return (
    <motion.g animate={{ x:[x-20, 130] }} transition={{ duration:speed, repeat:Infinity, delay, ease:'linear', repeatDelay:2 }} style={{y}}>
      <path d={d} stroke="rgba(255,255,255,0.55)" strokeWidth={1.2} fill="none" />
    </motion.g>
  )
}

// Butterfly
function Butterfly({ x, y, delay }: { x:number; y:number; delay:number }) {
  const colors = ['#ff80ff','#80ffff','#ffff60','#ff9040']
  const c = colors[Math.floor(delay) % colors.length]
  return (
    <motion.g
      animate={{ x:[x, x+8, x+3, x+12, x], y:[y, y-5, y+3, y-2, y] }}
      transition={{ duration:6, repeat:Infinity, delay, ease:'easeInOut' }}>
      <motion.g animate={{ scaleX:[1,-1,1] }} transition={{ duration:0.6, repeat:Infinity, delay }}>
        <ellipse cx={-3} cy={0} rx={4.5} ry={3} fill={c} opacity={0.7} />
        <ellipse cx={-2.5} cy={2.5} rx={3} ry={2.2} fill={c} opacity={0.55} />
        <ellipse cx={3} cy={0} rx={4.5} ry={3} fill={c} opacity={0.7} />
        <ellipse cx={2.5} cy={2.5} rx={3} ry={2.2} fill={c} opacity={0.55} />
      </motion.g>
      {/* Body */}
      <ellipse cx={0} cy={1} rx={0.6} ry={3} fill="#2a1a08" />
      {/* Antennae */}
      <line x1={0} x2={-2} y1={-2} y2={-5} stroke="#2a1a08" strokeWidth={0.4} />
      <line x1={0} x2={2} y1={-2} y2={-5} stroke="#2a1a08" strokeWidth={0.4} />
      <circle cx={-2} cy={-5} r={0.4} fill="#2a1a08" />
      <circle cx={2} cy={-5} r={0.4} fill="#2a1a08" />
    </motion.g>
  )
}

// Wind turbine
function WindTurbine({ x }: { x:number }) {
  return (
    <g>
      {/* Tower */}
      <path d={`M${x-1.5},100 L${x+1.5},100 L${x+0.8},62 L${x-0.8},62 Z`} fill="#c8d0d8" />
      {/* Nacelle */}
      <rect x={x-2.5} y={59} width={5} height={3} rx={1} fill="#b0b8c0" />
      {/* Blades */}
      <motion.g style={{ transformOrigin:`${x}px 60px` }}
        animate={{ rotate:[0, 360] }}
        transition={{ duration:5, repeat:Infinity, ease:'linear' }}>
        <ellipse cx={x} cy={52} rx={1.2} ry={8} fill="#d0d8e0" opacity={0.9} />
        <ellipse cx={x} cy={52} rx={1.2} ry={8} fill="#d0d8e0" opacity={0.9} transform={`rotate(120 ${x} 60)`} />
        <ellipse cx={x} cy={52} rx={1.2} ry={8} fill="#d0d8e0" opacity={0.9} transform={`rotate(240 ${x} 60)`} />
        <circle cx={x} cy={60} r={1.5} fill="#a0a8b0" />
      </motion.g>
    </g>
  )
}

// Solar panel on building
function SolarArray({ x, y }: { x:number; y:number }) {
  return (
    <motion.g animate={{ opacity:[0.6, 1, 0.6] }} transition={{ duration:3, repeat:Infinity }}>
      <rect x={x} y={y} width={16} height={9} rx={1} fill="#0a2060" stroke="#2050e0" strokeWidth={0.35} />
      <line x1={x} x2={x+16} y1={y+4.5} y2={y+4.5} stroke="#2050e0" strokeWidth={0.35} />
      {[5.3, 10.6].map((dx,i) => <line key={i} x1={x+dx} x2={x+dx} y1={y} y2={y+9} stroke="#2050e0" strokeWidth={0.35} />)}
      <motion.ellipse cx={x+3} cy={y+2} rx={2} ry={1} fill="white" opacity={0}
        animate={{ opacity:[0, 0.5, 0] }} transition={{ duration:2, repeat:Infinity, delay:1.5 }} />
    </motion.g>
  )
}

// Factory
function Factory({ x, h, op }: { x:number; h:number; op:number }) {
  const chimneyPositions = [{ cx: x+3, cy: 60 }, { cx: x+18, cy: 67 }]
  return (
    <g>
      <rect x={x} y={100-h} width={14} height={h} fill="#181820" rx={0.5} />
      <rect x={x+15} y={100-h*0.65} width={9} height={h*0.65} fill="#141418" rx={0.5} />
      {/* Windows - dark red lit */}
      {Array.from({length:3}).map((_,i) => (
        <rect key={i} x={x+2} y={100-h+4+i*7} width={10} height={4} rx={0.5} fill="#c03020" opacity={0.35} />
      ))}
      {/* Chimneys */}
      <rect x={x+2} y={100-h-12} width={4} height={12} fill="#282830" />
      <rect x={x+16} y={100-h*0.65-9} width={3} height={9} fill="#202028" />
      {/* Smoke puffs */}
      {op > 0 && chimneyPositions.map((p, i) => (
        <g key={i} opacity={op}>
          {[0,1.5,3].map((delay,j) => (
            <motion.ellipse key={j} cx={p.cx} cy={p.cy}
              rx={5+j*2} ry={5+j*2} fill="#606070"
              animate={{ cy:[p.cy, p.cy-28], opacity:[0.5,0], rx:[4,14+j*3], ry:[4,14+j*3] }}
              transition={{ duration:3.5, repeat:Infinity, delay, ease:'easeOut' }}
            />
          ))}
        </g>
      ))}
    </g>
  )
}

// Lily pad
function LilyPad({ x, y }: { x:number; y:number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={3} ry={2} fill="#1a6010" opacity={0.8} />
      <path d={`M${x},${y} L${x},${y-2}`} stroke="#1a6010" strokeWidth={0.5} />
      {/* Flower */}
      {[0,72,144,216,288].map((rot,i) => (
        <ellipse key={i} cx={x} cy={y-2.5} rx={0.7} ry={0.4} fill="#f0a0a0" opacity={0.9}
          transform={`rotate(${rot} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y-2.5} r={0.4} fill="#ffe060" />
    </g>
  )
}

/* ─── Main Component ─────────────────────────────────────── */

const BUILDINGS = [
  {x:1, w:11,h:35},{x:14,w:8,h:26},{x:23,w:13,h:42},{x:38,w:9,h:23},
  {x:49,w:12,h:36},{x:63,w:8,h:21},{x:73,w:11,h:30},{x:86,w:10,h:24}
]

export default function VirtualWorld({ state }: VirtualWorldProps) {
  const [mounted, setMounted] = useState(false)
  const [cur, setCur] = useState(state)
  const prev = useRef(state)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (state !== prev.current) { prev.current = state; setCur(state) } }, [state])

  if (!mounted) return (
    <div className="w-full h-full rounded-xl bg-[oklch(14%_0.01_240)] animate-pulse flex items-center justify-center">
      <p className="text-white/20 text-sm">Loading world…</p>
    </div>
  )

  const c = CFG[cur]
  const isCrisis = cur === 'Crisis'
  const isStressed = cur === 'Stressed'
  const isDark = isCrisis || isStressed
  const isBright = cur === 'Healthy' || cur === 'Thriving'
  const isThriving = cur === 'Thriving'
  const treeDensity = c.vegDensity

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl select-none">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <linearGradient id="vwSky" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%"   animate={{ stopColor: c.skyTop }} transition={{ duration:2.5 }} />
            <motion.stop offset="100%" animate={{ stopColor: c.skyBot }} transition={{ duration:2.5 }} />
          </linearGradient>
          <linearGradient id="vwWater" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%"   animate={{ stopColor: c.waterTop }} transition={{ duration:2.5 }} />
            <motion.stop offset="100%" animate={{ stopColor: c.waterBot }} transition={{ duration:2.5 }} />
          </linearGradient>
          <linearGradient id="vwGround" x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%"   animate={{ stopColor: c.ground  }} transition={{ duration:2.5 }} />
            <motion.stop offset="100%" animate={{ stopColor: c.ground2 }} transition={{ duration:2.5 }} />
          </linearGradient>
          <radialGradient id="vwSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="white"    stopOpacity="1" />
            <stop offset="55%"  stopColor={c.sunColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={c.sunColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vwMoon" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#e8f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#8090c0" stopOpacity="0" />
          </radialGradient>
          <filter id="vwGlow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="vwSoftGlow">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="vwClip"><rect width="100" height="100"/></clipPath>
        </defs>

        <g clipPath="url(#vwClip)">
          {/* ── Sky ── */}
          <rect width="100" height="100" fill="url(#vwSky)" />

          {/* Stars */}
          {isBright && [[6,4],[13,8],[27,3],[40,6],[53,4],[67,3],[76,7],[88,5],[34,12],[61,10],[48,2],[82,11]].map(([sx,sy],i) => (
            <motion.circle key={i} cx={sx} cy={sy} r={0.4} fill="white"
              animate={{ opacity:[0.2, 0.9, 0.2] }}
              transition={{ duration:2+i*0.35, repeat:Infinity, delay:i*0.45 }} />
          ))}

          {/* Moon (Thriving) */}
          {isThriving && (
            <g filter="url(#vwGlow)">
              <circle cx="15" cy="12" r="12" fill="url(#vwMoon)" opacity={0.4} />
              <circle cx="15" cy="12" r="6" fill="#d8e8ff" opacity={0.9} />
              {/* Craters */}
              <circle cx="12" cy="11" r="1.2" fill="#c0d0ef" opacity={0.5} />
              <circle cx="17" cy="14" r="0.8" fill="#c0d0ef" opacity={0.4} />
            </g>
          )}

          {/* Sun */}
          <motion.g animate={{ opacity: c.sunOp }} transition={{ duration:2.5 }}>
            <circle cx="82" cy="13" r="16" fill="url(#vwSun)" opacity={0.2} />
            <circle cx="82" cy="13" r="8" fill={c.sunColor} filter="url(#vwGlow)" opacity={0.9} />
            <circle cx="82" cy="13" r="5.5" fill="white" opacity={0.9} />
          </motion.g>

          {/* Rainbow (Recovering) */}
          {cur === 'Recovering' && (
            <motion.g animate={{ opacity:[0.15, 0.28, 0.15] }} transition={{ duration:5, repeat:Infinity }}>
              {['#ff4444','#ff8800','#ffee00','#44dd44','#2288ff','#6644ff'].map((col,i) => (
                <path key={i}
                  d={`M${5+i*2},75 Q50,${40-i*3} ${95-i*2},75`}
                  fill="none" stroke={col} strokeWidth={1.8} opacity={0.7-i*0.08} />
              ))}
            </motion.g>
          )}

          {/* Clouds */}
          <Cloud x={10} y={10} s={0.8} speed={30} delay={0} opacity={isDark ? 0.06 : 0.14} />
          <Cloud x={50} y={7}  s={0.6} speed={38} delay={9} opacity={isDark ? 0.04 : 0.1} />
          <Cloud x={85} y={14} s={1.0} speed={24} delay={5} opacity={isDark ? 0.05 : 0.12} />

          {/* Smog */}
          <motion.rect width="100" height="100" fill="#706050"
            animate={{ opacity: c.smokeOp * 0.38 }} transition={{ duration:2.5 }} />

          {/* Rain */}
          {c.showRain && Array.from({length:20}).map((_,i) => (
            <RainDrop key={i} x={i*5+2} delay={i*0.12} />
          ))}

          {/* ── Mountains ── */}
          <motion.g animate={{ opacity: isDark ? 0.3 : 0.55 }} transition={{ duration:2.5 }}>
            <Mountains c1={isDark ? '#1e1208' : '#142010'} c2={isDark ? '#160e06' : '#0e1808'} />
          </motion.g>

          {/* ── City ── */}
          {BUILDINGS.map((b,i) => {
            const winColor = c.showSolar ? '#40e878' : (isDark ? '#c02010' : '#e8c030')
            return (
              <g key={i}>
                <motion.rect x={b.x} y={100-b.h} width={b.w} height={b.h} rx={0.5}
                  animate={{ fill: isDark ? '#141420' : '#101c28' }} transition={{ duration:2.5 }} />
                {/* Antenna */}
                <line x1={b.x+b.w/2} x2={b.x+b.w/2} y1={100-b.h} y2={100-b.h-5} stroke={isDark?'#222232':'#182230'} strokeWidth={0.5} />
                <circle cx={b.x+b.w/2} cy={100-b.h-5} r={0.5} fill={isDark ? '#ff2020' : '#2080ff'} opacity={0.7} />
                {/* Windows */}
                {Array.from({length:Math.floor((b.h-5)/8)}).map((_,j) => (
                  <motion.rect key={j} x={b.x+1.5} y={100-b.h+4+j*8} width={b.w-3} height={4} rx={0.4}
                    animate={{ fill: winColor, opacity: c.showSolar ? 0.55 : 0.3 }}
                    transition={{ duration:2.5 }} />
                ))}
                {/* Solar panels on rooftop */}
                {c.showSolar && <SolarArray x={b.x+0.5} y={100-b.h-11} />}
              </g>
            )
          })}

          {/* Wind turbines (Healthy/Thriving) */}
          {isBright && [20, 45].map((tx,i) => <WindTurbine key={i} x={tx} />)}

          {/* Factories (Crisis/Stressed) */}
          {c.smokeOp > 0 && (
            <>
              <Factory x={25} h={26} op={c.smokeOp} />
              <Factory x={58} h={22} op={c.smokeOp * 0.7} />
            </>
          )}

          {/* ── Ground layer ── */}
          <motion.path d="M0,80 Q25,76 50,78 Q75,76 100,80 L100,100 L0,100 Z"
            animate={{ fill: c.ground }} transition={{ duration:2.5 }} />

          {/* ── Vegetation ── */}

          {/* Bushes (foreground) */}
          {[5,18,35,52,68,80,92].slice(0, Math.ceil(6 * treeDensity)).map((bx,i) => (
            <Bush key={i} x={bx} y={82} r={3+i%2} c={c.vegColor} />
          ))}

          {/* Grass patches */}
          {isBright && [10,22,38,55,70,85].map((gx,i) => (
            <GrassPatch key={i} x={gx} y={83} />
          ))}

          {/* Flower patches (Healthy / Thriving) */}
          {isBright && [
            {x:12, y:80, col:'#ff80c0'},{x:28, y:81, col:'#ff9040'},
            {x:44, y:80, col:'#8080ff'},{x:62, y:81, col:'#ff80c0'},
            {x:78, y:80, col:'#ffee40'},{x:91, y:81, col:'#80ffb0'},
          ].map((f,i) => <FlowerPatch key={i} x={f.x} y={f.y} color={f.col} />)}

          {/* Trees: dead in Crisis */}
          {isCrisis && [12,28,45,62,80].map((tx,i) => <TreeDead key={i} x={tx} h={14+i%3*4} />)}

          {/* Pine trees */}
          {!isCrisis && [8,24,40,56,72,88].slice(0, Math.ceil(5*treeDensity)).map((tx,i) => (
            <TreePine key={i} x={tx} h={16+i%3*3} c={c.vegColor} delay={i*0.3} />
          ))}

          {/* Round deciduous trees */}
          {!isCrisis && [15,30,47,64,78,92].slice(0, Math.ceil(5*treeDensity)).map((tx,i) => (
            <TreeRound key={i} x={tx} h={14+i%4*3} c={c.vegColor} delay={i*0.25+0.1} />
          ))}

          {/* ── Wildlife ── */}

          {/* Deer */}
          {isBright && [
            {x:18, y:82, delay:0},
            {x:60, y:82, delay:5},
          ].map((d,i) => <Deer key={i} x={d.x} y={d.y} delay={d.delay} />)}

          {/* Rabbits */}
          {(cur === 'Healthy' || isThriving) && [
            {x:35, y:83, delay:1},
            {x:75, y:83, delay:3.5},
            {x:50, y:82, delay:7},
          ].map((r,i) => <Rabbit key={i} x={r.x} y={r.y} delay={r.delay} />)}

          {/* Butterflies */}
          {isBright && [
            {x:12, y:72, delay:0},{x:38, y:68, delay:2},
            {x:58, y:74, delay:4},{x:78, y:70, delay:6},
          ].map((b,i) => <Butterfly key={i} x={b.x} y={b.y} delay={b.delay} />)}

          {/* Birds */}
          {isBright && [
            {x:-20, y:18, speed:12, delay:0},
            {x:-20, y:24, speed:15, delay:4},
            {x:-20, y:13, speed:18, delay:8},
          ].map((b,i) => <Bird key={i} x={b.x} y={b.y} speed={b.speed} delay={b.delay} />)}

          {/* ── Water ── */}
          <motion.rect x="0" y="90" width="100" height="10" fill="url(#vwWater)"
            animate={{ opacity:1 }} transition={{ duration:2.5 }} />

          {/* Lily pads */}
          {isBright && [
            {x:10, y:92},{x:25, y:93},{x:55, y:92},{x:72, y:93},{x:88, y:92}
          ].map((l,i) => <LilyPad key={i} x={l.x} y={l.y} />)}

          {/* Jumping fish */}
          {isBright && [
            {x:20, delay:0},{x:50, delay:3},{x:82, delay:6}
          ].map((f,i) => (
            <g key={i} style={{ y:92 }}>
              <Fish x={f.x} delay={f.delay} />
            </g>
          ))}

          {/* Water ripples */}
          {[8,22,38,56,72,88].map((wx,i) => (
            <motion.ellipse key={i} cx={wx} cy={94} rx={4} ry={1}
              fill="none" stroke="white" strokeWidth={0.5}
              animate={{ rx:[2,7,2], strokeOpacity:[0.25,0.05,0.25] }}
              transition={{ duration:2.5+i*0.4, repeat:Infinity, delay:i*0.7, ease:'easeInOut' }} />
          ))}

          {/* Water shimmer */}
          {[12,28,46,62,80].map((wx,i) => (
            <motion.line key={i} x1={wx} x2={wx+7} y1={92.5} y2={92.5}
              stroke="white" strokeWidth={0.6}
              animate={{ x1:[wx,wx+3,wx], x2:[wx+7,wx+10,wx+7], strokeOpacity:[0.1,0.4,0.1] }}
              transition={{ duration:2+i*0.35, repeat:Infinity, delay:i*0.5, ease:'easeInOut' }} />
          ))}

          {/* Fireflies (Thriving) */}
          {isThriving && [
            {x:10,y:75,delay:0},{x:25,y:70,delay:1},{x:42,y:77,delay:2},
            {x:60,y:72,delay:0.5},{x:78,y:75,delay:1.8},{x:90,y:69,delay:3},
          ].map((f,i) => <Firefly key={i} x={f.x} y={f.y} delay={f.delay} />)}

          {/* Bottom ground gradient */}
          <motion.path d="M0,84 Q50,82 100,84 L100,100 L0,100 Z"
            animate={{ fill: c.ground2 }} transition={{ duration:2.5 }} opacity={0.7} />
        </g>
      </svg>

      {/* State badge */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <motion.span key={cur} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          style={{ background:`${c.labelColor}18`, color:c.labelColor, border:`1px solid ${c.labelColor}35` }}>
          <motion.span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor:c.labelColor }}
            animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }} />
          {cur}
        </motion.span>
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[oklch(10%_0.008_240)/60] to-transparent pointer-events-none" />
    </div>
  )
}
