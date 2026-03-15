'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/actions'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(login, null)

  useEffect(() => {
    if (state?.success) {
      if (state.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/client')
      }
    }
  }, [state, router])

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1>남서울상사 B2B 플랫폼</h1>
          <p>거래처 전용 시스템입니다.</p>
        </div>
        
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="loginId">아이디</label>
            <input 
              id="loginId" 
              name="loginId" 
              type="text" 
              className={styles.input} 
              placeholder="아이디를 입력하세요" 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              className={styles.input} 
              placeholder="비밀번호를 입력하세요" 
            />
          </div>
          
          {state?.error && <p className={styles.error}>{state.error}</p>}
          
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
