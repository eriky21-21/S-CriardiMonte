// types/video.ts
export interface VideoModel {
  id?: string
  nome: string
  descricao: string
  config: VideoConfig
  arquivo_url?: string
  created_at?: string
}

export interface VideoConfig {
  estilo: 'viral' | 'motivacional' | 'educativo' | 'divertido'
  duracao: number
  resolucao: '1080p' | '1440p' | '4k'
  elementos: {
    textos: string[]
    imagens: string[]
    videos: string[]
    musicas: string[]
  }
}
