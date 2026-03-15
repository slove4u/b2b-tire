import { ReactNode } from 'react'
import Link from 'next/link'
import { verifySession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import styles from './adminLayout.module.css'
import AdminNotification from '@/components/AdminNotification'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await verifySession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.logo}>ADMIN PANEL</Link>
        
        <nav className={styles.navMenu}>
          <Link href="/admin" className={styles.navItem}>
            <span>📊</span>
            <span>대시보드</span>
          </Link>
          <Link href="/admin/inventory" className={styles.navItem}>
            <span>📦</span>
            <span>재고/단가 관리</span>
          </Link>
          <Link href="/admin/orders" className={styles.navItem}>
            <span>📋</span>
            <span>발주 접수현황</span>
          </Link>
          <Link href="/admin/transactions" className={styles.navItem}>
            <span>🔄</span>
            <span>입출고 현황</span>
          </Link>
          <Link href="/admin/clients" className={styles.navItem}>
            <span>🏢</span>
            <span>거래처 계정관리</span>
          </Link>
          <Link href="/admin/accounts" className={styles.navItem}>
            <span>🔐</span>
            <span>관리자 계정관리</span>
          </Link>
        </nav>

        <form action={async () => {
          'use server'
          await deleteSession()
          redirect('/login')
        }}>
          <button type="submit" className={styles.logoutBtn} style={{width: '100%'}}>로그아웃</button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        {children}
      </main>
      <AdminNotification />
    </div>
  )
}
