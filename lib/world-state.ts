export type WorldState = 'Crisis' | 'Stressed' | 'Recovering' | 'Healthy' | 'Thriving'

export function getPlatformWorldState(kgCo2PerYear: number): WorldState {
  const tons = kgCo2PerYear / 1000
  
  if (tons > 12) return 'Crisis'
  if (tons > 8) return 'Stressed'
  if (tons > 4) return 'Recovering'
  if (tons > 2) return 'Healthy'
  return 'Thriving'
}

export const WORLD_STATE_COLORS: Record<WorldState, { sky: string, water: string }> = {
  Crisis: { sky: '#8B4513', water: '#2F4F4F' },     // Amber/brownish grey
  Stressed: { sky: '#BDB76B', water: '#5F9EA0' },   // Muddy
  Recovering: { sky: '#87CEEB', water: '#4682B4' }, // Light blue
  Healthy: { sky: '#4169E1', water: '#1E90FF' },    // Clear blue
  Thriving: { sky: '#00BFFF', water: '#00CED1' },   // Vibrant blue
}
