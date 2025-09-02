// components/CriarVideoTab.tsx
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
    if (!texto.trim()) {
      alert('Por favor, digite ou cole sua ideia para o vídeo!')
      return
    }

    try {
      setGerando(true)
      setProgresso(0)
      setMostrarPreview(false)
      setVideoGerado(null)
      
      // Calcula tempo estimado baseado no tamanho do texto
      const estimatedTime = Math.max(15, Math.min(180, texto.length / 20))
      setTempoEstimado(estimatedTime)
      
      // Simula progresso em tempo real
      const interval = setInterval(() => {
        setProgresso(prev => {
          const newProgress = prev + (100 / estimatedTime)
          return newProgress >= 95 ? 95 : newProgress // Para em 95% até finalizar
        })
      }, 1000)

      // Gera a configuração do vídeo
      const config = await VideoAIGenerator.generateVideoFromText(texto)
      
      // Finaliza o progresso
      clearInterval(interval)
      setProgresso(100)
      
      // Aguarda um pouco para mostrar o progresso completo
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setVideoGerado(config)
      setMostrarPreview(true)
      
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error)
      alert('Erro ao gerar vídeo. Tente novamente.')
    } finally {
      setGerando(false)
      setProgresso(0)
    }
  }

  const salvarVideo = async () => {
    if (!videoGerado) return
    
    try {
      const modelo = {
        nome: `Vídeo ${new Date().toLocaleDateString('pt-BR')}`,
        descricao: texto.slice(0, 120) + (texto.length > 120 ? '...' : ''),
        config: videoGerado
      }

      await ModelsManager.salvarModelo(modelo)
      onModeloSalvo()
      alert('✅ Vídeo salvo como modelo!')
      
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error)
      alert('❌ Erro ao salvar vídeo')
    }
  }

  return (
    <div className="space-y-6">
      {/* Área de Texto Grande */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📝 Digite ou cole seu texto para o vídeo:
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={8}
          className="w-full border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Ex: Crie um vídeo motivacional de 8 minutos sobre perseverança... 
Ou cole um texto completo para narrar e transformar em vídeo...
          
Dica: Quanto mais detalhes, melhor o resultado! 🚀"
          disabled={gerando}
        />
        <p className="text-xs text-gray-500 mt-1">
          Caracteres: {texto.length} | Palavras: {texto.split(/\s+/).filter(Boolean).length}
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={gerarVideo}
          disabled={gerando || !texto.trim()}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer font-semibold flex items-center"
        >
          {gerando ? '⏳ Gerando...' : '🚀 Gerar Vídeo Automaticamente'}
        </button>

        <UploadManager 
          onUploadComplete={(url) => setMidiasUploaded([...midiasUploaded, url])} 
        />

        <button 
          onClick={salvarVideo}
          disabled={!videoGerado || gerando}
          className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
        >
          💾 Salvar como Modelo
        </button>
      </div>

      {/* Progresso da Geração */}
      <VideoGenerationProgress
        isGenerating={gerando}
        totalDuration={videoGerado?.duracao || 0}
        currentProgress={progresso}
        estimatedTime={tempoEstimado}
      />

      {/* Mídias Uploaded */}
      {midiasUploaded.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">📁 Mídias Carregadas:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {midiasUploaded.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Mídia ${index + 1}`} 
                  className="w-full h-24 object-cover rounded border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded flex items-center justify-center">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                    Ver
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview do Vídeo */}
      {mostrarPreview && videoGerado && (
        <VideoPreview
          videoConfig={videoGerado}
          onImprove={(suggestion) => {
            alert(`🎯 Melhoria solicitada: "${suggestion}"\n\nSistema irá reprocessar...`)
            // Aqui você pode implementar o reprocessamento
          }}
          onSave={salvarVideo}
        />
      )}
    </div>
  )
}
