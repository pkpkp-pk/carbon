import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculateBaseline } from '@/lib/emissions'

export async function POST(req: Request) {
  try {
    const { userId, data } = await req.json()
    if (!userId || !data) {
      return NextResponse.json({ error: 'userId and data required' }, { status: 400 })
    }

    const baseline = calculateBaseline(data)

    // Upsert so re-submitting onboarding just updates the record
    const record = await prisma.onboardingResponse.upsert({
      where: { userId },
      update: {
        country: data.country,
        regionType: data.regionType,
        transportModes: data.transportModes,
        weeklyKm: data.weeklyKm,
        flightsYear: data.flightsYear,
        dietType: data.dietType,
        foodSourcing: data.foodSourcing ?? 'Supermarket',
        homeType: data.homeType ?? 'House',
        homeSize: data.homeSize,
        energySource: data.energySource,
        heatingSystem: data.heatingSystem ?? 'Gas',
        householdSize: data.householdSize,
        monthlySpend: data.monthlySpend,
        consumptionModifiers: data.consumptionModifiers,
        baselineKgCo2PerYear: baseline,
      },
      create: {
        userId,
        country: data.country,
        regionType: data.regionType,
        transportModes: data.transportModes,
        weeklyKm: data.weeklyKm,
        flightsYear: data.flightsYear,
        dietType: data.dietType,
        foodSourcing: data.foodSourcing ?? 'Supermarket',
        homeType: data.homeType ?? 'House',
        homeSize: data.homeSize,
        energySource: data.energySource,
        heatingSystem: data.heatingSystem ?? 'Gas',
        householdSize: data.householdSize,
        monthlySpend: data.monthlySpend,
        consumptionModifiers: data.consumptionModifiers,
        baselineKgCo2PerYear: baseline,
      },
    })

    return NextResponse.json({ baseline, recordId: record.id })
  } catch (err: any) {
    console.error('[onboarding]', err)
    return NextResponse.json({ error: err?.message || String(err) || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const record = await prisma.onboardingResponse.findUnique({ where: { userId } })
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(record)
  } catch (err) {
    console.error('[onboarding GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
