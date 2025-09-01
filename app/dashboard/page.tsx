// app/dashboard/page.tsx (atualizado)
'use client'

import { useState, useEffect } from 'react'
import { UploadManager } from '@/components/UploadManager'
import { VideoAIGenerator } from '@/lib/ai-generator'
import { ModelsManager } from '@/lib/models-manager'
import { VideoModel, VideoConfig } from '@/types/video'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('criar')
  const [texto, setTexto] = useState('')
  const [gerando, setGerando] = useState(false)
  const [modelos, setModelos] = useState<VideoModel[]>([])
  const [midiasUploaded, setMidiasUploaded] = useState<string[]>([])

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

  const gerarVideo = async () => {
    try {
      setGerando(true)
      const config = await VideoAIGenerator.generateVideoFromText(texto)
      
      // Simulação de geração de vídeo
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      alert('Vídeo gerado com sucesso! Configuração: ' + JSON.stringify(config, null, 2))
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error)
      alert('Erro ao gerar vídeo')
    } finally {
      setGerando(false)
    }
  }

  const salvarComoModelo = async () => {
    try {
      const modelo: Omit<VideoModel, 'id' | 'created_at'> = {
        nome: `Modelo ${new Date().toLocaleDateString()}`,
        descricao: texto.slice(0, 100) + '...',
        config: await VideoAIGenerator.generateVideoFromText(texto)
      }

      await ModelsManager.salvarModelo(modelo)
      await carregarModelos()
      alert('Modelo salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar modelo:', error)
      alert('Erro ao salvar modelo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ... header e abas mantidos ... */}
      
      {/* Conteúdo atualizado */}
      <div className="mt-6">
        {activeTab === 'criar' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descreva o vídeo viral que você quer criar:
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Um vídeo viral motivacional com paisagens espetaculares em 4K, texto inspirador e música épica..."
              />
            </div>

            <div className="flex space-x-4 flex-wrap gap-2">
              <button
                onClick={gerarVideo}
                disabled={gerando || !texto.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer font-semibold"
              >
                {gerando ? '🎬 Gerando Vídeo 4K...' : '🚀 Gerar Vídeo Automaticamente'}
              </button>

              <UploadManager onUploadComplete={(url) => setMidiasUploaded([...midiasUploaded, url])} />

              <button 
                onClick={salvarComoModelo}
                disabled={!texto.trim()}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
              >
                💾 Salvar como Modelo
              </button>
            </div>

            {midiasUploaded.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Mídias Uploaded:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {midiasUploaded.map((url, index) => (
                    <img key={index} src={url} alt="Uploaded" className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'modelos' && (
          <div>
            <h3 className="text-lg font-medium mb-4">📁 Modelos Salvos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelos.map((modelo) => (
                <div key={modelo.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">{modelo.nome}</h4>
                  <p className="text-sm text-gray-600">{modelo.descricao}</p>
                  <p className="text-xs text-gray-500">Resolução: {modelo.config.resolucao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ideias' && (
          <div>
            <h3 className="text-lg font-medium mb-4">💡 Upload para Ideias</h3>
            <UploadManager onUploadComplete={(url) => console.log('Ideia uploaded:', url)} />
          </div>
        )}
      </div>
    </div>
  )
}
