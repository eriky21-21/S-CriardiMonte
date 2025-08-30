// app/logout/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem('authenticated')
    document.cookie = 'authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Saindo...</p>
    </div>
  )
}
