import prisma from '@/lib/prisma'
import ClientPage from './ClientPage'

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
