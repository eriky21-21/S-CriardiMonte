'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    completedVideos: 0,
    shortsCount: 0,
    longVideosCount: 0
  })
  const [recentVideos, setRecentVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      // Carregar estatísticas
      const { count: totalVideos } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
      
      const { count: completedVideos } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'completed')
      
      const { count: shortsCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('video_type', 'short')
      
      const { count: longVideosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('video_type', 'long')
      
      setStats({
        totalVideos: totalVideos || 0,
        completedVideos: completedVideos || 0,
        shortsCount: shortsCount || 0,
        longVideosCount: longVideosCount || 0
      })
      
      // Carregar vídeos recentes
      const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      setRecentVideos(videos || [])
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 animate-pulse">Carregando dashboard...</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard de Produção</h2>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h3 className="text-xs font-medium text-gray-600">Total de Vídeos</h3>
          <p className="text-xl font-bold">{stats.totalVideos}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h3 className="text-xs font-medium text-gray-600">Concluídos</h3>
          <p className="text-xl font-bold">{stats.completedVideos}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h3 className="text-xs font-medium text-gray-600">Shorts</h3>
          <p className="text-xl font-bold">{stats.shortsCount}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h3 className="text-xs font-medium text-gray-600">Longos</h3>
          <p className="text-xl font-bold">{stats.longVideosCount}</p>
        </div>
      </div>
      
      {/* Vídeos Recentes */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Vídeos Recentes</h3>
        
        {recentVideos.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum vídeo criado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentVideos.map(video => (
                  <tr key={video.id}>
                    <td className="px-3 py-2 text-sm max-w-xs truncate">{video.title}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        video.video_type === 'short' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {video.video_type === 'short' ? 'Short' : 'Longo'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        video.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : video.status === 'generating'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {video.status === 'completed' 
                          ? 'Concluído' 
                          : video.status === 'generating'
                          ? 'Gerando'
                          : 'Rascunho'
                        }
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {new Date(video.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
