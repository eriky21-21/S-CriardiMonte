// lib/models-manager.ts
import { supabase } from './supabase'
import { VideoModel } from '@/types/video'

export class ModelsManager {
  static async salvarModelo(modelo: Omit<VideoModel, 'id' | 'created_at'>): Promise<VideoModel> {
    try {
      const { data, error } = await supabase
        .from('video_models')
        .insert([modelo])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn('Erro ao salvar modelo (usando mock):', error)
      // Retorna um mock para desenvolvimento
      return {
        ...modelo,
        id: 'mock-id',
        created_at: new Date().toISOString()
      }
    }
  }

  static async carregarModelos(): Promise<VideoModel[]> {
    try {
      const { data, error } = await supabase
        .from('video_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Erro ao carregar modelos (retornando mock):', error)
      // Retorna dados mock para desenvolvimento
      return [
        {
          id: '1',
          nome: 'Modelo Viral Exemplo',
          descricao: 'Modelo para vídeos virais',
          config: {
            estilo: 'viral',
            duracao: 30,
            resolucao: '4k',
            elementos: {
              textos: ['Texto viral!', 'Engaje seu público!'],
              imagens: [],
              videos: [],
              musicas: []
            }
          },
          created_at: new Date().toISOString()
        }
      ]
    }
  }

  static async carregarModeloPorId(id: string): Promise<VideoModel> {
    try {
      const { data, error } = await supabase
        .from('video_models')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn('Erro ao carregar modelo (retornando mock):', error)
      return {
        id,
        nome: 'Modelo Mock',
        descricao: 'Modelo de exemplo',
        config: {
          estilo: 'viral',
          duracao: 30,
          resolucao: '4k',
          elementos: {
            textos: [],
            imagens: [],
            videos: [],
            musicas: []
          }
        },
        created_at: new Date().toISOString()
      }
    }
  }

  static async deletarModelo(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('video_models')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.warn('Erro ao deletar modelo:', error)
    }
  }
}
