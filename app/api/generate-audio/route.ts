import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceModel } = await request.json();
    
    // Simulação de geração de áudio
    // Em produção, você integraria com uma API de TTS gratuita
    console.log(`Gerando áudio para: ${text} (voz: ${voiceModel})`);
    
    // Retornar URL de áudio simulado
    return NextResponse.json({ 
      audioUrl: '/sample-audio.mp3',
      duration: Math.max(5, Math.min(text.length / 10, 60))
    });
    
  } catch (error) {
    console.error('Erro na geração de áudio:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar áudio' },
      { status: 500 }
    );
  }
}
