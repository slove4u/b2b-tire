'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import styles from './inventory.module.css'

export default function InventorySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [brand, setBrand] = useState(searchParams.get('brand') || '')
  const [spec, setSpec] = useState(searchParams.get('spec') || '')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    if (spec) params.set('spec', spec)
    
    const query = params.toString()
    router.push(`/admin/inventory${query ? `?${query}` : ''}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchField}>
        <label>브랜드 검색</label>
        <input 
          type="text" 
          placeholder="예: 넥센, Hankook"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.searchField}>
        <label>규격 검색 (숫자만 입력)</label>
        <input 
          type="text" 
          placeholder="예: 2155517"
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
      </div>
      <button 
        type="button" 
        onClick={handleSearch} 
        className={styles.searchBtn}
      >
        조회하기
      </button>
    </div>
  )
}
