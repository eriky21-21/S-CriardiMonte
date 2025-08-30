# Micro SaaS para Criação de Vídeos Virais

Sistema completo para criação de vídeos virais usando IA, otimizado para produção em massa.

## Funcionalidades

- ✅ Criação de vídeos longos (8+ minutos) e shorts (1 minuto)
- ✅ Produção em lote (3 vídeos longos + 6 shorts diários)
- ✅ Templates virais pré-configurados
- ✅ Interface mobile-first em português
- ✅ Integração com Supabase (banco de dados gratuito)
- ✅ Deploy simplificado na Railway

## Setup Rápido

1. **Crie um projeto no Supabase**
   - Acesse https://supabase.com
   - Crie um novo projeto
   - Execute o SQL do arquivo `setup/supabase-setup.sql`

2. **Configure as variáveis de ambiente**
   - Copie `.env.local.example` para `.env.local`
   - Preencha com suas credenciais do Supabase

3. **Deploy na Railway**
   - Conecte seu repositório GitHub
   - Configure as variáveis de ambiente
   - Deploy automático

## Uso

1. Acesse o sistema
2. Use "Produção em Lote" para criar vídeos automaticamente
3. Edite os vídeos gerados se necessário
4. Exporte e compartilhe nas redes sociais

## Tecnologias

- Next.js 14
- React 18
- Supabase
- Tailwind CSS
- TypeScript
