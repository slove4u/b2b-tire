import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/session'

export async function GET() {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    })

    return NextResponse.json(latestOrder)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
