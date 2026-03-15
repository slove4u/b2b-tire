import { createBanner, deleteBanner, updateBanner } from './actions'
import { upsertTopBanner, toggleTopBanner } from './top-banner-actions'
import prisma from '@/lib/prisma'
import styles from './banners.module.css'

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { priority: 'asc' }
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>배너 광고 관리</h1>
      
      {/* Top Strip Announcement Management */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>상단 띠 공지 관리</h2>
        <div className={styles.formCard}>
          <form action={async (formData) => {
            'use server'
            const content = formData.get('content') as string
            const isActive = formData.get('isActive') === 'true'
            await upsertTopBanner(content, isActive)
          }} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>상단 공재 내용 (⚠️ 아이콘은 자동 포함)</label>
              <textarea 
                name="content" 
                placeholder="금호타이어 일부 규격 5% 인상. 발주 문의: 010-0000-0000" 
                className={styles.textarea}
                defaultValue={(await (prisma as any).topBanner.findFirst())?.content || ''}
              />
            </div>
            <div className={styles.row}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  defaultChecked={(await (prisma as any).topBanner.findFirst())?.isActive ?? true}
                  name="isActive"
                  value="true"
                />
                전광판 활성화
              </label>
              <button type="submit" className={styles.submitBtn}>저장하기</button>
            </div>
          </form>
        </div>
      </section>

      <hr className={styles.hr} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>메인 슬라이드 배너 관리</h2>
        <div className={styles.formCard}>
          <h3>새 배너 등록</h3>
          <form action={async (formData) => { 'use server'; await createBanner(formData); }} className={styles.form}>
            <input name="imageUrl" placeholder="이미지 URL (예: https://...)" className={styles.input} required />
            <input name="link" placeholder="연결 링크 (선택)" className={styles.input} />
            <input name="priority" type="number" placeholder="우선순위 (낮을수록 앞)" className={styles.input} defaultValue="0" />
            <button type="submit" className={styles.submitBtn}>등록하기</button>
          </form>
        </div>

        <div className={styles.list}>
          {banners.map(banner => (
            <div key={banner.id} className={styles.bannerItem}>
              <div className={styles.preview}>
                <img src={banner.imageUrl} alt="Banner Preview" className={styles.previewImg} />
              </div>
              <div className={styles.details}>
                <form action={async (formData) => { 'use server'; await updateBanner(banner.id, formData); }} className={styles.editForm}>
                  <input name="imageUrl" defaultValue={banner.imageUrl} className={styles.input} />
                  <input name="link" defaultValue={banner.link || ''} className={styles.input} />
                  <div className={styles.row}>
                    <label>순서: <input name="priority" type="number" defaultValue={banner.priority} style={{ width: '60px' }} /></label>
                    <label>
                      활성: 
                      <select name="isActive" defaultValue={String(banner.isActive)}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </label>
                    <button type="submit" className={styles.saveBtn}>저장</button>
                  </div>
                </form>
                <form action={async () => { 'use server'; await deleteBanner(banner.id); }}>
                  <button type="submit" className={styles.deleteBtn}>삭제</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
