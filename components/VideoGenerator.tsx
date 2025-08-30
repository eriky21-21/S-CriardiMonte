'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { VideoGenerator } from '../lib/videoGenerator'
import UploadMedia from './UploadMedia'

export default function VideoGenerator({ project, onBack }: { project: any, onBack: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [segments, setSegments] = useState<any[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([])

  useEffect(() => {
    loadSegments();
    loadUploadedMedia();
  }, [project]);

  const loadSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('video_segments')
        .select('*')
        .eq('video_id', project.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      console.error('Erro ao carregar segmentos:', error);
    }
  };

  const loadUploadedMedia = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('uploaded_media')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUploadedMedia(data || []);
    } catch (error) {
      console.error('Erro ao carregar mídias:', error);
    }
  };

  const generateVideo = async () => {
    setIsGenerating(true)
    setProgress(0)
    
    try {
      // Atualizar status para "generating"
      await supabase
        .from('videos')
        .update({ status: 'generating' })
        .eq('id', project.id);
      
      // Simular progresso (em produção, isso seria baseado em eventos reais)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
      
      // Gerar o vídeo (em produção, isso seria uma chamada para a API)
      const result = await VideoGenerator.generateVideo(project, segments);
      
      clearInterval(interval);
      setProgress(100);
      
      // Atualizar o projeto com a URL do vídeo
      const { error } = await supabase
        .from('videos')
        .update({ 
          video_url: result.videoUrl,
          thumbnail_url: result.thumbnailUrl,
          status: 'completed'
        })
        .eq('id', project.id);
      
      if (error) throw error;
      
      setVideoUrl(result.videoUrl);
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
      
      await supabase
        .from('videos')
        .update({ status: 'failed' })
        .eq('id', project.id);
      
      alert('Erro ao gerar vídeo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  }

  const addSegment = async (type: string, content: string = '', metadata: any = {}) => {
    try {
      const orderIndex = segments.length;
      
      const { data, error } = await supabase
        .from('video_segments')
        .insert([
          {
            video_id: project.id,
            type,
            content,
            duration: type === 'transition' ? 2 : 5,
            order_index: orderIndex,
            metadata
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setSegments([...segments, data]);
    } catch (error) {
      console.error('Erro ao adicionar segmento:', error);
      alert('Erro ao adicionar segmento');
    }
  };

  const updateSegment = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('video_segments')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setSegments(segments.map(segment => 
        segment.id === id ? { ...segment, ...updates } : segment
      ));
    } catch (error) {
      console.error('Erro ao atualizar segmento:', error);
    }
  };

  const deleteSegment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('video_segments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSegments(segments.filter(segment => segment.id !== id));
    } catch (error) {
      console.error('Erro ao excluir segmento:', error);
      alert('Erro ao excluir segmento');
    }
  };

  const moveSegment = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === segments.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newSegments = [...segments];
    [newSegments[index], newSegments[newIndex]] = [newSegments[newIndex], newSegments[index]];
    
    // Atualizar order_index no banco de dados
    newSegments.forEach((segment, i) => {
      if (segment.order_index !== i) {
        updateSegment(segment.id, { order_index: i });
      }
    });
    
    setSegments(newSegments);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mobile-padding">
      <button 
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-sm"
      >
        ← Voltar para projetos
      </button>
      
      <h2 className="text-xl font-semibold mb-4">Gerar Vídeo: {project.title}</h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2 text-sm">Roteiro:</h3>
        <p className="text-gray-700 text-sm">{project.script}</p>
      </div>
      
      {/* Editor de Segmentos */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-sm">Segmentos do Vídeo:</h3>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
          >
            {showUpload ? 'Fechar Upload' : 'Enviar Mídia'}
          </button>
        </div>
        
        {showUpload && (
          <div className="mb-3">
            <UploadMedia onMediaUpload={loadUploadedMedia} />
            
            {uploadedMedia.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Suas mídias:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedMedia.map(media => (
                    <div 
                      key={media.id} 
                      className="border rounded p-1 text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => addSegment('image', media.original_name, { mediaUrl: media.url })}
                    >
                      <div className="truncate">{media.original_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          <button 
            onClick={() => addSegment('text', 'Novo texto', { style: 'default' })}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
          >
            + Texto
          </button>
          <button 
            onClick={() => addSegment('image', '', { prompt: 'Descreva a imagem' })}
            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
          >
            + Imagem IA
          </button>
          <button 
            onClick={() => addSegment('transition')}
            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
          >
            + Transição
          </button>
        </div>
        
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={segment.id} className="segment-item">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded mr-2">
                      {segment.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {segment.duration}s
                    </span>
                  </div>
                  
                  {segment.type === 'text' && (
                    <input
                      type="text"
                      value={segment.content}
                      onChange={(e) => updateSegment(segment.id, { content: e.target.value })}
                      className="w-full p-1 text-xs border rounded"
                    />
                  )}
                  
                  {segment.type === 'image' && segment.metadata?.prompt && (
                    <input
                      type="text"
                      value={segment.metadata.prompt}
                      onChange={(e) => updateSegment(segment.id, { 
                        metadata: { ...segment.metadata, prompt: e.target.value } 
                      })}
                      className="w-full p-1 text-xs border rounded"
                      placeholder="Descreva a imagem para IA"
                    />
                  )}
                  
                  {segment.type === 'image' && segment.metadata?.mediaUrl && (
                    <div className="text-xs text-gray-600 truncate">
                      Arquivo: {segment.content}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-1 ml-2">
                  <button 
                    onClick={() => moveSegment(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveSegment(index, 'down')}
                    disabled={index === segments.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30 text-xs"
                  >
                    ↓
                  </button>
                  <button 
                    onClick={() => deleteSegment(segment.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                <span className="text-xs mr-2">Duração:</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={segment.duration}
                  onChange={(e) => updateSegment(segment.id, { duration: parseInt(e.target.value) })}
                  className="w-12 p-1 text-xs border rounded"
                />
                <span className="text-xs ml-1">seg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {!isGenerating && !videoUrl && (
        <button
          onClick={generateVideo}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
        >
          Gerar Vídeo com IA
        </button>
      )}
      
      {isGenerating && (
        <div className="space-y-4">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 text-sm">Gerando seu vídeo... {progress}%</p>
          
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className={`p-1 rounded ${progress >= 30 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
              Criando áudio
            </div>
            <div className={`p-1 rounded ${progress >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
              Gerando visuais
            </div>
            <div className={`p-1 rounded ${progress >= 90 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
              Finalizando
            </div>
          </div>
        </div>
      )}
      
      {videoUrl && (
        <div className="mt-4">
          <h3 className="font-medium mb-2 text-sm">Vídeo Gerado:</h3>
          <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-3">
            <video controls className="w-full h-full rounded">
              <source src={videoUrl} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
              Baixar Vídeo
            </button>
            <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs">
              Compartilhar
            </button>
            <button 
              onClick={() => generateVideo()}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            >
              Gerar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
