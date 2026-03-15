'use client'

import { useCart } from '@/lib/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './cart.module.css'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (items.length === 0) return

    if (!confirm('발주 요청을 접수하시겠습니까?')) {
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalAmount }),
      })

      if (res.ok) {
        alert('발주가 정상적으로 접수되었습니다. 관리자 확인 후 출고됩니다.')
        clearCart()
        router.push('/client/orders')
      } else {
        const error = await res.json()
        alert(`발주 실패: ${error.message}`)
      }
    } catch (e) {
      alert('발주 처리 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>장바구니</h1>

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>
          장바구니가 비어 있습니다.
        </p>
      ) : (
        <>
          <div className={styles.cartList}>
            {items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemName}>
                    {item.brand} - {item.spec}
                  </div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => removeItem(item.id)}
                  >
                    삭제
                  </button>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.price}>
                    {new Intl.NumberFormat('ko-KR').format(item.price)}원
                  </div>
                  <div className={styles.qtyControl}>
                    <button 
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >-</button>
                    <input 
                      type="number" 
                      className={styles.qtyInput}
                      value={item.quantity}
                      readOnly
                    />
                    <button 
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>총 수량</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)} 본</span>
            </div>
            <div className={styles.totalRow}>
              <span>총 결제 예상액</span>
              <span>{new Intl.NumberFormat('ko-KR').format(totalAmount)}원</span>
            </div>
          </div>

          <button 
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={isSubmitting || items.length === 0}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isSubmitting ? '접수 처리중...' : '발주 접수하기'}
          </button>
        </>
      )}
    </div>
  )
}
