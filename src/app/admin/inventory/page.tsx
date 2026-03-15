import prisma from '@/lib/prisma'
import ProductForm from './ProductForm'
import InventorySearch from './InventorySearch'
import styles from './inventory.module.css'
import InventoryRow from './InventoryRow'

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
              <th>타이어명</th>
              <th>규격</th>
              <th>하중/속도</th>
              <th>Ply</th>
              <th>DOT</th>
              <th>생산지</th>
              <th style={{ width: '110px' }}>단가(원)</th>
              <th style={{ width: '80px' }}>재고(본)</th>
              <th style={{ width: '60px' }}>이벤트</th>
              <th style={{ width: '100px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <InventoryRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
