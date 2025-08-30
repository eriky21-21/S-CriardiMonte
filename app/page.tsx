'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Auth from '../components/Auth'
import VideoProjectForm from '../components/VideoProjectForm'
import VideoGenerator from '../components/VideoGenerator'
import TemplateManager from '../components/TemplateManager'
import BatchCreator from '../components/BatchCreator'

type View = 'projects' | 'create' | 'edit' | 'templates' | 'batch'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [view, setView] = useState<View>('batch')
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      loadProjects()
    }
  }, [session])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mobile-optimized">Criador de Vídeos Virais</h1>
            <p className="text-xs text-gray-600 mobile-optimized">YouTube, Instagram, TikTok</p>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setView('batch')}
              className={`px-2 py-1 rounded text-xs ${view === 'batch' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Produção
            </button>
            <button
              onClick={() => setView('projects')}
              className={`px-2 py-1 rounded text-xs ${view === 'projects' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Meus Vídeos
            </button>
            <button
              onClick={() => setView('templates')}
              className={`px-2 py-1 rounded text-xs ${view === 'templates' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Templates
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-3 py-4 safe-area">
        {view === 'batch' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mobile-optimized">Produção em Lote</h2>
              <button
                onClick={() => setView('create')}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              >
                Criar Individual
              </button>
            </div>
            
            <BatchCreator />
            
            {/* Estatísticas rápidas */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-3 text-sm">Resumo de Produção</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xl font-bold">{projects.filter(p => p.video_type === 'short').length}</div>
                  <div className="text-xs text-gray-600">Shorts</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xl font-bold">{projects.filter(p => p.video_type === 'long').length}</div>
                  <div className="text-xs text-gray-600">Longos</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xl font-bold">{projects.filter(p => p.status === 'completed').length}</div>
                  <div className="text-xs text-gray-600">Concluídos</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xl font-bold">{projects.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'projects' && !currentProject && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mobile-optimized">Meus Vídeos</h2>
              <button
                onClick={() => setView('create')}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              >
                Novo Vídeo
              </button>
            </div>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <div className="animate-pulse text-gray-500">Carregando projetos...</div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-4">Você ainda não tem vídeos.</p>
                <button
                  onClick={() => setView('create')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Criar Primeiro Vídeo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project.id} className="bg-white shadow rounded-lg p-4">
                    <h3 className="font-medium text-sm mobile-optimized">{project.title}</h3>
                    <p className="text-xs text-gray-600 truncate mobile-optimized">{project.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded mobile-optimized">
                        {project.video_type === 'long' ? 'Longo' : 'Short'}
                      </span>
                      <span className="text-xs text-gray-500 mobile-optimized">
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentProject(project)
                          setView('edit')
                        }}
                        className="flex-1 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {view === 'create' && (
          <VideoProjectForm onProjectCreate={(project) => {
            setCurrentProject(project)
            setView('edit')
          }} />
        )}
        
        {view === 'edit' && currentProject && (
          <VideoGenerator 
            project={currentProject} 
            onBack={() => {
              setCurrentProject(null)
              setView('projects')
              loadProjects()
            }}
          />
        )}
        
        {view === 'templates' && (
          <TemplateManager 
            project={currentProject}
            onSelectTemplate={(template) => {
              setView('create')
            }}
          />
        )}
        
        {/* Botão de logout fixo na parte inferior */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-full shadow text-xs"
          >
            Sair
          </button>
        </div>
      </main>
    </div>
  )
}
