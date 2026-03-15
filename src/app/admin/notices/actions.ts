'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createNotice(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const isImportant = formData.get('isImportant') === 'true'

  if (!title || !content) return { error: '제목과 내용을 입력해주세요.' }

  try {
    await prisma.notice.create({
      data: { title, content, isImportant }
    })
    revalidatePath('/admin/notices')
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function updateNotice(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const isImportant = formData.get('isImportant') === 'true'

  try {
    await prisma.notice.update({
      where: { id },
      data: { title, content, isImportant }
    })
    revalidatePath('/admin/notices')
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteNotice(id: string) {
  try {
    await prisma.notice.delete({ where: { id } })
    revalidatePath('/admin/notices')
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}
