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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>브랜드</label>
            <input type="text" name="brand" className={styles.input} placeholder="예: 넥센" style={{ padding: '0.4rem' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>타이어 이름</label>
            <input type="text" name="tire_name" className={styles.input} placeholder="예: PR2 A/S" style={{ padding: '0.4rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>규격 (Size)</label>
            <input type="text" name="spec" className={styles.input} placeholder="예: 225/55R17" style={{ padding: '0.4rem' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>하중/속도 기호</label>
            <input type="text" name="speed_load" className={styles.input} placeholder="예: 101 V" style={{ padding: '0.4rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Ply (P)</label>
            <input type="text" name="ply_rating" className={styles.input} placeholder="예: 4P" style={{ padding: '0.4rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>DOT</label>
            <input type="text" name="dot" className={styles.input} placeholder="예: 2424" style={{ padding: '0.4rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>생산지</label>
            <input type="text" name="origin" className={styles.input} placeholder="예: 베트남" style={{ padding: '0.4rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>단가 (원)</label>
            <input type="number" name="price" className={styles.input} style={{ padding: '0.4rem' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>초기 재고</label>
            <input type="number" name="stock" className={styles.input} style={{ padding: '0.4rem' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>단축 설명</label>
            <input type="text" name="description" className={styles.input} placeholder="상품에 대한 간략한 설명" style={{ padding: '0.4rem' }} />
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
