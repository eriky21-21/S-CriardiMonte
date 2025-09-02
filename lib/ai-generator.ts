// lib/ai-generator.ts
export class VideoAIGenerator {
  static async generateVideoFromText(prompt: string): Promise<any> {
    // Simula um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Detecta a duração desejada baseada no prompt
    const duration = this.detectDuration(prompt);
    const estilo = this.detectStyle(prompt);
    
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
    };
  }

  private static detectDuration(prompt: string): number {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detecta duração baseada no conteúdo
    if (lowerPrompt.includes('short') || lowerPrompt.includes('reel') || lowerPrompt.includes('tik')) {
      return 30; // 30 segundos para shorts
    }
    
    if (lowerPrompt.includes('long') || lowerPrompt.includes('monetiz') || 
        lowerPrompt.includes('8 min') || lowerPrompt.includes('youtube')) {
      return 480; // 8 minutos para monetização
    }
    
    if (lowerPrompt.includes('5 min') || lowerPrompt.includes('cinco min')) {
      return 300;
    }
    
    if (lowerPrompt.includes('3 min') || lowerPrompt.includes('três min')) {
      return 180;
    }
    
    // Duração padrão baseada no tamanho do texto
    const wordCount = prompt.split(' ').length;
    return Math.min(Math.max(60, Math.floor(wordCount * 2)), 600); // 1-10 minutos
  }

  private static detectStyle(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('viral') || lowerPrompt.includes('trend')) return 'viral';
    if (lowerPrompt.includes('motiv') || lowerPrompt.includes('inspir')) return 'motivacional';
    if (lowerPrompt.includes('educ') || lowerPrompt.includes('aprend')) return 'educativo';
    if (lowerPrompt.includes('diverti') || lowerPrompt.includes('engraç')) return 'divertido';
    return 'viral';
  }

  private static determineResolution(duration: number): string {
    // Para vídeos longos, usa resolução adaptativa
    if (duration > 180) { // Mais de 3 minutos
      return '1440p'; // 2K para melhor performance
    }
    return '4k'; // 4K para vídeos curtos
  }

  private static determineQuality(duration: number): string {
    return duration > 180 ? 'balanced' : 'high';
  }

  private static determineMusic(estilo: string, duration: number): string[] {
    const baseMusic = {
      viral: ['upbeat_trending', 'viral_sound'],
      motivacional: ['epic_inspirational', 'emotional_rise'],
      educativo: ['calm_educational', 'background_knowledge'],
      divertido: ['fun_upbeat', 'happy_vibes']
    }[estilo] || ['upbeat_trending'];

    // Para vídeos longos, adiciona variações musicais
    if (duration > 180) {
      return [...baseMusic, 'transition_variation', 'ending_impact'];
    }
    
    return baseMusic;
  }

  private static extractTexts(prompt: string): string[] {
    // Extrai frases-chave do prompt
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return [
      sentences[0]?.slice(0, 100) + '...' || 'Conteúdo engaging e viral',
      'Siga para mais conteúdo! 🚀',
      ...sentences.slice(1, 3).map(s => s.slice(0, 80))
    ].filter(Boolean);
  }

  private static async generateImagePrompts(prompt: string): Promise<string[]> {
    return [
      `high quality ${prompt.split(' ').slice(0, 3).join(' ')}`,
      'viral social media background',
      'trending content overlay'
    ];
  }

  private static async generateVideoPrompts(prompt: string): Promise<string[]> {
    return [
      `4k ${prompt.split(' ').slice(0, 2).join(' ')} footage`,
      'social media viral background',
      'dynamic motion graphics'
    ];
  }
}
