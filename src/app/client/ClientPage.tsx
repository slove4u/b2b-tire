'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import styles from './client.module.css'
import BannerCarousel from '@/components/BannerCarousel'
import NoticeWidget from '@/components/NoticeWidget'

type Product = {
  id: string
  spec: string
  brand: string
  pattern: string
  price: number
  stock: number
  isEvent: boolean
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR').format(price)
}

export default function ClientPage({ banners, notices }: { banners: any[], notices: any[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'event' | 'notice'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    if (activeTab === 'notice') return

    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, activeTab])

  const fetchProducts = async (q: string) => {
    setLoading(true)
    try {
      const isEventOnly = activeTab === 'event' ? '&isEvent=true' : ''
      const res = await fetch(`/api/products?q=${encodeURIComponent(q)}${isEventOnly}`)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error('Failed to fetch products', e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      spec: product.spec,
      brand: product.brand,
      price: product.price,
      maxStock: product.stock,
    })
    alert(`${product.spec} 장바구니에 담았습니다.`)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back!</h1>
      </header>

      <BannerCarousel banners={banners} />
      
      {/* Category Tabs */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          🔍 전체 상품
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'event' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('event')}
        >
          🎁 이벤트
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'notice' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('notice')}
        >
          📢 공지사항
        </button>
      </div>

      {activeTab === 'notice' ? (
        <div className={styles.noticeListContainer}>
          <NoticeWidget notices={notices} />
          {notices.length === 0 && (
            <p style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>등록된 공지사항이 없습니다.</p>
          )}
        </div>
      ) : (
        <>
          {/* Smart Search Filter */}
          <div className={styles.searchBox}>
            <input 
              type="tel"
              className={styles.searchInput}
              placeholder="숫자 입력 (예: 2255517)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.searchHint}>
              규격 숫자만 연속해서 입력하면 즉시 검색됩니다.
            </div>
          </div>

          {/* Product List */}
          <div className={styles.productList}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>조회 중...</p>
            ) : products.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>검색 결과가 없습니다.</p>
            ) : (
              products.map(p => (
                <div key={p.id} className={styles.productCard}>
                  <div className={styles.productTop}>
                    <div>
                      <div className={styles.productSpec}>
                        {p.isEvent && <span style={{ color: '#ef4444', marginRight: '8px' }}>[이벤트]</span>}
                        {p.spec}
                      </div>
                      <div className={styles.productPattern}>{p.pattern}</div>
                    </div>
                    <div className={styles.productBrand}>{p.brand}</div>
                  </div>

                  <div className={styles.productBottom}>
                    <div className={styles.priceBlock}>
                      <span className={styles.priceLabel}>공급단가 (VAT 포함)</span>
                      <span className={p.stock > 0 ? styles.priceValue : `${styles.priceValue} ${styles.stockOut}`}>
                        {formatPrice(p.price)}원
                      </span>
                      <span style={{ fontSize: '0.8rem', color: p.stock > 0 ? '#10B981' : '#DC2626', fontWeight: 700 }}>
                        {p.stock > 0 ? `재고: ${p.stock}본` : '품절/입고대기'}
                      </span>
                    </div>
                    
                    <button 
                      className={styles.addBtn}
                      disabled={p.stock === 0}
                      onClick={() => handleAddToCart(p)}
                    >
                      담기
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
