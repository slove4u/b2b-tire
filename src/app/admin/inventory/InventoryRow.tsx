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
  isEvent: boolean
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
      <td>{product.isEvent && <span style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 900, border: '1px solid #ef4444', padding: '1px 3px', borderRadius: '3px', verticalAlign: 'middle', marginRight: '3px' }}>EVENT</span>}<div style={{fontWeight: 700, display: 'inline'}}>{product.brand}</div></td>
      <td>{product.tire_name}</td>
      <td><div style={{fontWeight: 700}}>{product.spec}</div></td>
      
      {isEditing ? (
        <>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="text" 
              name="speed_load" 
              defaultValue={product.speed_load || ''} 
              className={styles.editableInput}
              style={{ width: '60px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="text" 
              name="ply_rating" 
              defaultValue={product.ply_rating || ''} 
              className={styles.editableInput}
              style={{ width: '40px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="text" 
              name="dot" 
              defaultValue={product.dot || ''} 
              className={styles.editableInput}
              style={{ width: '50px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="text" 
              name="origin" 
              defaultValue={product.origin || ''} 
              className={styles.editableInput}
              style={{ width: '60px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <input 
              form={`row-form-${product.id}`}
              type="number" 
              name="price" 
              defaultValue={product.price} 
              className={styles.editableInput}
              style={{ width: '80px', padding: '0.3rem' }}
            />
          </td>
          <td>
            <input type="number" 
              name="stock" 
              defaultValue={product.stock} 
              className={styles.editableInput}
              style={{ width: '50px', padding: '0.3rem' }}
              form={`row-form-${product.id}`}
            />
          </td>
          <td>
            <input 
              type="checkbox" 
              name="isEvent" 
              value="true" 
              defaultChecked={product.isEvent}
              form={`row-form-${product.id}`}
              style={{ width: '18px', height: '18px' }}
            />
            {/* Hidden fields for other potential data */}
            <input type="hidden" name="tire_name" defaultValue={product.tire_name || ''} form={`row-form-${product.id}`} />
            <input type="hidden" name="description" defaultValue={product.description || ''} form={`row-form-${product.id}`} />
          </td>
          <td>
            <form id={`row-form-${product.id}`} action={handleSave}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button type="submit" className={styles.saveColBtn} disabled={isPending} style={{padding: '0.4rem 0.5rem', fontSize: '0.85rem'}}>
                  {isPending ? '..' : '저장'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn} style={{padding: '0.4rem 0.5rem', fontSize: '0.85rem'}}>취소</button>
              </div>
            </form>
          </td>
        </>
      ) : (
        <>
          <td>{product.speed_load}</td>
          <td>{product.ply_rating}</td>
          <td style={{fontWeight: 700}}>{product.dot || '-'}</td>
          <td>{product.origin}</td>
          <td style={{ color: '#10B981', fontWeight: 800 }}>{product.price.toLocaleString()}</td>
          <td style={{ fontWeight: 800 }}>{product.stock}</td>
          <td style={{ textAlign: 'center' }}>{product.isEvent && <span style={{ color: '#ef4444' }}>🔴</span>}</td>
          <td>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setIsEditing(true)} className={styles.editBtn} style={{padding: '0.4rem 0.6rem', fontSize: '0.85rem'}}>수정</button>
              <DeleteButton id={product.id} />
            </div>
          </td>
        </>
      )}
    </tr>
  )
}
