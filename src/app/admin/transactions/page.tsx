import prisma from '@/lib/prisma'
import styles from './transactions.module.css'
import TransactionForm from './TransactionForm'
import { deleteTransaction } from './actions'
import DeleteButton from './DeleteButton' // We'll create this helper client component
import Link from 'next/link'
import ExcelExportButton from './ExcelExportButton'


export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; start?: string; end?: string; clientId?: string }>
}) {
  const { type, start, end, clientId } = await searchParams

  const startDate = start ? new Date(`${start}T00:00:00`) : undefined
  const endDate = end ? new Date(`${end}T23:59:59.999`) : undefined

  const transactions = await prisma.stockTransaction.findMany({
    where: {
      type: (type === 'ALL' || !type) ? undefined : type,
      userId: clientId === 'ALL' || !clientId ? undefined : clientId,
      createdAt: (startDate || endDate) ? {
        gte: startDate,
        lte: endDate
      } : undefined
    },
    include: {
      product: true,
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const productsData = await prisma.product.findMany({
    orderBy: { brand: 'asc' }
  })

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { name: 'asc' }
  })

  // Calculate summary stats for the dashboard (Overall, not just filtered)
  const totalIn = (await prisma.stockTransaction.aggregate({
    where: { type: 'IN' },
    _sum: { quantity: true }
  }))._sum.quantity || 0

  const totalOut = (await prisma.stockTransaction.aggregate({
    where: { type: 'OUT' },
    _sum: { quantity: true }
  }))._sum.quantity || 0
  
  // Real current stock from Product table
  const currentTotalStock = (await prisma.product.aggregate({
    _sum: { stock: true }
  }))._sum.stock || 0

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>입출고 현황 관리</h1>

      <div className={styles.dashboardHeader}>
        <div className={styles.statCard} style={{ borderLeft: '5px solid #166534' }}>
          <span className={styles.statLabel}>전체 누적 입고</span>
          <div className={`${styles.statValue} ${styles.qtyIn}`}>+{totalIn.toLocaleString()} 본</div>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '5px solid #991b1b' }}>
          <span className={styles.statLabel}>전체 누적 출고</span>
          <div className={`${styles.statValue} ${styles.qtyOut}`}>-{totalOut.toLocaleString()} 본</div>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '5px solid var(--color-navy)' }}>
          <span className={styles.statLabel}>현재 창고 총재고</span>
          <div className={styles.statValue}>{currentTotalStock.toLocaleString()} 본</div>
        </div>
      </div>

      <TransactionForm products={productsData} clients={clients} />

      <div className={styles.tabs}>
        <Link href="/admin/transactions?type=ALL" className={`${styles.tab} ${(type === 'ALL' || !type) ? styles.activeTab : ''}`}>전체 내역</Link>
        <Link href="/admin/transactions?type=IN" className={`${styles.tab} ${type === 'IN' ? styles.activeTab : ''}`}>입고 내역</Link>
        <Link href="/admin/transactions?type=OUT" className={`${styles.tab} ${type === 'OUT' ? styles.activeTab : ''}`}>출고 내역</Link>
      </div>

      <form className={styles.searchBar}>
        <input type="hidden" name="type" value={type || 'ALL'} />
        <div className={styles.searchField}>
          <label>거래처별 필터</label>
          <select name="clientId" defaultValue={clientId || 'ALL'} className={styles.input}>
            <option value="ALL">전체 거래처</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.searchField}>
          <label>시작일</label>
          <input type="date" name="start" defaultValue={start} className={styles.input} />
        </div>
        <div className={styles.searchField}>
          <label>종료일</label>
          <input type="date" name="end" defaultValue={end} className={styles.input} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className={styles.searchBtn}>검색하기</button>
          <ExcelExportButton data={transactions} />
        </div>
      </form>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>일시</th>
              <th>구분</th>
              <th>상품명 (규격/패턴)</th>
              <th>거래처</th>
              <th>수량</th>
              <th>메모</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td style={{ fontSize: '0.85rem' }}>{new Date(t.createdAt).toLocaleString('ko-KR')}</td>
                <td>
                  <span className={`${styles.typeBadge} ${t.type === 'IN' ? styles.typeIn : styles.typeOut}`}>
                    {t.type === 'IN' ? '입고' : '출고'}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>{t.product.brand}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{t.product.spec} {t.product.pattern && `(${t.product.pattern})`}</div>
                </td>
                <td>
                  {t.user ? (
                    <span className={styles.clientName}>{t.user.name}</span>
                  ) : (
                    <span className={styles.noClient}>본사 직접</span>
                  )}
                </td>
                <td className={t.type === 'IN' ? styles.qtyIn : styles.qtyOut} style={{ fontSize: '1.1rem' }}>
                  {t.type === 'IN' ? '+' : '-'}{t.quantity.toLocaleString()}
                </td>
                <td style={{ color: '#666', fontSize: '0.85rem', maxWidth: '150px' }}>{t.note}</td>
                <td>
                  <DeleteButton id={t.id} />
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                  조건에 맞는 입출고 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
