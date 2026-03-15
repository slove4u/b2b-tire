import prisma from '@/lib/prisma'
import Link from 'next/link'
import BannerCarousel from '@/components/BannerCarousel'
import NoticeWidget from '@/components/NoticeWidget'


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

  // Basic styling inline for overview cards (Admin dashboard can afford this)
  const cardStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    borderLeft: '4px solid var(--color-navy)'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
    marginBottom: '2.5rem'
  }

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)' }}>관리자 대시보드</h1>
      
      <div style={{ marginTop: '1.5rem' }}>
        <BannerCarousel banners={banners} />
      </div>

      <NoticeWidget notices={notices} />

      <p style={{ color: 'var(--color-grey)', marginTop: '2.5rem', fontWeight: 700 }}>🛠️ 빠른 관리 메뉴</p>
      <div style={{ ...gridStyle, marginTop: '1rem', marginBottom: '2.5rem' }}>
        <Link href="/admin/banners" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderLeftColor: '#8b5cf6', background: '#f5f3ff' }}>
            <span style={{ fontSize: '1.2rem' }}>🖼️</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>배너 광고 등록/수정</span>
            <span style={{ fontSize: '0.85rem', color: '#6d28d9' }}>상단 프로모션 배너 레이아웃 관리</span>
          </div>
        </Link>
        <Link href="/admin/notices" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderLeftColor: '#e11d48', background: '#fff1f2' }}>
            <span style={{ fontSize: '1.2rem' }}>📢</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>공지사항 작성/수정</span>
            <span style={{ fontSize: '0.85rem', color: '#be123c' }}>전체 공지 및 필독 메시지 관리</span>
          </div>
        </Link>
        <Link href="/admin/accounts" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderLeftColor: '#10B981', background: '#ecfdf5' }}>
            <span style={{ fontSize: '1.2rem' }}>🔐</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>관리자 계정 관리</span>
            <span style={{ fontSize: '0.85rem', color: '#059669' }}>관리자 아이디 및 비밀번호 관리</span>
          </div>
        </Link>
      </div>

      <p style={{ color: 'var(--color-grey)', marginTop: '0.5rem', fontWeight: 700 }}>📊 전체 현황 요약</p>
      <div style={gridStyle}>
        <Link href="/admin/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderLeftColor: '#D97706' }}>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>접수 대기 발주</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{pendingOrders} 건</span>
          </div>
        </Link>
        
        <Link href="/admin/clients" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={cardStyle}>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>전체 거래처 수</span>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{totalClients} 개사</span>
          </div>
        </Link>

        <Link href="/admin/inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={cardStyle}>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>전체 타이어 상품</span>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProducts} 건</span>
          </div>
        </Link>

        <Link href="/admin/inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderLeftColor: '#DC2626' }}>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>품절 상태 상품</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#DC2626' }}>{outOfStock} 건</span>
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
