'use client'

import { useEffect, useState, useRef } from 'react'

export default function AdminNotification() {
  const [lastOrderDate, setLastOrderDate] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Request permission for Web Notifications
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }

    // Interval to check for new orders (every 30 seconds)
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/orders/latest')
        if (res.ok) {
          const data = await res.json()
          if (data && data.createdAt) {
            // If it's the first check, just set the initial date
            if (!lastOrderDate) {
              setLastOrderDate(data.createdAt)
              return
            }

            // If we found a newer order
            if (new Date(data.createdAt) > new Date(lastOrderDate)) {
              setLastOrderDate(data.createdAt)
              triggerAlert(data)
            }
          }
        }
      } catch (e) {
        console.error('Notification check failed', e)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [lastOrderDate])

  const triggerAlert = (order: any) => {
    // 1. Play Sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio playback blocked'))
    }

    // 2. Browser Popup Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("새로운 발주 도착!", {
        body: `${order.user?.name || '거래처'}님이 ${order.totalAmount.toLocaleString()}원 규모의 발주를 접수했습니다.`,
        icon: '/icons/icon-192x192.png'
      })
    }

    // 3. Vibration (Mobile)
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />
      {/* Visual Indicator (Optional) */}
    </>
  )
}
