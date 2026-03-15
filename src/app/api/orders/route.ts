import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session || !session.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, totalAmount } = body

    if (!items || !items.length) {
      return NextResponse.json({ message: '장바구니가 비어있습니다.' }, { status: 400 })
    }

    // Wrap in a Prisma Transaction to ensure atomic stock decrement
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.id,
          totalAmount: totalAmount,
          status: 'PENDING',
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            }))
          }
        }
      })

      // 2. Decrement Stock for each Product and record transaction
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } })
        if (!product || product.stock < item.quantity) {
          throw new Error(`[${item.spec}] 재고가 부족합니다.`)
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: product.stock - item.quantity }
        })

        await tx.stockTransaction.create({
          data: {
            productId: item.id,
            type: 'OUT',
            quantity: item.quantity,
            note: `B2B 발주 출고 (주문번호: ${newOrder.id})`
          }
        })
      }

      return newOrder
    })

    // (Mock) Send Notification to Admin
    console.log(`[알림톡 발송 모의] 새로운 발주가 접수되었습니다. (거래처: ${session.name}, 총액: ${totalAmount})`)

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (error: any) {
    console.error('Order creation failed:', error)
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 })
  }
}
