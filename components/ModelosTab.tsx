// components/ModelosTab.tsx
'use client'

import { VideoModel } from '@/types/video'

interface ModelosTabProps {
  modelos: VideoModel[]
  onCarregarModelos: () => void
}

export function ModelosTab({ modelos, onCarregarModelos }: ModelosTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">📁 Modelos Salvos</h3>
        <button
          onClick={onCarregarModelos}
          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 cursor-pointer"
        >
          🔄 Atualizar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelos.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Nenhum modelo salvo ainda. Crie seu primeiro vídeo!
          </div>
        ) : (
          modelos.map((modelo) => (
            <div key={modelo.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">{modelo.nome}</h4>
              <p className="text-sm text-gray-600">{modelo.descricao}</p>
              <p className="text-xs text-gray-500">
                Resolução: {modelo.config.resolucao} | 
                Duração: {Math.floor(modelo.config.duracao / 60)}min
              </p>
              <button className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 cursor-pointer">
                Usar Este Modelo
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
