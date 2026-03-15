'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newState: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } }
  })

  if (!order) return { error: 'Order not found' }

  const oldState = order.status
  const isNowShipped = (newState === 'PROCESSING' || newState === 'COMPLETED')
  const wasShipped = (oldState === 'PROCESSING' || oldState === 'COMPLETED')

  try {
    await prisma.$transaction(async (tx) => {
      // CASE 1: Transitioning TO Shipped (Logging OUT)
      if (isNowShipped && !wasShipped) {
        for (const item of order.items) {
          if (item.product.stock < item.quantity) {
            throw new Error(`[${item.product.spec}] 재고가 부족합니다. (현재: ${item.product.stock})`)
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
          await tx.stockTransaction.create({
            data: {
              productId: item.productId,
              userId: order.userId,
              type: 'OUT',
              quantity: item.quantity,
              note: `B2B 출고 확정 (주문번호: ${order.id})`
            }
          })
        }
      }

      // CASE 2: Transitioning FROM Shipped TO Non-Shipped (Logging IN/Restoring)
      if (!isNowShipped && wasShipped) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          })
          await tx.stockTransaction.create({
            data: {
              productId: item.productId,
              type: 'IN',
              quantity: item.quantity,
              note: `반품/취소로 인한 입고 (주문번호: ${order.id})`
            }
          })
        }
      }

      // Update the order status itself
      await tx.order.update({
        where: { id: orderId },
        data: { status: newState }
      })
    })

    revalidatePaths()
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

function revalidatePaths() {
  revalidatePath('/admin/orders')
  revalidatePath('/admin/transactions')
  revalidatePath('/admin')
  revalidatePath('/client/orders')
  revalidatePath('/admin/inventory')
}
