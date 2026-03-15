import styles from './NoticeWidget.module.css'

export default function NoticeWidget({ notices }: { notices: any[] }) {
  if (notices.length === 0) return null

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3>📢 주요 공지사항</h3>
      </div>
      <div className={styles.list}>
        {notices.map(notice => (
          <div key={notice.id} className={`${styles.item} ${notice.isImportant ? styles.important : ''}`}>
            <div className={styles.itemHeader}>
              <span className={styles.title}>
                {notice.isImportant && <span className={styles.badge}>필독</span>}
                {notice.title}
              </span>
              <span className={styles.date}>{new Date(notice.createdAt).toLocaleDateString()}</span>
            </div>
            <p className={styles.content}>{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
