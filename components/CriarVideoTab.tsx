// components/CriarVideoTab.tsx (atualizado)
'use client'

import { useState } from 'react'
import { UploadManager } from './UploadManager'
import { VideoPreview } from './VideoPreview'
import { VideoGenerationProgress } from './VideoGenerationProgress'
import { VideoAIGenerator } from '@/lib/ai-generator'
import { ModelsManager } from '@/lib/models-manager'
import { VideoConfig } from '@/types/video'

export function CriarVideoTab({ onModeloSalvo }: { onModeloSalvo: () => void }) {
  const [texto, setTexto] = useState('')
  const [gerando, setGerando] = useState(false)
  const [midiasUploaded, setMidiasUploaded] = useState<string[]>([])
  const [videoGerado, setVideoGerado] = useState<VideoConfig | null>(null)
  const [mostrarPreview, setMostrarPreview] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [tempoEstimado, setTempoEstimado] = useState(0)

  const gerarVideo = async () => {
    try {
      setGerando(true)
      setProgresso(0)
      setMostrarPreview(false)
      
      // Calcula tempo estimado baseado no texto
      const estimatedTime = Math.max(10, Math.min(120, texto.length / 10))
      setTempoEstimado(estimatedTime)
      
      // Simula progresso em tempo real
      const interval = setInterval(() => {
        setProgresso(prev => {
          const newProgress = prev + (100 / estimatedTime)
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 1000)

      const config = await VideoAIGenerator.generateVideoFromText(texto)
      
      clearInterval(interval)
      setProgresso(100)
      
      setVideoGerado(config)
      setMostrarPreview(true)
      
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error)
      alert('Erro ao gerar vídeo')
    } finally {
      setGerando(false)
      setProgresso(0)
    }
  }

  // ... resto do código mantido ...
  
  return (
    <div className="space-y-6">
      {/* ... formulário existente ... */}
      
      <VideoGenerationProgress
        isGenerating={gerando}
        totalDuration={videoGerado?.duracao || 0}
        currentProgress={progresso}
        estimatedTime={tempoEstimado}
      />

      {/* ... preview e outros componentes ... */}
    </div>
  )
}
