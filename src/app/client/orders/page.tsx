import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import styles from './orders.module.css'

function translateStatus(status: string) {
  switch(status) {
    case 'PENDING': return '접수 대기';
    case 'PROCESSING': return '출고 준비중';
    case 'COMPLETED': return '출고 완료';
    case 'CANCELLED': return '주문 취소';
    default: return status;
  }
}

export default async function OrderHistoryPage() {
  const session = await verifySession()
  if (!session) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>최근 발주 내역</h1>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>조회된 발주 내역이 없습니다.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderDate}>
                  {order.createdAt.toLocaleDateString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                <span className={`${styles.orderStatus} ${styles[`status${order.status}`] || ''}`}>
                  {translateStatus(order.status)}
                </span>
              </div>
              
              <div className={styles.itemList}>
                {order.items.map(item => (
                  <div key={item.id} className={styles.itemRow}>
                    <span>{item.product.brand} - {item.product.spec}</span>
                    <span>{item.quantity}본</span>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <span>총 청구 금액</span>
                <span style={{ color: '#DC2626' }}>
                  {new Intl.NumberFormat('ko-KR').format(order.totalAmount)}원
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
