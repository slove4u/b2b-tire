'use client'

import { useState, useEffect } from 'react'
import styles from './BannerCarousel.module.css'

export default function BannerCarousel({ banners }: { banners: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) return null

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.slidesWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner, index) => (
          <div key={banner.id} className={styles.slide}>
            <a href={banner.link || '#'} className={styles.link}>
              <img src={banner.imageUrl} alt={banner.title || 'Banner'} className={styles.image} />
              {banner.title && (
                <div className={styles.overlay}>
                  <h2>{banner.title}</h2>
                </div>
              )}
            </a>
          </div>
        ))}
      </div>
      
      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
