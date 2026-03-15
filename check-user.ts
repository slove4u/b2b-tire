import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const admin = await prisma.user.findUnique({
      where: { loginId: 'admin' }
    })
    console.log('Admin user found:', admin ? 'YES' : 'NO')
    if (admin) {
      console.log('Login ID:', admin.loginId)
      console.log('Password (masked):', admin.password.substring(0, 3) + '...')
      console.log('Role:', admin.role)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
