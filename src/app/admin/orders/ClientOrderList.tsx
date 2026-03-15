'use client'

import { updateOrderStatus } from './actions'
import styles from './orders.module.css'
import { useState, useTransition } from 'react'

type OrderItem = { id: string; quantity: number; price: number; product: { spec: string; brand: string } }
type Order = {
  id: string
  createdAt: Date
  status: string
  totalAmount: number
  user: { name: string; tier: string; phone: string | null }
  items: OrderItem[]
}

export default function ClientOrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [isPending, startTransition] = useTransition()
  // We rely on Server Action revalidation to update the list, but we can also use React 19 useOptimistic if needed.
  // For simplicity, we just use useTransition for loading state. //

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus)
    })
  }

  return (
    <div className={styles.container}>
      {isPending && <p style={{ color: '#666' }}>상태 업데이트 중...</p>}
      {initialOrders.map(order => (
        <div key={order.id} className={`${styles.orderCard} ${order.status === 'PENDING' ? styles.pendingCard : ''}`}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.clientName}>{order.user.name} <span className={styles.clientTier}>{order.user.tier}</span></span>
              <span className={styles.date}>
                {new Date(order.createdAt).toLocaleString('ko-KR')} | {order.user.phone}
              </span>
            </div>
            
            <div className={styles.headerRight}>
              <span className={styles.amount}>{new Intl.NumberFormat('ko-KR').format(order.totalAmount)}원</span>
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`${styles.statusSelect} ${order.status === 'PENDING' ? styles.pending : ''}`}
                disabled={isPending}
              >
                <option value="PENDING">접수 대기</option>
                <option value="PROCESSING">출고 준비중</option>
                <option value="COMPLETED">출고 완료</option>
                <option value="CANCELLED">주문 취소</option>
              </select>
            </div>
          </div>
          
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>상품명/규격</th>
                <th>수량</th>
                <th>단가</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.product.brand}</strong> {item.product.spec}</td>
                  <td>{item.quantity}본</td>
                  <td>{new Intl.NumberFormat('ko-KR').format(item.price)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
