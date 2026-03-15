import prisma from '@/lib/prisma'
import Link from 'next/link'
import BannerCarousel from '@/components/BannerCarousel'
import NoticeWidget from '@/components/NoticeWidget'
import styles from './admin.module.css'


export default async function AdminDashboard() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { priority: 'asc' }
  })

  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  const pendingOrders = await prisma.order.count({
    where: { status: 'PENDING' }
  })
  
  const totalClients = await prisma.user.count({
    where: { role: 'CLIENT' }
  })
  
  const totalProducts = await prisma.product.count()

  const outOfStock = await prisma.product.count({
    where: { stock: 0 }
  })
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>관리자 대시보드</h1>
      
      <div className={styles.carouselWrapper}>
        <BannerCarousel banners={banners} />
      </div>

      <NoticeWidget notices={notices} />

      <p className={styles.sectionLabel}>🛠️ 빠른 관리 메뉴</p>
      <div className={styles.quickGrid}>
        <Link href="/admin/banners" className={styles.navLink}>
          <div className={`${styles.quickCard} ${styles.bannerCard}`}>
            <span className={styles.cardIcon}>🖼️</span>
            <span className={styles.cardTitle}>배너 관리</span>
            <span className={styles.cardDesc}>상단 프로모션 관리</span>
          </div>
        </Link>
        <Link href="/admin/notices" className={styles.navLink}>
          <div className={`${styles.quickCard} ${styles.noticeCard}`}>
            <span className={styles.cardIcon}>📢</span>
            <span className={styles.cardTitle}>공지 관리</span>
            <span className={styles.cardDesc}>공지 및 메시지 관리</span>
          </div>
        </Link>
        <Link href="/admin/accounts" className={styles.navLink}>
          <div className={`${styles.quickCard} ${styles.accountCard}`}>
            <span className={styles.cardIcon}>🔐</span>
            <span className={styles.cardTitle}>계정 관리</span>
            <span className={styles.cardDesc}>아이디/비번 관리</span>
          </div>
        </Link>
      </div>

      <p className={styles.sectionLabel}>📊 전체 현황 요약</p>
      <div className={styles.statGrid}>
        <Link href="/admin/orders" className={styles.navLink}>
          <div className={`${styles.statCard} ${styles.pendingOrderCard}`}>
            <span className={styles.statLabel}>접수 대기</span>
            <span className={styles.statValue}>{pendingOrders} <small>건</small></span>
          </div>
        </Link>
        
        <Link href="/admin/clients" className={styles.navLink}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>거래처</span>
            <span className={styles.statValue}>{totalClients} <small>사</small></span>
          </div>
        </Link>

        <Link href="/admin/inventory" className={styles.navLink}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>전체 상품</span>
            <span className={styles.statValue}>{totalProducts} <small>건</small></span>
          </div>
        </Link>

        <Link href="/admin/inventory" className={styles.navLink}>
          <div className={`${styles.statCard} ${styles.soldOutCard}`}>
            <span className={styles.statLabel}>품절/대기</span>
            <span className={styles.statValue}>{outOfStock} <small>건</small></span>
          </div>
        </Link>
      </div>

      {/* Logout button at the bottom for mobile/accessibility */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <form action={async () => {
          'use server'
          const { deleteSession } = await import('@/lib/session')
          const { redirect } = await import('next/navigation')
          await deleteSession()
          redirect('/login')
        }}>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: '#fef2f2', 
              color: '#dc2626', 
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            🔓 시스템 로그아웃
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#999', fontSize: '0.8rem', marginTop: '1rem' }}>
          Tire-B2B Link v1.0 Admin Session
        </p>
      </div>
    </div>
  )
}
