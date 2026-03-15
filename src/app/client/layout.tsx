import { ReactNode } from 'react'
import Link from 'next/link'
import { verifySession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CartProvider } from '@/lib/CartContext'
import styles from './clientLayout.module.css'

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className={styles.layout}>
      {/* Top Warning Banner */}
      <div className={styles.banner}>
        <span>⚠️ [긴급/공지] 금호타이어 일부 규격 5% 인상. 발주 문의: <a href="tel:010-0000-0000">010-0000-0000</a></span>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>남서울상사 B2B ( {session.tier} )</div>
        <form action={async () => {
          'use server'
          await deleteSession()
          redirect('/login')
        }}>
          <button type="submit" className={styles.logoutBtn}>로그아웃</button>
        </form>
      </header>

      {/* Page Content */}
      <CartProvider>
        <main className={styles.main}>
          {children}
        </main>
      </CartProvider>

      {/* Bottom Sticky Navigation */}
      <nav className={styles.bottomNav}>
        <Link href="/client" className={styles.navItem}>
          <span>🔍</span>
          <span>재고검색</span>
        </Link>
        <Link href="/client/cart" className={styles.navItem}>
          <span>🛒</span>
          <span>장바구니</span>
        </Link>
        <Link href="/client/orders" className={styles.navItem}>
          <span>📋</span>
          <span>발주내역</span>
        </Link>
      </nav>
    </div>
  )
}
