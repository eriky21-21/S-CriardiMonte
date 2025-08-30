import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { videoIds } = await request.json();
    
    if (!videoIds || !Array.isArray(videoIds)) {
      return NextResponse.json(
        { error: 'IDs de vídeos não fornecidos' },
        { status: 400 }
      );
    }
    
    // Processar cada vídeo em sequência
    const results = [];
    
    for (const videoId of videoIds) {
      try {
        // Obter dados do vídeo
        const { data: video, error: videoError } = await supabase
          .from('videos')
          .select(`
            *,
            ai_configs (*),
            video_segments (*)
          `)
          .eq('id', videoId)
          .single();
        
        if (videoError) throw videoError;
        
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Atualizar status para concluído
        const { error: updateError } = await supabase
          .from('videos')
          .update({ 
            status: 'completed',
            video_url: `/videos/${videoId}.mp4`,
            thumbnail_url: `/thumbnails/${videoId}.jpg`
          })
          .eq('id', videoId);
        
        if (updateError) throw updateError;
        
        results.push({ videoId, status: 'success' });
      } catch (error) {
        console.error(`Erro processando vídeo ${videoId}:`, error);
        results.push({ videoId, status: 'error', error: error.message });
      }
    }
    
    return NextResponse.json({ results });
    
  } catch (error) {
    console.error('Erro no processamento em lote:', error);
    return NextResponse.json(
      { error: 'Falha no processamento em lote' },
      { status: 500 }
    );
  }
}
