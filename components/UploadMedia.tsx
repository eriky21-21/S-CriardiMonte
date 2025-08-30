'use client'

import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function UploadMedia({ onMediaUpload }: { onMediaUpload: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar um arquivo para fazer upload.')
      }
      
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      
      // Fazer upload do arquivo para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)
      
      // Salvar metadados no banco de dados
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuário não autenticado')
      
      const { error: dbError } = await supabase
        .from('uploaded_media')
        .insert([
          {
            user_id: user.id,
            filename: filePath,
            original_name: file.name,
            url: publicUrl,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            size: file.size
          }
        ])
      
      if (dbError) throw dbError
      
      alert('Upload realizado com sucesso!')
      onMediaUpload()
      
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="border rounded p-3 bg-gray-50">
      <h4 className="text-sm font-medium mb-2">Enviar mídia (imagem/vídeo)</h4>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {uploading && (
        <div className="mt-2">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">Enviando... {Math.round(uploadProgress)}%</p>
        </div>
      )}
    </div>
  )
}
