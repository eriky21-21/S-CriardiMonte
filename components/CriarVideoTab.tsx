// components/CriarVideoTab.tsx
'use client'

import { useState } from 'react'
import { UploadManager } from './UploadManager'
import { VideoPreview } from './VideoPreview'
import { VideoAIGenerator } from '@/lib/ai-generator'
import { ModelsManager } from '@/lib/models-manager'
import { VideoConfig } from '@/types/video'

interface CriarVideoTabProps {
  onModeloSalvo: () => void
}

export function CriarVideoTab({ onModeloSalvo }: CriarVideoTabProps) {
  const [texto, setTexto] = useState('')
  const [gerando, setGerando] = useState(false)
  const [midiasUploaded, setMidiasUploaded] = useState<string[]>([])
  const [videoGerado, setVideoGerado] = useState<VideoConfig | null>(null)
  const [mostrarPreview, setMostrarPreview] = useState(false)

  const gerarVideo = async () => {
    try {
      setGerando(true)
      const config = await VideoAIGenerator.generateVideoFromText(texto)
      
      // Ajusta a duração baseado no texto
      const duracaoMinutos = Math.max(30, Math.min(600, texto.length / 10))
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
    
    alert(`Melhoria solicitada: "${suggestion}"`)
    
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
      const modelo = {
        nome: `Vídeo ${new Date().toLocaleDateString()}`,
        descricao: texto.slice(0, 100) + '...',
        config: videoGerado
      }

      await ModelsManager.salvarModelo(modelo)
      onModeloSalvo()
      alert('Vídeo salvo com sucesso! 🎉')
      
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error)
      alert('Erro ao salvar vídeo')
    }
  }

  return (
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
          onClick={salvarVideo}
          disabled={!videoGerado}
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

      {mostrarPreview && videoGerado && (
        <VideoPreview
          videoConfig={videoGerado}
          onImprove={handleImprovement}
          onSave={salvarVideo}
        />
      )}
    </div>
  )
}
