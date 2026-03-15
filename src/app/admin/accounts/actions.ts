'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createAdminAccount(formData: FormData) {
  const loginId = formData.get('loginId') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!loginId || !password || !name) {
    return { error: '모든 항목을 입력하세요.' }
  }

  try {
    await prisma.user.create({
      data: {
        loginId,
        password, // Using plain text for now as per current pattern
        name,
        role: 'ADMIN'
      }
    })
    revalidatePath('/admin/accounts')
    return { success: true }
  } catch (e) {
    return { error: '아이디가 중복되었거나 생성에 실패했습니다.' }
  }
}

export async function updateAdminPassword(id: string, formData: FormData) {
  const password = formData.get('password') as string
  if (!password) return { error: '비밀번호를 입력하세요.' }

  await prisma.user.update({
    where: { id },
    data: { password }
  })
  revalidatePath('/admin/accounts')
  return { success: true }
}

export async function deleteAdminAccount(id: string) {
  // Prevent deleting the last admin if possible, but for now simple delete
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/accounts')
}
