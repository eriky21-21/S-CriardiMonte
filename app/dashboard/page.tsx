// app/dashboard/page.tsx (atualizado)
'use client'

import { useState, useEffect } from 'react'
import { UploadManager } from '@/components/UploadManager'
import { VideoPreview } from '@/components/VideoPreview'
import { VideoAIGenerator } from '@/lib/ai-generator'
import { ModelsManager } from '@/lib/models-manager'
import { VideoModel, VideoConfig } from '@/types/video'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('criar')
  const [texto, setTexto] = useState('')
  const [gerando, setGerando] = useState(false)
  const [modelos, setModelos] = useState<VideoModel[]>([])
  const [midiasUploaded, setMidiasUploaded] = useState<string[]>([])
  const [videoGerado, setVideoGerado] = useState<VideoConfig | null>(null)
  const [mostrarPreview, setMostrarPreview] = useState(false)

  // ... outros estados e useEffect ...

  const gerarVideo = async () => {
    try {
      setGerando(true)
      const config = await VideoAIGenerator.generateVideoFromText(texto)
      
      // Ajusta a duração baseado no texto (8min = 480s)
      const duracaoMinutos = Math.max(30, Math.min(600, texto.length / 10)) // 30s to 10min
      config.duracao = duracaoMinutos
      
      setVideoGerado(config)
      setMostrarPreview(true)
      
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error)
      alert('Erro ao gerar vídeo')
    } finally {
      setGerando(false)
    }
  }

  const handleImprovement = async (suggestion: string) => {
    if (!videoGerado) return
    
    alert(`Melhoria solicitada: "${suggestion}"\n\nSistema de IA processando...`)
    
    // Simula processamento de melhoria
    const novoConfig = { ...videoGerado }
    
    if (suggestion.includes('música')) {
      novoConfig.elementos.musicas = ['nova_musica_epica', 'trilha_emotional']
    }
    
    if (suggestion.includes('texto') || suggestion.includes('narração')) {
      novoConfig.elementos.textos.push('Texto adicional com narração')
    }
    
    setVideoGerado(novoConfig)
    alert('Melhorias aplicadas com sucesso! ✅')
  }

  const salvarVideo = async () => {
    if (!videoGerado) return
    
    try {
      const modelo: Omit<VideoModel, 'id' | 'created_at'> = {
        nome: `Vídeo ${new Date().toLocaleDateString()}`,
        descricao: texto.slice(0, 100) + '...',
        config: videoGerado
      }

      await ModelsManager.salvarModelo(modelo)
      await carregarModelos()
      alert('Vídeo salvo com sucesso! 🎉')
      
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error)
      alert('Erro ao salvar vídeo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ... header e abas ... */}
      
      <div className="mt-6">
        {activeTab === 'criar' && (
          <div className="space-y-6">
            {/* ... formulário existente ... */}
            
            {mostrarPreview && videoGerado && (
              <VideoPreview
                videoConfig={videoGerado}
                onImprove={handleImprovement}
                onSave={salvarVideo}
              />
            )}
          </div>
        )}
        {/* ... outras abas ... */}
      </div>
    </div>
  )
}
