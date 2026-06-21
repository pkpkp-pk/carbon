'use client'

import { motion } from 'framer-motion'
import { WorldState, WORLD_STATE_COLORS } from '@/lib/world-state'
import { useEffect, useState } from 'react'

interface VirtualWorldProps {
  state: WorldState
}

export default function VirtualWorld({ state }: VirtualWorldProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const colors = WORLD_STATE_COLORS[state]

  if (!mounted) return null

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* Sky */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: colors.sky }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Sun/Moon */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-yellow-100 opacity-80 shadow-[0_0_40px_rgba(255,255,200,0.8)]"
        animate={{
          opacity: state === 'Crisis' ? 0.2 : state === 'Stressed' ? 0.5 : 0.9,
          filter: state === 'Crisis' ? 'blur(10px)' : 'blur(2px)'
        }}
        transition={{ duration: 2 }}
      />

      {/* Distant Mountains / Cityscape */}
      <motion.svg
        className="absolute bottom-1/3 w-full h-32"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        animate={{ fill: state === 'Crisis' ? '#4a3b32' : state === 'Thriving' ? '#1b4d2e' : '#2d4a3e' }}
        transition={{ duration: 2 }}
      >
        <path d="M0,100 L0,50 L20,30 L40,60 L60,20 L80,50 L100,10 L100,100 Z" />
      </motion.svg>

      {/* Midground Vegetation */}
      <motion.svg
        className="absolute bottom-[10%] w-full h-48"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        animate={{ fill: state === 'Crisis' ? '#5a4634' : state === 'Thriving' ? '#228b22' : '#556b2f' }}
        transition={{ duration: 2 }}
      >
        <path d="M0,100 L0,40 Q25,20 50,50 T100,40 L100,100 Z" />
      </motion.svg>

      {/* Foreground Water */}
      <motion.div
        className="absolute bottom-0 w-full h-[20%]"
        animate={{ backgroundColor: colors.water }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <motion.div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%)',
            backgroundSize: '20px 100%'
          }}
          animate={{ x: [0, -20] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </motion.div>

      {/* State Label overlay */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="text-sm font-medium tracking-wider text-white uppercase">{state}</span>
      </div>
    </div>
  )
}
