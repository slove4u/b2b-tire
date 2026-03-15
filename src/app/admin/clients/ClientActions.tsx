'use client'

import { deleteClientAccount, resetClientPassword } from './actions'
import styles from './clients.module.css'

export default function ClientActions({ id, name }: { id: string, name: string }) {
  const handleDelete = async () => {
    if (confirm(`'${name}' 계정을 삭제하시겠습니까?`)) {
      await deleteClientAccount(id)
    }
  }

  const handleResetPassword = async () => {
    const newPassword = prompt(`'${name}' 계정의 새로운 비밀번호를 입력하세요:`, '1234')
    if (newPassword) {
      const result = await resetClientPassword(id, newPassword)
      if (result.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.')
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        type="button" 
        onClick={handleResetPassword} 
        className={styles.resetBtn}
        style={{ background: '#3b82f6', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}
      >
        비번 재설정
      </button>
      <button 
        type="button" 
        onClick={handleDelete} 
        className={styles.deleteBtn}
      >
        삭제
      </button>
    </div>
  )
}
