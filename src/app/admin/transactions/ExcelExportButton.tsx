'use client'

import * as XLSX from 'xlsx'
import styles from './transactions.module.css'

interface Transaction {
  id: string
  createdAt: string | Date
  type: string
  product: {
    brand: string
    spec: string
    tire_name?: string | null
  }
  user?: {
    name: string
  } | null
  quantity: number
  note: string | null
}

export default function ExcelExportButton({ data }: { data: Transaction[] }) {
  const exportToExcel = () => {
    if (!data.length) {
      alert('내보낼 데이터가 없습니다.')
      return
    }

    const worksheetData = data.map(t => ({
      '일시': new Date(t.createdAt).toLocaleString('ko-KR'),
      '구분': t.type === 'IN' ? '입고' : '출고',
      '브랜드': t.product?.brand || '-',
      '규격': t.product?.spec || '-',
      '타이어명': t.product?.tire_name || '-',
      '거래처': t.user?.name || '본사 직접',
      '수량': t.type === 'IN' ? t.quantity : -t.quantity,
      '메모': t.note || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions")

    // Generate filename based on current date
    const filename = `inventory_report_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, filename)
  }

  return (
    <button type="button" onClick={exportToExcel} className={styles.searchBtn} style={{ background: '#166534' }}>
      Excel 다운로드
    </button>
  )
}
