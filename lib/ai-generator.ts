// lib/ai-generator.ts
export class VideoAIGenerator {
  static async generateVideoFromText(prompt: string): Promise<any> {
    // Detecta a duração desejada baseada no prompt
    const duration = this.detectDuration(prompt)
    const estilo = this.detectStyle(prompt)
    
    return {
      estilo,
      duracao: duration,
      resolucao: this.determineResolution(duration),
      elementos: {
        textos: this.extractTexts(prompt),
        imagens: await this.generateImagePrompts(prompt),
        videos: await this.generateVideoPrompts(prompt),
        musicas: this.determineMusic(estilo, duration)
      },
      qualidade: this.determineQuality(duration)
    }
  }

  private static detectDuration(prompt: string): number {
    const lowerPrompt = prompt.toLowerCase()
    
    // Detecta duração baseada no conteúdo
    if (lowerPrompt.includes('short') || lowerPrompt.includes('reel') || lowerPrompt.includes('tik')) {
      return 30 // 30 segundos para shorts
    }
    
    if (lowerPrompt.includes('long') || lowerPrompt.includes('monetiz') || 
        lowerPrompt.includes('8 min') || lowerPrompt.includes('youtube')) {
      return 480 // 8 minutos para monetização
    }
    
    // Duração padrão baseada no tamanho do texto
    const wordCount = prompt.split(' ').length
    return Math.min(Math.max(60, Math.floor(wordCount * 2)), 600) // 1-10 minutos
  }

  private static determineResolution(duration: number): string {
    // Para vídeos longos, usa resolução adaptativa
    if (duration > 180) { // Mais de 3 minutos
      return '1440p' // 2K para melhor performance
    }
    return '4k' // 4K para vídeos curtos
  }

  private static determineQuality(duration: number): string {
    return duration > 180 ? 'balanced' : 'high'
  }

  private static determineMusic(estilo: string, duration: number): string[] {
    const baseMusic = {
      viral: ['upbeat_trending', 'viral_sound'],
      motivacional: ['epic_inspirational', 'emotional_rise'],
      educativo: ['calm_educational', 'background_knowledge'],
      divertido: ['fun_upbeat', 'happy_vibes']
    }[estilo] || ['upbeat_trending']

    // Para vídeos longos, adiciona variações musicais
    if (duration > 180) {
      return [...baseMusic, 'transition_variation', 'ending_impact']
    }
    
    return baseMusic
  }

  // ... outros métodos mantidos ...
}
