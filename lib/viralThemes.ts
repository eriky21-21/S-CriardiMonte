// Gerador de ideias virais para vídeos (otimizado para mobile)
export const generateViralIdeas = (type: 'long' | 'short', count: number = 1) => {
  const shortTemplates = [
    {
      title: "Isso vai mudar sua perspectiva",
      description: "Um insight rápido que faz as pessoas pensarem diferente",
      hook: "Você já parou para pensar sobre isso?",
      content: "A maioria das pessoas não percebe, mas há um detalhe importante que muda tudo",
      cta: "Compartilhe se isso fez sentido para você!",
      imagePrompt: "pessoa pensativa com expressão de descoberta"
    },
    {
      title: "O segredo que ninguém conta",
      description: "Revelação surpreendente sobre um tema comum",
      hook: "Eu preciso te contar um segredo...",
      content: "As pessoas bem-sucedidas fazem isso diferente todos os dias",
      cta: "Salve este vídeo para não esquecer!",
      imagePrompt: "pessoa sussurrando um segredo com fundo misterioso"
    },
    {
      title: "3 dicas que funcionam de verdade",
      description: "Conselhos práticos e acionáveis",
      hook: "Pare de perder tempo com conselhos que não funcionam!",
      content: "Essas três estratégias simples vão transformar seus resultados",
      cta: "Qual delas você vai experimentar primeiro?",
      imagePrompt: "lista de dicas com marcadores visuais"
    },
    {
      title: "O erro que todos cometem",
      description: "Exposição de um equívoco comum com correção",
      hook: "Pare agora mesmo de fazer isso!",
      content: "90% das pessoas cometem este erro sem perceber",
      cta: "Marque quem precisa ver isso!",
      imagePrompt: "pessoa cometendo um erro comum com símbolo de proibido"
    },
    {
      title: "Antes e depois impressionante",
      description: "Transformação visual ou de resultados",
      hook: "Você não vai acreditar nessa transformação!",
      content: "De onde começou para onde chegou é incrível",
      cta: "Quer um resultado similar? Me siga para mais dicas!",
      imagePrompt: "comparação lado a lado de antes e depois"
    },
    {
      title: "O que eu desejava saber antes",
      description: "Conselhos de experiência pessoal",
      hook: "Se eu pudesse voltar no tempo, diria isso para mim mesmo",
      content: "Essas lições teriam me poupado muito tempo e esforço",
      cta: "Qual lição mais ressoou com você?",
      imagePrompt: "pessoa olhando para trás com expressão reflexiva"
    }
  ]

  const longTemplates = [
    {
      title: "Guia completo para iniciantes",
      description: "Tudo que você precisa saber para começar",
      intro: "Se você está começando agora, este guia vai te poupar meses de tentativa e erro",
      mainContent1: "Vamos falar sobre os fundamentos que ninguém te conta mas que fazem toda a diferença",
      mainContent2: "Aqui estão as estratégias avançadas que vão acelerar seu progresso",
      conclusion: "Com essas informações, você já está à frente de 90% dos iniciantes",
      imagePrompt: "mapa completo com caminho para iniciantes"
    },
    {
      title: "Os 7 pilares essenciais",
      description: "Fundamentos que sustentam todo o processo",
      intro: "Depois de anos estudando este assunto, identifiquei os 7 pilares indispensáveis",
      mainContent1: "Vamos detalhar cada um desses pilares e por que são tão importantes",
      mainContent2: "Como aplicar na prática cada um desses conceitos para obter resultados",
      conclusion: "Dominando esses pilares, você terá uma base sólida para evoluir",
      imagePrompt: "sete colunas representando pilares fundamentais"
    },
    {
      title: "Desmistificando conceitos complexos",
      description: "Explicação acessível de temas complicados",
      intro: "Este tema parece complexo, mas vou simplificar para você entender de vez",
      mainContent1: "Vamos quebrar em partes menores e entender cada elemento separadamente",
      mainContent2: "Como tudo se conecta na prática e por que isso é relevante para você",
      conclusion: "Agora que desmistificamos, você pode aplicar com confiança",
      imagePrompt: "quebra-cabeça complexo sendo montado de forma simplificada"
    }
  ]

  const templates = type === 'short' ? shortTemplates : longTemplates
  const results = []

  for (let i = 0; i < count; i++) {
    const templateIndex = i % templates.length
    const baseTemplate = templates[templateIndex]
    
    const variation = Math.floor(i / templates.length) + 1
    const variedTemplate = {
      ...baseTemplate,
      title: variation > 1 ? `${baseTemplate.title} ${variation}` : baseTemplate.title,
      description: variation > 1 ? `${baseTemplate.description} - Parte ${variation}` : baseTemplate.description
    }
    
    results.push(variedTemplate)
  }

  return results
}
