'use client'

import { deleteTransaction } from './actions'
import styles from './transactions.module.css'
import { useState } from 'react'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    if (!confirm('이 입출고 내역을 삭제하시겠습니까? 관련 재고가 자동으로 조정됩니다.')) {
      return
    }

    setIsPending(true)
    const res = await deleteTransaction(id)
    if (!res.success) {
      alert(res.error || '삭제 중 오류가 발생했습니다.')
    }
    setIsPending(false)
  }

  return (
    <button 
      onClick={handleDelete} 
      className={styles.deleteBtn}
      disabled={isPending}
    >
      {isPending ? '...' : '삭제'}
    </button>
  )
}
