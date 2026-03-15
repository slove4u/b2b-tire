import { PrismaClient } from '@prisma/client'
import ClientForm from './ClientForm'
import ClientActions from './ClientActions'
import styles from './clients.module.css'

const prisma = new PrismaClient()

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)' }}>
        거래처 계정 관리
      </h1>

      <ClientForm />

      <div className={styles.clientsTable}>
        <table>
          <thead>
            <tr>
              <th>상호명(구분)</th>
              <th>접속 아이디</th>
              <th>연락처</th>
              <th>등급</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td style={{ fontWeight: 700 }}>{client.name}</td>
                <td>{client.loginId}</td>
                <td>{client.phone}</td>
                <td><span style={{ background: 'var(--color-navy)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{client.tier}</span></td>
                <td>{client.createdAt.toLocaleDateString('ko-KR')}</td>
                <td>
                  <ClientActions id={client.id} name={client.name} />
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>등록된 거래처가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
