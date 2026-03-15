'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createSession } from '@/lib/session'

export async function login(prevState: any, formData: FormData) {
  const loginId = formData.get('loginId') as string
  const password = formData.get('password') as string

  if (!loginId || !password) {
    return { error: '아이디와 비밀번호를 입력해주세요.' }
  }

  const user = await prisma.user.findUnique({
    where: { loginId },
  })

  // In production, compare hashed passwords.
  if (!user || user.password !== password) {
    return { error: '등록되지 않은 아이디거나 비밀번호가 틀렸습니다.' }
  }

  // Create session
  await createSession({
    id: user.id,
    loginId: user.loginId,
    role: user.role,
    name: user.name,
    tier: user.tier,
  })

  return { success: true, role: user.role }
}
