import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    // Análise da imagem com OpenAI Vision - Estilo Cal AI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Você é um nutricionista especializado em análise de alimentos por imagem, igual ao aplicativo Cal AI.

Analise esta imagem de alimento e retorne APENAS um JSON válido com as seguintes informações:

{
  "name": "nome do alimento em português (seja específico e detalhado)",
  "quantity": "quantidade aproximada visual (ex: 150g, 1 unidade média, 200ml, 2 fatias)",
  "calories": número de calorias totais estimadas,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fat": gramas de gordura,
  "fiber": gramas de fibra (opcional),
  "sodium": miligramas de sódio (opcional),
  "confidence": nível de confiança da análise (0-100),
  "portionRecommendation": "recomendação de porção ideal para este alimento",
  "healthyAlternatives": ["alternativa saudável 1", "alternativa saudável 2", "alternativa saudável 3"]
}

INSTRUÇÕES IMPORTANTES:
- Seja preciso e realista nas estimativas baseado no que você vê
- Use conhecimento nutricional profissional
- Se não conseguir identificar com certeza, indique no campo confidence
- Para alternativas saudáveis, sugira opções similares mas mais nutritivas
- Considere o contexto visual (tamanho do prato, comparação com objetos)
- Seja específico no nome (ex: "Bolo de chocolate com cobertura" em vez de só "bolo")

Retorne APENAS o JSON, sem texto adicional.`
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 800,
      temperature: 0.2
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('Resposta vazia da API')
    }

    // Parse do JSON retornado
    let result
    try {
      result = JSON.parse(content)
    } catch (parseError) {
      // Se falhar o parse, tenta extrair JSON do texto
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Formato de resposta inválido')
      }
    }

    // Validação e valores padrão
    result = {
      name: result.name || 'Alimento não identificado',
      quantity: result.quantity || '100g (estimado)',
      calories: result.calories || 0,
      protein: result.protein || 0,
      carbs: result.carbs || 0,
      fat: result.fat || 0,
      fiber: result.fiber || undefined,
      sodium: result.sodium || undefined,
      confidence: result.confidence || 50,
      portionRecommendation: result.portionRecommendation || 'Consulte um nutricionista para recomendação personalizada',
      healthyAlternatives: result.healthyAlternatives || []
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Erro na análise de alimento:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao analisar alimento',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
