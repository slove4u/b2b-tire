import { PrismaClient } from '@prisma/client'
import ClientOrderList from './ClientOrderList'

const prisma = new PrismaClient()

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  // We have to parse dates or just let Next.js serialize them (Next.js App Router Native handles Date serialization to Client components successfully)

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
        발주 접수 현황
      </h1>

      {orders.length === 0 ? (
        <p>접수된 발주 내역이 없습니다.</p>
      ) : (
        <ClientOrderList initialOrders={orders as any} />
      )}
    </div>
  )
}
