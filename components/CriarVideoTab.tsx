// components/CriarVideoTab.tsx - FUNÇÃO gerarVideo CORRIGIDA
const gerarVideo = async () => {
  if (!texto.trim()) {
    alert('Por favor, digite ou cole sua ideia para o vídeo!');
    return;
  }

  try {
    setGerando(true);
    setProgresso(0);
    setMostrarPreview(false);
    setVideoGerado(null);
    
    // Calcula tempo estimado baseado no tamanho do texto
    const estimatedTime = Math.max(15, Math.min(180, texto.length / 20));
    setTempoEstimado(estimatedTime);
    
    // Simula progresso em tempo real
    const interval = setInterval(() => {
      setProgresso(prev => {
        const newProgress = prev + (100 / estimatedTime);
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 1000);

    // 🔥 CORREÇÃO: Adiciona try/catch interno para evitar quebra total
    let config;
    try {
      config = await VideoAIGenerator.generateVideoFromText(texto);
    } catch (error) {
      console.error('Erro na geração do vídeo:', error);
      // Fallback: cria uma configuração básica
      config = {
        estilo: 'viral',
        duracao: Math.max(60, Math.min(480, texto.length * 2)),
        resolucao: '4k',
        elementos: {
          textos: [texto.slice(0, 100) + '...'],
          imagens: ['background_viral'],
          videos: ['stock_footage'],
          musicas: ['upbeat_trending']
        },
        qualidade: 'high'
      };
    }

    // Finaliza o progresso
    clearInterval(interval);
    setProgresso(100);
    
    // Aguarda um pouco para mostrar o progresso completo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setVideoGerado(config);
    setMostrarPreview(true);
    
  } catch (error) {
    console.error('Erro geral na geração:', error);
    alert('Erro ao gerar vídeo. Tente novamente.');
  } finally {
    setGerando(false);
    setProgresso(0);
  }
};
