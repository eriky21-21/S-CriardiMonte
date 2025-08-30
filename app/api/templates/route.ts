import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({ templates: data });
    
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, config, isPublic } = await request.json();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    const { data, error } = await supabase
      .from('templates')
      .insert([
        {
          user_id: user.id,
          name,
          description,
          config,
          is_public: isPublic
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ template: data });
    
  } catch (error) {
    console.error('Erro ao criar template:', error);
    return NextResponse.json(
      { error: 'Falha ao criar template' },
      { status: 500 }
    );
  }
}
