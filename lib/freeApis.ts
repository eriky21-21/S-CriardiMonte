// APIs gratuitas para geração de conteúdo
export const FREE_APIS = {
  // API de texto para voz (gratuita)
  textToSpeech: async (text: string, voiceModel: string = 'female-1') => {
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceModel }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao gerar áudio');
      }
      
      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('Erro na API de TTS:', error);
      throw error;
    }
  },
  
  // API de geração de imagens (gratuita)
  generateImage: async (prompt: string) => {
    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao gerar imagem');
      }
      
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Erro na API de geração de imagens:', error);
      throw error;
    }
  },
  
  // Músicas gratuitas
  getBackgroundMusic: (style: string = 'upbeat') => {
    const musicOptions: Record<string, string> = {
      'upbeat': '/music/upbeat.mp3',
      'calm': '/music/calm.mp3',
      'inspiring': '/music/inspiring.mp3',
      'dramatic': '/music/dramatic.mp3',
      'none': ''
    };
    
    return musicOptions[style] || musicOptions.upbeat;
  }
};
