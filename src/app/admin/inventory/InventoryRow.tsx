'use client'

import { useState } from 'react'
import { updateProduct } from './actions'
import DeleteButton from './DeleteButton'
import styles from './inventory.module.css'

interface Product {
  id: string
  brand: string
  spec: string
  pattern: string | null
  dot: string | null
  price: number
  stock: number
}

export default function InventoryRow({ product }: { product: Product }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleSave = async (formData: FormData) => {
    setIsPending(true)
    const res = await updateProduct(product.id, formData)
    if (res?.error) {
      alert(res.error)
    } else {
      setIsEditing(false)
    }
    setIsPending(false)
  }

  return (
    <tr>
      <td>{product.brand}</td>
      <td style={{ fontWeight: 700 }}>{product.spec}</td>
      <td>{product.pattern}</td>
      
      {isEditing ? (
        <>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="text" 
              name="dot" 
              defaultValue={product.dot || ''} 
              className={styles.editableInput}
              style={{ width: '70px' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="number" 
              name="price" 
              defaultValue={product.price} 
              className={styles.editableInput}
              style={{ width: '100px' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="number" 
              name="stock" 
              defaultValue={product.stock} 
              className={styles.editableInput}
              style={{ width: '70px' }}
            />
          </td>
          <td>
            <form id={`row-form-${product.id}`} action={handleSave}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button type="submit" className={styles.saveColBtn} disabled={isPending}>
                  {isPending ? '...' : '저장'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>취소</button>
              </div>
            </form>
          </td>
        </>
      ) : (
        <>
          <td>{product.dot || '-'}</td>
          <td style={{ color: '#10B981', fontWeight: 700 }}>{product.price.toLocaleString()}원</td>
          <td style={{ fontWeight: 700 }}>{product.stock}본</td>
          <td>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setIsEditing(true)} className={styles.editBtn}>수정</button>
              <DeleteButton id={product.id} />
            </div>
          </td>
        </>
      )}
    </tr>
  )
}
