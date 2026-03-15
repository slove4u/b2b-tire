'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateOrderStatus(orderId: string, status: string) {
  // If status is becoming CANCELLED, we should restock the items
  if (status === 'CANCELLED') {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })

    // Avoid double-restocking if it was already cancelled
    if (order && order.status !== 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
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
              note: `주문 취소로 인한 입고 (주문번호: ${order.id})`
            }
          })
        }
        await tx.order.update({
          where: { id: orderId },
          data: { status }
        })
      })
      revalidatePaths()
      return { success: true }
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  })

  revalidatePaths()
  return { success: true }
}

function revalidatePaths() {
  revalidatePath('/admin/orders')
  revalidatePath('/admin/transactions')
  revalidatePath('/admin')
  revalidatePath('/client/orders')
  revalidatePath('/admin/inventory')
}
