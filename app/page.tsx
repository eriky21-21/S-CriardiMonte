// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // CORRIGIDO: Use NEXT_PUBLIC_APP_PIN
    const correctPin = process.env.NEXT_PUBLIC_APP_PIN || '1234'
    
    if (pin === correctPin) {
      // Salva tanto no localStorage quanto em cookie para o middleware
      localStorage.setItem('authenticated', 'true')
      document.cookie = 'authenticated=true; path=/; max-age=86400' // 1 dia
      router.push('/dashboard')
    } else {
      setError('PIN incorreto')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Acesso Restrito
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite o PIN de acesso
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Digite o PIN"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  )
}
// No return do app/page.tsx, adicione:
<div className="text-xs text-gray-400 text-center mt-4">
  Debug: PIN esperado: {process.env.NEXT_PUBLIC_APP_PIN || '1234 (padrão)'}
</div>
