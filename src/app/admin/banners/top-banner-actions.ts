'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function upsertTopBanner(content: string, isActive: boolean) {
  if (!content) return { error: '내용은 필수입니다.' }

  try {
    const existing = await (prisma as any).topBanner.findFirst()

    if (existing) {
      await (prisma as any).topBanner.update({
        where: { id: existing.id },
        data: { content, isActive }
      })
    } else {
      await (prisma as any).topBanner.create({
        data: { content, isActive }
      })
    }

    revalidatePath('/client')
    revalidatePath('/admin/banners')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function toggleTopBanner(isActive: boolean) {
  try {
    const existing = await (prisma as any).topBanner.findFirst()
    if (existing) {
      await (prisma as any).topBanner.update({
        where: { id: existing.id },
        data: { isActive }
      })
      revalidatePath('/client')
      revalidatePath('/admin/banners')
      return { success: true }
    }
    return { error: '배너가 존재하지 않습니다.' }
  } catch (e: any) {
    return { error: e.message }
  }
}
