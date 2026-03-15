import prisma from '@/lib/prisma'
import { createAdminAccount, deleteAdminAccount, updateAdminPassword } from './actions'
import styles from '../inventory/inventory.module.css' // Reuse styles

export default async function AdminAccountsPage() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    orderBy: { createdAt: 'desc' }
  })

  const cardStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginBottom: '2rem'
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
        관리자 계정 관리
      </h1>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 800 }}>새 관리자 추가</h2>
        <form action={createAdminAccount} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <input type="text" name="loginId" placeholder="아이디" className={styles.input} required />
          <input type="password" name="password" placeholder="비밀번호" className={styles.input} required />
          <input type="text" name="name" placeholder="이름(담당자)" className={styles.input} required />
          <button type="submit" style={{ background: 'var(--color-navy)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}>추가하기</button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>이름</th>
              <th>아이디</th>
              <th>비밀번호 수정</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.loginId}</td>
                <td>
                  <form action={async (formData) => { 'use server'; await updateAdminPassword(admin.id, formData); }} style={{ display: 'flex', gap: '4px' }}>
                    <input type="password" name="password" placeholder="새 비밀번호" className={styles.input} style={{ width: '120px' }} required />
                    <button type="submit" style={{ background: '#3b82f6', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>변경</button>
                  </form>
                </td>
                <td>
                  <form action={async () => { 'use server'; if(confirm('이 관리자 계정을 삭제하시겠습니까?')) await deleteAdminAccount(admin.id); }}>
                    <button type="submit" style={{ color: '#ef4444', fontWeight: 700 }}>삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
