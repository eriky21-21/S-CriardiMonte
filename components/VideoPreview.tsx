// components/VideoPreview.tsx
'use client'

import { useState } from 'react'

interface VideoPreviewProps {
  videoConfig: any
  onImprove: (suggestion: string) => void
  onSave: () => void
  onRegenerate?: () => void // Nova prop opcional
}

export function VideoPreview({ videoConfig, onImprove, onSave, onRegenerate }: VideoPreviewProps) {
  const [improvementText, setImprovementText] = useState('')
  const [isApplyingImprovement, setIsApplyingImprovement] = useState(false)

  const handleImprovement = async (suggestion: string) => {
    setIsApplyingImprovement(true)
    await onImprove(suggestion)
    setIsApplyingImprovement(false)
    setImprovementText('') // Limpa o texto após aplicar
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}min ${secs}s`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6 border-2 border-green-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-green-800">🎬 Preview do Vídeo - PRONTO!</h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          ✅ Gerado com sucesso
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Vídeo */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">📋 Configurações do Vídeo:</h4>
          <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Duração:</span>
              <span className="bg-blue-100 text-blue-800 px-2 rounded">{formatDuration(videoConfig.duracao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Resolução:</span>
              <span className="bg-purple-100 text-purple-800 px-2 rounded">{videoConfig.resolucao}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estilo:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 rounded capitalize">{videoConfig.estilo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Qualidade:</span>
              <span className="bg-green-100 text-green-800 px-2 rounded capitalize">{videoConfig.qualidade || 'high'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estratégia:</span>
              <span className="bg-orange-100 text-orange-800 px-2 rounded text-xs">
                {videoConfig.duracao > 180 ? '🎯 Otimizado para longa duração' : '⚡ Máxima qualidade'}
              </span>
            </div>
            <div>
              <span className="font-medium">Músicas:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {videoConfig.elementos.musicas.map((musica: string, index: number) => (
                  <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                    🎵 {musica}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={onSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer flex items-center"
            >
              💾 Salvar Vídeo
            </button>
            
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
              >
                🔄 Gerar Novamente
              </button>
            )}
          </div>
        </div>

        {/* Área de Melhorias */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">✨ Solicitar Melhorias:</h4>
          <textarea
            value={improvementText}
            onChange={(e) => setImprovementText(e.target.value)}
            placeholder="Ex: Mude a música para algo mais épico, adicione texto no minuto 2:30, melhore a transição, inclua CIA no final..."
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            disabled={isApplyingImprovement}
          />
          
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => handleImprovement(improvementText)}
              disabled={isApplyingImprovement || !improvementText.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 cursor-pointer flex items-center"
            >
              {isApplyingImprovement ? '⏳ Aplicando...' : '🚀 Aplicar Melhorias'}
            </button>
            
            <button
              onClick={() => handleImprovement('mude a música para algo mais épico e animado')}
              disabled={isApplyingImprovement}
              className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
            >
              🔀 Mudar Música
            </button>
            
            <button
              onClick={() => handleImprovement('adicione texto com narração profissional e CIA para inscrição')}
              disabled={isApplyingImprovement}
              className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
            >
              📝 Add Texto + CIA
            </button>
          </div>

          {/* Dicas Rápidas */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 font-medium">💡 Dicas para vídeos virais:</p>
            <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
              <li>Incluir "CIA" (Call-to-Action) no final</li>
              <li>Texto claro e objetivo</li>
              <li>Música que combine com o estilo</li>
              <li>Transições suaves entre cenas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Player de Preview Simulado */}
      <div className="mt-6 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 text-center">
        <div className="aspect-video bg-black bg-opacity-50 rounded flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🎥</div>
            <span className="text-white font-semibold">Preview do Vídeo ({videoConfig.resolucao})</span>
            <p className="text-gray-300 text-sm mt-1">
              {formatDuration(videoConfig.duracao)} • {videoConfig.estilo} • {videoConfig.qualidade}
            </p>
          </div>
        </div>
        
        {/* Controles Simulados */}
        <div className="flex justify-center mt-4 gap-3">
          <button className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-xs">▶️ Play</button>
          <button className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-xs">⏸️ Pause</button>
          <button className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-xs">🔉 Volume</button>
        </div>
      </div>
    </div>
  )
}
