// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { CriarVideoTab } from '@/components/CriarVideoTab'
import { ModelosTab } from '@/components/ModelosTab'
import { IdeiasTab } from '@/components/IdeiasTab'
import { ModelsManager } from '@/lib/models-manager'
import { VideoModel } from '@/types/video'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('criar')
  const [modelos, setModelos] = useState<VideoModel[]>([])

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🎬 Studio de Vídeos Virais</h1>
          <p className="text-sm text-gray-600">Crie conteúdo engaging para redes sociais</p>
        </div>
      </header>

      {/* Abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {['criar', 'modelos', 'ideias'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              } cursor-pointer`}
            >
              {tab === 'criar' && '🎥 Criar Vídeo'}
              {tab === 'modelos' && '📁 Modelos'}
              {tab === 'ideias' && '💡 Ideias'}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        <div className="mt-6">
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
