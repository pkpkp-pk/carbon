import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId, category, action, kgCo2Impact } = await req.json()
    if (!userId || !category || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const log = await prisma.dailyLog.create({
      data: { userId, category, action, kgCo2Impact: kgCo2Impact ?? 0 },
    })

    return NextResponse.json(log)
  } catch (err) {
    console.error('[log POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // Today's logs
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const logs = await prisma.dailyLog.findMany({
      where: { userId, createdAt: { gte: today } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(logs)
  } catch (err) {
    console.error('[log GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
