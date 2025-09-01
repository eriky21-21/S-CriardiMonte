// components/VideoPreview.tsx
'use client'

import { useState } from 'react'

interface VideoPreviewProps {
  videoConfig: any
  onImprove: (suggestion: string) => void
  onSave: () => void
}

export function VideoPreview({ videoConfig, onImprove, onSave }: VideoPreviewProps) {
  const [improvementText, setImprovementText] = useState('')

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">🎬 Preview do Vídeo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Vídeo */}
        <div>
          <h4 className="font-semibold mb-2">Configurações:</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Duração:</strong> {videoConfig.duracao} segundos</p>
            <p><strong>Resolução:</strong> {videoConfig.resolucao}</p>
            <p><strong>Estilo:</strong> {videoConfig.estilo}</p>
            <p><strong>Músicas:</strong> {videoConfig.elementos.musicas.join(', ')}</p>
          </div>

          <button
            onClick={onSave}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            💾 Salvar Vídeo
          </button>
        </div>

        {/* Área de Melhorias */}
        <div>
          <h4 className="font-semibold mb-2">Solicitar Melhorias:</h4>
          <textarea
            value={improvementText}
            onChange={(e) => setImprovementText(e.target.value)}
            placeholder="Ex: Mude a música para algo mais épico, adicione texto no minuto 2:30, melhore a transição..."
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
          
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => onImprove(improvementText)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 cursor-pointer"
            >
              🚀 Aplicar Melhorias
            </button>
            
            <button
              onClick={() => onImprove('mude a música para algo mais animado')}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 cursor-pointer"
            >
              🔀 Mudar Música
            </button>
            
            <button
              onClick={() => onImprove('adicione texto com narração nos primeiros 30 segundos')}
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 cursor-pointer"
            >
              📝 Adicionar Texto
            </button>
          </div>
        </div>
      </div>

      {/* Player de Preview Simulado */}
      <div className="mt-6 bg-black rounded-lg p-4 text-center">
        <div className="aspect-video bg-gray-800 rounded flex items-center justify-center">
          <span className="text-white">🎥 Preview do Vídeo ({videoConfig.resolucao})</span>
        </div>
        <p className="text-white text-sm mt-2">
          Duração: {Math.floor(videoConfig.duracao / 60)}min {videoConfig.duracao % 60}s
        </p>
      </div>
    </div>
  )
}
