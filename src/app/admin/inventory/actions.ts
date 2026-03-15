'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProduct(id: string, formData: FormData) {
  const price = Number(formData.get('price'))
  const stock = Number(formData.get('stock'))

  if (isNaN(price) || isNaN(stock)) {
    return { error: '유효한 숫자를 입력하세요.' }
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return { error: '상품을 찾을 수 없습니다.' }

  const stockDiff = stock - product.stock

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: { price, stock }
    }),
    ...(stockDiff !== 0 ? [
      prisma.stockTransaction.create({
        data: {
          productId: id,
          type: stockDiff > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(stockDiff),
          note: '관리자 수동 수정'
        }
      })
    ] : [])
  ])

  revalidatePath('/admin/inventory')
  revalidatePath('/admin/transactions')
  revalidatePath('/client')
  return { success: true }
}

export async function createProduct(prevState: any, formData: FormData) {
  const brand = formData.get('brand') as string
  const spec = formData.get('spec') as string
  const pattern = formData.get('pattern') as string
  const price = Number(formData.get('price'))
  const stock = Number(formData.get('stock'))

  if (!brand || !spec || isNaN(price) || isNaN(stock)) {
    return { error: '필수 항목을 모두 입력하세요.' }
  }

  // Pre-normalize spec for smart search
  const normalized_spec = spec.replace(/[^0-9]/g, '')

  const newProduct = await prisma.product.create({
    data: {
      brand,
      spec,
      normalized_spec,
      pattern,
      price,
      stock
    }
  })

  if (stock > 0) {
    await prisma.stockTransaction.create({
      data: {
        productId: newProduct.id,
        type: 'IN',
        quantity: stock,
        note: '초기 재고 등록'
      }
    })
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/admin/transactions')
  revalidatePath('/client')
  return { success: true }
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })

  revalidatePath('/admin/inventory')
  revalidatePath('/client')
}
