import { PrismaClient } from '@prisma/client'
import ClientPage from './ClientPage'

const prisma = new PrismaClient()

export default async function Page() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { priority: 'asc' }
  })

  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return <ClientPage banners={banners} notices={notices} />
}
