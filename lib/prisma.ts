import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Required for Neon WebSocket in Node.js (local dev)
neonConfig.webSocketConstructor = ws

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL!
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({ adapter })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
