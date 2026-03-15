'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createTransaction(formData: FormData) {
  const productId = formData.get('productId') as string
  const userId = formData.get('userId') as string || null
  const type = formData.get('type') as string // IN, OUT
  const quantity = Number(formData.get('quantity'))
  const note = formData.get('note') as string

  if (!productId || isNaN(quantity) || quantity <= 0) {
    return { error: '유효한 상품과 수량을 입력하세요.' }
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return { error: '상품을 찾을 수 없습니다.' }

    const newStock = type === 'IN' ? product.stock + quantity : product.stock - quantity
    if (newStock < 0) return { error: '출고 수량이 현재 재고보다 많습니다.' }

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock }
      }),
      prisma.stockTransaction.create({
        data: {
          productId,
          userId,
          type,
          quantity,
          note: note || '수동 입력'
        }
      })
    ])

    revalidatePath('/admin/transactions')
    revalidatePath('/admin/inventory')
    revalidatePath('/client')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteTransaction(id: string) {
  try {
    const transaction = await prisma.stockTransaction.findUnique({
      where: { id },
      include: { product: true }
    })

    if (!transaction) return { error: '내역을 찾을 수 없습니다.' }

    // Rollback stock: If it was an IN, decrease stock. If it was an OUT, increase stock.
    const stockAdjustment = transaction.type === 'IN' ? -transaction.quantity : transaction.quantity
    const newStock = transaction.product.stock + stockAdjustment

    if (newStock < 0) {
      return { error: '해당 내역 삭제 시 재고가 음수가 되어 삭제할 수 없습니다.' }
    }

    await prisma.$transaction([
      prisma.product.update({
        where: { id: transaction.productId },
        data: { stock: newStock }
      }),
      prisma.stockTransaction.delete({
        where: { id }
      })
    ])

    revalidatePath('/admin/transactions')
    revalidatePath('/admin/inventory')
    revalidatePath('/client')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}
