'use client'

import { deleteAdminAccount, updateAdminPassword } from './actions'
import styles from '../inventory/inventory.module.css'

interface Admin {
  id: string
  name: string
  loginId: string
}

export default function AdminRow({ admin }: { admin: Admin }) {
  const handleDelete = async () => {
    if (confirm('이 관리자 계정을 삭제하시겠습니까?')) {
      await deleteAdminAccount(admin.id)
    }
  }

  return (
    <tr>
      <td>{admin.name}</td>
      <td>{admin.loginId}</td>
      <td>
        <form action={async (formData) => { await updateAdminPassword(admin.id, formData); alert('비밀번호가 변경되었습니다.'); }} style={{ display: 'flex', gap: '4px' }}>
          <input type="password" name="password" placeholder="새 비밀번호" className={styles.input} style={{ width: '120px' }} required />
          <button type="submit" style={{ background: '#3b82f6', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>변경</button>
        </form>
      </td>
      <td>
        <button onClick={handleDelete} style={{ color: '#ef4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>삭제</button>
      </td>
    </tr>
  )
}
