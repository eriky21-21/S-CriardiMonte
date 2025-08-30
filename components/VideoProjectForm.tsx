'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function VideoProjectForm({ 
  onProjectCreate, 
  template 
}: { 
  onProjectCreate: (project: any) => void, 
  template?: any 
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [script, setScript] = useState('')
  const [videoType, setVideoType] = useState('long')
  const [isLoading, setIsLoading] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    if (template) {
      setTitle(template.config.title || '');
      setDescription(template.config.description || '');
      setScript(template.config.script || '');
      setVideoType(template.config.videoType || 'long');
    }
    loadTemplates();
  }, [template]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or('is_public.eq.true,user_id.eq.' + (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Você precisa estar logado para criar um projeto')
        return
      }
      
      const { data, error } = await supabase
        .from('videos')
        .insert([
          {
            title,
            description,
            script,
            video_type: videoType,
            duration: videoType === 'long' ? 480 : 60,
            user_id: user.id
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      
      // Configuração padrão de IA
      const { error: aiError } = await supabase
        .from('ai_configs')
        .insert([
          {
            video_id: data.id,
            voice_model: 'female-1',
            background_music: 'upbeat',
            subtitles_enabled: true,
            style: 'viral'
          }
        ])
      
      if (aiError) throw aiError
      
      // Segmentos iniciais baseados no template ou padrão
      const initialSegments = template?.config.segments || [
        { type: 'text', content: 'Introdução', duration: 5, order_index: 0 },
        { type: 'transition', duration: 2, order_index: 1 },
        { type: 'text', content: 'Conteúdo principal', duration: 10, order_index: 2 },
        { type: 'transition', duration: 2, order_index: 3 },
        { type: 'text', content: 'Conclusão', duration: 5, order_index: 4 },
      ];
      
      for (const segment of initialSegments) {
        const { error: segmentError } = await supabase
          .from('video_segments')
          .insert([{ ...segment, video_id: data.id }]);
        
        if (segmentError) throw segmentError;
      }
      
      onProjectCreate(data)
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      alert('Erro ao criar projeto. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const applyTemplate = (template: any) => {
    setTitle(template.config.title || '');
    setDescription(template.config.description || '');
    setScript(template.config.script || '');
    setVideoType(template.config.videoType || 'long');
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mobile-padding">
      <h2 className="text-xl font-semibold mb-4">Novo Projeto de Vídeo</h2>
      
      {/* Seletor de Templates */}
      {templates.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Usar template:</h3>
          <div className="grid grid-cols-2 gap-2">
            {templates.slice(0, 4).map(template => (
              <div 
                key={template.id} 
                className="border rounded p-2 text-sm cursor-pointer hover:bg-gray-50"
                onClick={() => applyTemplate(template)}
              >
                {template.name}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título do Vídeo
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="script" className="block text-sm font-medium text-gray-700">
            Roteiro (o que será dito no vídeo)
          </label>
          <textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Vídeo
          </label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="long"
                checked={videoType === 'long'}
                onChange={() => setVideoType('long')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Vídeo Longo (8min)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="short"
                checked={videoType === 'short'}
                onChange={() => setVideoType('short')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Short (1min)</span>
            </label>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Criando...' : 'Criar Projeto'}
          </button>
        </div>
      </form>
    </div>
  )
}
