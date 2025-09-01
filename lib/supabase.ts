// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Verifica se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Variáveis do Supabase não encontradas. Usando cliente mock.')
}

// Cria o cliente Supabase ou um mock para desenvolvimento
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      storage: {
        from: () => ({
          upload: async () => ({ error: null, data: { path: 'mock-path' } }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/mock-image.jpg' } })
        })
      },
      from: () => ({
        insert: async () => ({ error: null, data: [{}] }),
        select: () => ({
          order: () => Promise.resolve({ error: null, data: [] })
        }),
        delete: async () => ({ error: null })
      })
    } as any
