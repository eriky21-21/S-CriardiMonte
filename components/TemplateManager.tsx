'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TemplateManager({ project, onSelectTemplate }: { 
  project: any, 
  onSelectTemplate: (template: any) => void 
}) {
  const [templates, setTemplates] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or('is_public.eq.true,user_id.eq.' + (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    }
  }

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Por favor, informe um nome para o template')
      return
    }
    
    setSaving(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Você precisa estar logado para salvar um template')
        return
      }
      
      // Obter segmentos do projeto atual
      const { data: segments } = await supabase
        .from('video_segments')
        .select('*')
        .eq('video_id', project.id)
        .order('order_index', { ascending: true })
      
      const config = {
        title: project.title,
        description: project.description,
        script: project.script,
        videoType: project.video_type,
        segments: segments || []
      }
      
      const { error } = await supabase
        .from('templates')
        .insert([
          {
            user_id: user.id,
            name: templateName,
            description: templateDescription,
            config,
            is_public: isPublic
          }
        ])
      
      if (error) throw error
      
      alert('Template salvo com sucesso!')
      setShowForm(false)
      setTemplateName('')
      setTemplateDescription('')
      setIsPublic(false)
      loadTemplates()
    } catch (error) {
      console.error('Erro ao salvar template:', error)
      alert('Erro ao salvar template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mobile-padding">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Gerenciar Templates</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Novo Template'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2 text-sm">Salvar Template Atual</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Template *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
              />
            </div>
            
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Template público</span>
              </label>
            </div>
            
            <div>
              <button
                onClick={saveTemplate}
                disabled={saving || !templateName.trim()}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {saving ? 'Salvando...' : 'Salvar Template'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h4 className="font-medium mb-2 text-sm">Templates Disponíveis</h4>
        
        {templates.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum template disponível.</p>
        ) : (
          <div className="space-y-2">
            {templates.map(template => (
              <div key={template.id} className="border rounded p-2 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-sm">{template.name}</h5>
                    {template.description && (
                      <p className="text-xs text-gray-600">{template.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {template.is_public ? 'Público' : 'Privado'} • 
                      {new Date(template.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                  >
                    Usar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
