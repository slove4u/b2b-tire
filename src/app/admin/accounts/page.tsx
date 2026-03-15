import AdminRow from './AdminRow'

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
          <button type="submit" style={{ background: 'var(--color-navy)', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>추가하기</button>
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
              <AdminRow key={admin.id} admin={admin} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
