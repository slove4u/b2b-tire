'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createProduct } from './actions'
import styles from './inventory.module.css'

export default function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      alert('상품 정보가 등록되었습니다.')
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className={styles.formCard} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10B981' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 800 }}>신규 타이어 상품 등록</h2>
      <form ref={formRef} action={formAction}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>브랜드</label>
            <input type="text" name="brand" className={styles.input} placeholder="예: 넥센" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>규격 (Full)</label>
            <input type="text" name="spec" className={styles.input} placeholder="예: 225/55R17" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>패턴</label>
            <input type="text" name="pattern" className={styles.input} placeholder="예: AU7" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>단가 (원)</label>
            <input type="number" name="price" className={styles.input} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>초기 재고</label>
            <input type="number" name="stock" className={styles.input} required />
          </div>
        </div>
        
        {state?.error && <p style={{ color: '#DC2626', marginTop: '0.5rem', fontWeight: 600 }}>{state.error}</p>}
        
        <button type="submit" className={styles.saveBtn} style={{ marginTop: '1rem', width: '100%' }} disabled={isPending}>
          {isPending ? '등록 중...' : '상품 등록하기'}
        </button>
      </form>
    </div>
  )
}
