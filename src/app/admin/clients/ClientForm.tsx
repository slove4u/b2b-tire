'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createClientAccount } from './actions'
import styles from './clients.module.css'

export default function ClientForm() {
  const [state, formAction, isPending] = useActionState(createClientAccount, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      alert('거래처 계정이 생성되었습니다.')
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className={styles.formCard}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>신규 거래처 등록</h2>
      <form ref={formRef} action={formAction}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">상호명 (업체명)</label>
            <input type="text" name="name" id="name" className={styles.input} required placeholder="예: (주)남서울타이어" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="loginId">접속 ID</label>
            <input type="text" name="loginId" id="loginId" className={styles.input} required placeholder="아이디" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input type="password" name="password" id="password" className={styles.input} required placeholder="초기 비밀번호" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">연락처</label>
            <input type="text" name="phone" id="phone" className={styles.input} placeholder="010-0000-0000" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="tier">거래처 등급</label>
            <select name="tier" id="tier" className={styles.input}>
              <option value="STANDARD">STANDARD</option>
              <option value="PREMIUM">PREMIUM</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>

        {state?.error && <p className={styles.error}>{state.error}</p>}
        
        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? '등록 중...' : '거래처 계정 생성'}
        </button>
      </form>
    </div>
  )
}
