import prisma from '@/lib/prisma'
import { createNotice, deleteNotice, updateNotice } from './actions'
import styles from './notices.module.css'

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📢 공지사항 관리</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
        {/* Create Form */}
        <div className={styles.formCard}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>✍️ 새 공지사항 작성</h3>
          <form action={async (formData) => { 'use server'; await createNotice(formData); }} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>제목</label>
              <input name="title" placeholder="공지 제목을 입력하세요" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>내용</label>
              <textarea name="content" placeholder="상세 내용을 입력하세요..." className={styles.textarea} required />
            </div>
            <div className={styles.row}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isImportant" value="true" /> 📌 필독 공지 (상단 강조)
              </label>
              <button type="submit" className={styles.submitBtn}>등록하기</button>
            </div>
          </form>
        </div>

        {/* List View */}
        <div className={styles.listSection}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>📋 공지사항 목록 ({notices.length}건)</h3>
          <div className={styles.list}>
            {notices.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '2rem', background: '#f9f9f9', borderRadius: '12px' }}>
                등록된 공지사항이 없습니다.
              </p>
            ) : (
              notices.map(notice => (
                <div key={notice.id} className={`${styles.noticeItem} ${notice.isImportant ? styles.important : ''}`}>
                  <div className={styles.noticeHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {notice.isImportant && <span className={styles.importantBadge}>필독</span>}
                      <span className={styles.date}>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <form action={async (formData) => { 'use server'; await updateNotice(notice.id, formData); }} className={styles.editForm}>
                    <input name="title" defaultValue={notice.title} className={styles.listTitle} placeholder="제목" />
                    <textarea name="content" defaultValue={notice.content} className={styles.listContent} placeholder="내용" />
                    
                    <div className={styles.itemFooter}>
                      <label className={styles.checkboxLabelSmall}>
                        <input type="checkbox" name="isImportant" value="true" defaultChecked={notice.isImportant} /> 중요표시
                      </label>
                      <div className={styles.actionGroup}>
                        <button type="submit" className={styles.miniSaveBtn}>저장</button>
                        <button formAction={async () => { 'use server'; await deleteNotice(notice.id); }} className={styles.miniDeleteBtn}>삭제</button>
                      </div>
                    </div>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
