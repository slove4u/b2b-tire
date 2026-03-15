import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const isEvent = searchParams.get('isEvent') === 'true'

  const whereClause: any = {}
  if (isEvent) whereClause.isEvent = true

  if (!q) {
    const products = await prisma.product.findMany({
      where: whereClause,
      take: 50,
      orderBy: { spec: 'asc' },
    })
    return NextResponse.json(products)
  }

  const isDigitOnly = /^[0-9]+$/.test(q)
  
  if (isDigitOnly) {
    whereClause.normalized_spec = { contains: q }
  } else {
    whereClause.OR = [
      { spec: { contains: q } },
      { brand: { contains: q } },
      { tire_name: { contains: q } },
      { pattern: { contains: q } },
    ]
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    take: 50,
    orderBy: { spec: 'asc' },
  })

  return NextResponse.json(products)
}
