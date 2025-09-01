// lib/models-manager.ts
import { supabase } from './supabase'
import { VideoModel, VideoConfig } from '@/types/video'

export class ModelsManager {
  static async salvarModelo(modelo: Omit<VideoModel, 'id' | 'created_at'>): Promise<VideoModel> {
    const { data, error } = await supabase
      .from('video_models')
      .insert([modelo])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async carregarModelos(): Promise<VideoModel[]> {
    const { data, error } = await supabase
      .from('video_models')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async carregarModeloPorId(id: string): Promise<VideoModel> {
    const { data, error } = await supabase
      .from('video_models')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async deletarModelo(id: string): Promise<void> {
    const { error } = await supabase
      .from('video_models')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
