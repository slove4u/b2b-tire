'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createClientAccount(prevState: any, formData: FormData) {
  const loginId = formData.get('loginId') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const tier = formData.get('tier') as string

  if (!loginId || !password || !name) {
    return { error: '필수 항목(아이디/비밀번호/상호명)을 입력하세요.' }
  }

  try {
    await prisma.user.create({
      data: {
        loginId,
        password, // Usually hashed
        name,
        phone,
        tier,
        role: 'CLIENT'
      }
    })
    
    revalidatePath('/admin/clients')
    return { success: true }
  } catch (error) {
    return { error: '계정 생성에 실패했습니다 (아이디 중복 확인)' }
  }
}

export async function deleteClientAccount(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/clients')
}

export async function resetClientPassword(id: string, newPassword: string) {
  await prisma.user.update({
    where: { id },
    data: { password: newPassword }
  })
  revalidatePath('/admin/clients')
  return { success: true }
}
