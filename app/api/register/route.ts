import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateGrnId } from '@/lib/grn'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username } })
    
    // If the user already exists and is not a guest, treat this as a login attempt
    if (existing && !existing.is_guest) {
      const isValid = await bcrypt.compare(password, existing.password_hash ?? '')
      if (isValid) {
        return NextResponse.json({ id: existing.id, username: existing.username, grn_id: existing.grn_id })
      } else {
        return NextResponse.json({ error: 'Username taken or invalid password' }, { status: 401 })
      }
    }

    const hash = await bcrypt.hash(password, 12)

    const user = existing
      ? await prisma.user.update({
          where: { username },
          data: { password_hash: hash, is_guest: false },
        })
      : await prisma.user.create({
          data: { username, password_hash: hash, grn_id: generateGrnId(), is_guest: false },
        })

    return NextResponse.json({ id: user.id, username: user.username, grn_id: user.grn_id })
  } catch (err: any) {
    console.error('[register]', err)
    return NextResponse.json({ error: err?.message || String(err) || 'Internal server error' }, { status: 500 })
  }
}
