'use client'

import { useState } from 'react'
import { updateProduct } from './actions'
import DeleteButton from './DeleteButton'
import styles from './inventory.module.css'

interface Product {
  id: string
  brand: string
  spec: string
  tire_name: string | null
  dot: string | null
  speed_load: string | null
  ply_rating: string | null
  origin: string | null
  description: string | null
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
      <td>
        <div style={{fontWeight: 700}}>{product.brand}</div>
        <div style={{fontSize: '0.8rem', color: '#666'}}>{product.tire_name}</div>
      </td>
      <td>
        <div style={{ fontWeight: 700 }}>{product.spec}</div>
        <div style={{fontSize: '0.8rem', color: '#666'}}>{product.speed_load} {product.ply_rating}</div>
      </td>
      <td>
        <div style={{fontSize: '0.9rem'}}>{product.origin || '-'}</div>
        <div style={{fontSize: '0.75rem', color: '#999'}}>{product.description}</div>
      </td>
      
      {isEditing ? (
        <>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="text" 
              name="dot" 
              defaultValue={product.dot || ''} 
              className={styles.editableInput}
              style={{ width: '60px', padding: '0.3rem' }}
            />
            {/* Hidden fields to preserve data if not explicitly in separate inputs, 
                but let's add them for full editability */}
            <input type="hidden" name="tire_name" defaultValue={product.tire_name || ''} form={`row-form-${product.id}`} />
            <input type="hidden" name="speed_load" defaultValue={product.speed_load || ''} form={`row-form-${product.id}`} />
            <input type="hidden" name="ply_rating" defaultValue={product.ply_rating || ''} form={`row-form-${product.id}`} />
            <input type="hidden" name="origin" defaultValue={product.origin || ''} form={`row-form-${product.id}`} />
            <input type="hidden" name="description" defaultValue={product.description || ''} form={`row-form-${product.id}`} />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="number" 
              name="price" 
              defaultValue={product.price} 
              className={styles.editableInput}
              style={{ width: '90px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="number" 
              name="stock" 
              defaultValue={product.stock} 
              className={styles.editableInput}
              style={{ width: '60px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <form id={`row-form-${product.id}`} action={handleSave}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button type="submit" className={styles.saveColBtn} disabled={isPending} style={{padding: '0.4rem 0.6rem'}}>
                  {isPending ? '..' : '저장'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn} style={{padding: '0.4rem 0.6rem'}}>취소</button>
              </div>
            </form>
          </td>
        </>
      ) : (
        <>
          <td style={{fontWeight: 700}}>{product.dot || '-'}</td>
          <td style={{ color: '#10B981', fontWeight: 800 }}>{product.price.toLocaleString()}원</td>
          <td style={{ fontWeight: 800 }}>{product.stock}본</td>
          <td>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setIsEditing(true)} className={styles.editBtn} style={{padding: '0.4rem 0.6rem'}}>수정</button>
              <DeleteButton id={product.id} />
            </div>
          </td>
        </>
      )}
    </tr>
  )
}
