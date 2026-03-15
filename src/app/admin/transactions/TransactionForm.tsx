'use client'

import { useState } from 'react'
import { createTransaction } from './actions'
import styles from './transactions.module.css'

export default function TransactionForm({ products, clients }: { products: any[], clients: any[] }) {
  const [type, setType] = useState('IN')
  const [productId, setProductId] = useState('')
  const [userId, setUserId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || !quantity || Number(quantity) <= 0) {
      alert('상품과 수량을 정확히 입력하세요.')
      return
    }

    setIsPending(true)
    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('userId', userId) // Can be empty string (interpreted as null in action)
    formData.append('type', type)
    formData.append('quantity', quantity)
    formData.append('note', note)

    const res = await createTransaction(formData)
    if (res.success) {
      alert(`${type === 'IN' ? '입고' : '출고'}가 완료되었습니다.`)
      setProductId('')
      setUserId('')
      setQuantity('')
      setNote('')
    } else {
      alert(res.error || '처리 중 오류가 발생했습니다.')
    }
    setIsPending(false)
  }

  return (
    <div className={styles.manualForm}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{type === 'IN' ? '➕' : '➖'}</span>
        수동 {type === 'IN' ? '입고' : '출고'} 기록
      </h3>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.searchField}>
          <label>구분</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            className={`${styles.input} ${type === 'IN' ? styles.borderIn : styles.borderOut}`}
          >
            <option value="IN">입고 (+)</option>
            <option value="OUT">출고 (-)</option>
          </select>
        </div>
        
        <div className={styles.searchField} style={{ flex: 2 }}>
          <label>상품 선택</label>
          <select 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            className={styles.input}
            required
          >
            <option value="">상품을 선택하세요</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.brand} {p.spec} ({p.pattern}) - 현재: {p.stock}본</option>
            ))}
          </select>
        </div>

        <div className={styles.searchField} style={{ flex: 1.5 }}>
          <label>거래처 (선택)</label>
          <select 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            className={styles.input}
          >
            <option value="">거래처 없음 (본사/직접)</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
            ))}
          </select>
        </div>

        <div className={styles.searchField} style={{ flex: 0.8 }}>
          <label>수량</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            className={styles.input}
            placeholder="본"
            required
          />
        </div>

        <div className={styles.searchField} style={{ flex: 2 }}>
          <label>메모</label>
          <input 
            type="text" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            className={styles.input}
            placeholder="예: 창고 이동, 파손 등"
          />
        </div>

        <button 
          type="submit" 
          className={`${styles.searchBtn} ${type === 'OUT' ? styles.btnOut : ''}`} 
          disabled={isPending}
        >
          {isPending ? '처리 중...' : type === 'IN' ? '입고 등록' : '출고 등록'}
        </button>
      </form>
    </div>
  )
}
