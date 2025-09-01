// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)

// Função para salvar modelo
export async function salvarModelo(nome: string, config: any) {
  const { data, error } = await supabase
    .from('modelos')
    .insert([{ nome, config }])
    .select()
  
  return { data, error }
}

// Função para carregar modelos
export async function carregarModelos() {
  const { data, error } = await supabase
    .from('modelos')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}
