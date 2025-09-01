// components/UploadManager.tsx
'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export function UploadManager({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      // Verifica tipo e tamanho
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime']
      if (!validTypes.includes(file.type)) {
        alert('Tipo de arquivo não suportado')
        return
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB max
        alert('Arquivo muito grande (máx. 50MB)')
        return
      }

      // Faz upload para Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (error) throw error

      // Obtém URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)
      alert('Upload realizado com sucesso!')

    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*,video/*"
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer"
      >
        {uploading ? 'Fazendo Upload...' : 'Fazer Upload de Mídia'}
      </button>
    </div>
  )
}
