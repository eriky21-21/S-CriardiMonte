import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    // Simulação de geração de imagem
    // Em produção, você integraria com uma API de geração de imagens gratuita
    console.log(`Gerando imagem para: ${prompt}`);
    
    // Retornar URL de imagem simulada (placeholder)
    return NextResponse.json({ 
      imageUrl: `https://via.placeholder.com/1920x1080/3498db/ffffff.png?text=${encodeURIComponent(prompt)}`
    });
    
  } catch (error) {
    console.error('Erro na geração de imagem:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar imagem' },
      { status: 500 }
    );
  }
}
