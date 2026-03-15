import { PrismaClient } from '@prisma/client'
import { createNotice, deleteNotice, updateNotice } from './actions'
import styles from './notices.module.css'

const prisma = new PrismaClient()

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>공지사항 관리</h1>

      <div className={styles.formCard}>
        <h3>새 공지사항 작성</h3>
        <form action={async (formData) => { 'use server'; await createNotice(formData); }} className={styles.form}>
          <input name="title" placeholder="제목" className={styles.input} required />
          <textarea name="content" placeholder="내용을 입력하세요..." className={styles.textarea} required />
          <div className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="isImportant" value="true" /> 중요 공지 (상단 강조)
            </label>
            <button type="submit" className={styles.submitBtn}>작성하기</button>
          </div>
        </form>
      </div>

      <div className={styles.list}>
        {notices.map(notice => (
          <div key={notice.id} className={`${styles.noticeItem} ${notice.isImportant ? styles.important : ''}`}>
            <div className={styles.noticeHeader}>
              <span className={styles.date}>{new Date(notice.createdAt).toLocaleDateString()}</span>
              {notice.isImportant && <span className={styles.importantBadge}>중요</span>}
            </div>
            <form action={async (formData) => { 'use server'; await updateNotice(notice.id, formData); }} className={styles.editForm}>
              <input name="title" defaultValue={notice.title} className={styles.inputTitle} />
              <textarea name="content" defaultValue={notice.content} className={styles.textareaSmall} />
              <div className={styles.row}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="isImportant" value="true" defaultChecked={notice.isImportant} /> 중요
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className={styles.saveBtn}>수정</button>
                  <button formAction={async () => { 'use server'; await deleteNotice(notice.id); }} className={styles.deleteBtn}>삭제</button>
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
