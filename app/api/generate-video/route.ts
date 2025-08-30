import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    
    // Simulação de geração de vídeo
    console.log(`Gerando vídeo para o projeto: ${projectId}`);
    
    // Retornar URL de vídeo simulado
    return NextResponse.json({ 
      videoUrl: '/sample-video.mp4',
      thumbnailUrl: '/sample-thumbnail.jpg',
      duration: 60
    });
    
  } catch (error) {
    console.error('Erro na geração de vídeo:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar vídeo' },
      { status: 500 }
    );
  }
}
