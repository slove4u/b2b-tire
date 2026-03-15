import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    // If no query, return top 50 products matching some default sorting
    const products = await prisma.product.findMany({
      take: 50,
      orderBy: { spec: 'asc' },
    })
    return NextResponse.json(products)
  }

  // Smart Search logic
  // The user might type "2255517" instead of "225/55R17"
  // So we match against `normalized_spec` if the input is mostly digits
  
  const isDigitOnly = /^[0-9]+$/.test(q)
  
  let products = []
  
  if (isDigitOnly) {
    products = await prisma.product.findMany({
      where: {
        normalized_spec: {
          contains: q,
        },
      },
      take: 50,
      orderBy: { spec: 'asc' },
    })
  } else {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { spec: { contains: q } },
          { brand: { contains: q } },
          { pattern: { contains: q } },
        ]
      },
      take: 50,
      orderBy: { spec: 'asc' },
    })
  }

  return NextResponse.json(products)
}
