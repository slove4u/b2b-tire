'use client'

import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true)
      return
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Capture beforeinstallprompt for Chrome/Android
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show the prompt manually after a short delay if not standalone
    if (isIOSDevice && !isStandalone) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [isStandalone])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  if (!isVisible || isStandalone) return null

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <span style={{ fontSize: '1.5rem' }}>📱</span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={titleStyle}>홈 화면에 추가하기</h3>
            <p style={descStyle}>앱처럼 간편하게 접속하세요</p>
          </div>
          <button onClick={() => setIsVisible(false)} style={closeButtonStyle}>×</button>
        </div>

        {isIOS ? (
          <div style={iosInstructionStyle}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>
              하단 메뉴의 <strong>공유(Share)</strong> <span style={{fontSize:'1.2rem'}}>⎋</span> 버튼을 누른 후,
              <strong> '홈 화면에 추가'</strong>를 눌러주세요.
            </p>
          </div>
        ) : (
          <button onClick={handleInstallClick} style={installButtonStyle}>
             지금 설치하기
          </button>
        )}
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '1.5rem',
  left: '1rem',
  right: '1rem',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  width: '100%',
  maxWidth: '450px',
  padding: '1.2rem',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const iconContainerStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  background: 'var(--color-navy)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 800,
  color: '#1a1a1a',
}

const descStyle: React.CSSProperties = {
  margin: '2px 0 0 0',
  fontSize: '0.85rem',
  color: '#666',
}

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: '#999',
  cursor: 'pointer',
  padding: '0 5px',
}

const installButtonStyle: React.CSSProperties = {
  marginTop: '1.2rem',
  width: '100%',
  padding: '0.8rem',
  background: 'var(--color-navy)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
}

const iosInstructionStyle: React.CSSProperties = {
  marginTop: '1.2rem',
  padding: '1rem',
  background: '#f8fafc',
  borderRadius: '12px',
  border: '1px dashed #cbd5e1',
}
