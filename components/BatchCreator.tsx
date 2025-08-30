'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { generateViralIdeas } from '../lib/viralThemes'

export default function BatchCreator() {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])

  const generateBatch = async (type: 'long' | 'short', count: number) => {
    setGenerating(true)
    setProgress(0)
    setResults([])
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')
      
      const ideas = generateViralIdeas(type, count)
      
      for (let i = 0; i < ideas.length; i++) {
        const idea = ideas[i]
        
        // Criar projeto
        const { data: project, error: projectError } = await supabase
          .from('videos')
          .insert([
            {
              title: idea.title,
              description: idea.description,
              script: type === 'short' 
                ? `${idea.hook}. ${idea.content}. ${idea.cta}`
                : `${idea.intro}. ${idea.mainContent1}. ${idea.mainContent2}. ${idea.conclusion}`,
              video_type: type,
              duration: type === 'long' ? 480 : 60,
              user_id: user.id,
              status: 'draft'
            }
          ])
          .select()
          .single()
        
        if (projectError) throw projectError
        
        // Configuração de IA
        await supabase
          .from('ai_configs')
          .insert([
            {
              video_id: project.id,
              voice_model: 'female-1',
              background_music: type === 'short' ? 'upbeat' : 'inspiring',
              subtitles_enabled: true,
              style: 'viral',
              text_to_image_prompt: idea.imagePrompt
            }
          ])
        
        // Segmentos automáticos
        const segments = type === 'short' 
          ? [
              { type: 'text', content: idea.hook, duration: 3, order_index: 0 },
              { type: 'transition', duration: 1, order_index: 1 },
              { type: 'text', content: idea.content, duration: 4, order_index: 2 },
              { type: 'transition', duration: 1, order_index: 3 },
              { type: 'text', content: idea.cta, duration: 3, order_index: 4 },
            ]
          : [
              { type: 'text', content: idea.intro, duration: 10, order_index: 0 },
              { type: 'transition', duration: 2, order_index: 1 },
              { type: 'text', content: idea.mainContent1, duration: 30, order_index: 2 },
              { type: 'transition', duration: 2, order_index: 3 },
              { type: 'text', content: idea.mainContent2, duration: 30, order_index: 4 },
              { type: 'transition', duration: 2, order_index: 5 },
              { type: 'text', content: idea.conclusion, duration: 15, order_index: 6 },
            ]
        
        for (const segment of segments) {
          await supabase
            .from('video_segments')
            .insert([{ ...segment, video_id: project.id }])
        }
        
        setResults(prev => [...prev, { ...project, idea }])
        setProgress(((i + 1) / ideas.length) * 100)
      }
      
    } catch (error) {
      console.error('Erro ao criar batch:', error)
      alert('Erro ao criar vídeos em lote')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mobile-padding">
      <h2 className="text-xl font-semibold mb-4">Criação em Lote</h2>
      <p className="text-gray-600 mb-4 text-sm">Crie múltiplos vídeos de uma vez para produção diária</p>
      
      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="border rounded-lg p-3">
          <h3 className="font-medium mb-2 text-sm">Vídeos Longos (8min+)</h3>
          <p className="text-xs text-gray-600 mb-2">Ideias para vídeos detalhados</p>
          <button
            onClick={() => generateBatch('long', 3)}
            disabled={generating}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Gerar 3 Vídeos Longos
          </button>
        </div>
        
        <div className="border rounded-lg p-3">
          <h3 className="font-medium mb-2 text-sm">Shorts (1min)</h3>
          <p className="text-xs text-gray-600 mb-2">Conteúdo rápido e viral</p>
          <button
            onClick={() => generateBatch('short', 6)}
            disabled={generating}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            Gerar 6 Shorts
          </button>
        </div>
      </div>
      
      {generating && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {results.length > 0 && (
        <div>
          <h3 className="font-medium mb-3 text-sm">Vídeos Criados</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={result.id} className="border rounded-lg p-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{result.title}</h4>
                    <p className="text-xs text-gray-600">{result.idea.description}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs rounded">
                      {result.video_type === 'long' ? 'Longo' : 'Short'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
