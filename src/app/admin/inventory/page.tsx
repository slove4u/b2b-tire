import { PrismaClient } from '@prisma/client'
import { updateProduct } from './actions'
import ProductForm from './ProductForm'
import DeleteButton from './DeleteButton'
import InventorySearch from './InventorySearch'
import styles from './inventory.module.css'

const prisma = new PrismaClient()

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; spec?: string }>
}) {
  const { brand, spec } = await searchParams
  
  const products = await prisma.product.findMany({
    where: {
      brand: brand ? { contains: brand } : undefined,
      normalized_spec: spec ? { contains: spec.replace(/[^0-9]/g, '') } : undefined,
    },
    orderBy: { spec: 'asc' }
  })

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
        재고 및 단가 관리
      </h1>

      <ProductForm />
      <InventorySearch />
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>브랜드</th>
              <th>규격</th>
              <th>패턴</th>
              <th style={{ width: '130px' }}>현재 단가(원)</th>
              <th style={{ width: '100px' }}>현재 재고(본)</th>
              <th style={{ width: '150px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.brand}</td>
                <td style={{ fontWeight: 700 }}>{product.spec}</td>
                <td>{product.pattern}</td>
                <td>
                  <form id={`edit-form-${product.id}`} action={async (formData) => { 'use server'; await updateProduct(product.id, formData); }}></form>
                  <input 
                    form={`edit-form-${product.id}`}
                    type="number" 
                    name="price" 
                    defaultValue={product.price} 
                    className={styles.input}
                  />
                </td>
                <td>
                  <input 
                    form={`edit-form-${product.id}`}
                    type="number" 
                    name="stock" 
                    defaultValue={product.stock} 
                    className={styles.input}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button form={`edit-form-${product.id}`} type="submit" className={styles.saveBtn}>저장</button>
                    <DeleteButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
