// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CriarVideoTab } from '@/components/CriarVideoTab'
import { ModelosTab } from '@/components/ModelosTab'
import { IdeiasTab } from '@/components/IdeiasTab'
import { ModelsManager } from '@/lib/models-manager'
import { VideoModel } from '@/types/video'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('criar')
  const [modelos, setModelos] = useState<VideoModel[]>([])
  const router = useRouter()

  useEffect(() => {
    carregarModelos()
  }, [])

  const carregarModelos = async () => {
    try {
      const modelosData = await ModelsManager.carregarModelos()
      setModelos(modelosData)
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    document.cookie = 'authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header com Logout */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎬 Studio de Vídeos Virais</h1>
            <p className="text-sm text-gray-600">Crie conteúdo engaging para redes sociais</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer text-sm"
          >
            🚪 Sair
          </button>
        </div>
      </header>

      {/* Abas de Navegação */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          {[
            { id: 'criar', label: '🎥 Criar Vídeo' },
            { id: 'modelos', label: '📁 Modelos' },
            { id: 'ideias', label: '💡 Ideias' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } cursor-pointer rounded-t-md`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'criar' && (
            <CriarVideoTab onModeloSalvo={carregarModelos} />
          )}
          
          {activeTab === 'modelos' && (
            <ModelosTab modelos={modelos} onCarregarModelos={carregarModelos} />
          )}
          
          {activeTab === 'ideias' && (
            <IdeiasTab />
          )}
        </div>
      </div>
    </div>
  )
}
