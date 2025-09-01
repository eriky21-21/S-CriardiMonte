// components/IdeiasTab.tsx
'use client'

import { UploadManager } from './UploadManager'

export function IdeiasTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">💡 Upload para Ideias</h3>
      <p className="text-sm text-gray-600 mb-4">
        Faça upload de imagens, vídeos ou áudios para inspirar a criação de seus vídeos virais!
      </p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <UploadManager onUploadComplete={(url) => {
          alert('Ideia salva com sucesso! ✅\nURL: ' + url)
        }} />
        
        <p className="mt-4 text-sm text-gray-500">
          Formatos suportados: Imagens, Vídeos, Áudios (até 200MB)
        </p>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800">💡 Dicas para Ideias Virais:</h4>
        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
          <li>Conteúdo emocional e inspirador</li>
          <li>Surpresa e curiosidade</li>
          <li>Mensagens positivas e motivacionais</li>
          <li>Visual impactante e cores vibrantes</li>
        </ul>
      </div>
    </div>
  )
}
