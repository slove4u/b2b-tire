'use client'

import { deleteProduct } from './actions'
import styles from './inventory.module.css'

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('이 상품을 정말 삭제하시겠습니까?')) {
      await deleteProduct(id)
    }
  }

  return (
    <button 
      type="button" 
      onClick={handleDelete} 
      className={styles.deleteBtn}
    >
      삭제
    </button>
  )
}
