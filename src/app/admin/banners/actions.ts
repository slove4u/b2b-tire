'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createBanner(formData: FormData) {
  const imageUrl = formData.get('imageUrl') as string
  const link = formData.get('link') as string
  const priority = Number(formData.get('priority')) || 0

  if (!imageUrl) return { error: '이미지 URL은 필수입니다.' }

  try {
    await prisma.banner.create({
      data: { imageUrl, link, priority, isActive: true }
    })
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function updateBanner(id: string, formData: FormData) {
  const imageUrl = formData.get('imageUrl') as string
  const link = formData.get('link') as string
  const priority = Number(formData.get('priority')) || 0
  const isActive = formData.get('isActive') === 'true'

  try {
    await prisma.banner.update({
      where: { id },
      data: { imageUrl, link, priority, isActive }
    })
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({ where: { id } })
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}
