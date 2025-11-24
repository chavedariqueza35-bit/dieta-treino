'use client'

import { useState, useRef } from 'react'
import { Camera, X, Check, AlertCircle, Sparkles, ArrowRight, Plus } from 'lucide-react'

interface FoodAnalysis {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sodium?: number
  confidence?: number
  portionRecommendation?: string
  healthyAlternatives?: string[]
}

interface FoodScannerProps {
  onClose: () => void
  onSave: (food: FoodAnalysis) => void
}

export default function FoodScanner({ onClose, onSave }: FoodScannerProps) {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<FoodAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        analyzeFood(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeFood = async (imageData: string) => {
    setAnalyzing(true)
    setError(null)
    setScanProgress(0)

    // Animação de progresso
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar alimento')
      }

      clearInterval(progressInterval)
      setScanProgress(100)
      
      // Pequeno delay para mostrar 100%
      setTimeout(() => {
        setResult(data.data)
      }, 300)
    } catch (err: any) {
      clearInterval(progressInterval)
      console.error('Erro:', err)
      setError(err.message || 'Erro ao analisar alimento. Tente novamente.')
      
      // Fallback para resultado mock em caso de erro
      const mockResult: FoodAnalysis = {
        name: 'Alimento não identificado',
        quantity: '100g (estimado)',
        calories: 150,
        protein: 10,
        carbs: 20,
        fat: 5,
        fiber: 3,
        sodium: 200,
        confidence: 30,
        portionRecommendation: 'Porção recomendada: 100-150g',
        healthyAlternatives: ['Opção integral', 'Versão com menos sódio']
      }
      setResult(mockResult)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = () => {
    if (result) {
      onSave(result)
      onClose()
    }
  }

  const handleRetry = () => {
    setImage(null)
    setResult(null)
    setError(null)
    setScanProgress(0)
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header - Minimalista */}
      <div className="p-6 flex items-center justify-between border-b border-black/5">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-lg font-semibold text-black">Análise de Alimento</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        {!image ? (
          // Initial State - Cal AI Style
          <div className="text-center max-w-md w-full">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-black rounded-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-black mb-3">Tire uma foto</h3>
            <p className="text-gray-500 mb-12 leading-relaxed">
              Identifique calorias e nutrientes instantaneamente com IA
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-black text-white px-8 py-5 rounded-2xl font-medium hover:bg-black/90 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Abrir Câmera
            </button>
            
            <div className="mt-8 pt-8 border-t border-black/5">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>Powered by AI Vision</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            {/* Image Preview with Scan Animation */}
            <div className="relative mb-8 rounded-3xl overflow-hidden bg-black">
              <img src={image} alt="Food" className="w-full h-auto" />
              
              {analyzing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  {/* Scanning Line Animation */}
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center z-10">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white font-semibold text-lg mb-2">Analisando...</p>
                        <p className="text-white/60 text-sm">{scanProgress}%</p>
                      </div>
                    </div>
                    
                    {/* Scan Line Effect */}
                    <div 
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-scan"
                      style={{ 
                        top: `${scanProgress}%`,
                        transition: 'top 0.2s linear'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-black/5 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-black font-medium text-sm">Atenção</p>
                  <p className="text-gray-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Results - Cal AI Premium Style */}
            {result && !analyzing && (
              <div className="space-y-6 animate-fadeIn">
                {/* Food Name */}
                <div className="text-center pb-6 border-b border-black/5">
                  <div className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full mb-4">
                    <Check className="w-4 h-4 text-black" />
                    <span className="text-sm font-medium text-black">Identificado</span>
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-2">{result.name}</h3>
                  <p className="text-gray-500">{result.quantity}</p>
                </div>

                {/* Calories - Destaque */}
                <div className="text-center py-8 bg-black rounded-3xl">
                  <p className="text-white/60 text-sm mb-2">Calorias Totais</p>
                  <p className="text-6xl font-bold text-white">{result.calories}</p>
                  <p className="text-white/60 text-sm mt-2">kcal</p>
                </div>

                {/* Macros - Grid Minimalista */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-black/5 rounded-2xl">
                    <p className="text-2xl font-bold text-black">{result.protein}g</p>
                    <p className="text-xs text-gray-500 mt-1">Proteína</p>
                  </div>
                  <div className="text-center p-4 bg-black/5 rounded-2xl">
                    <p className="text-2xl font-bold text-black">{result.carbs}g</p>
                    <p className="text-xs text-gray-500 mt-1">Carboidratos</p>
                  </div>
                  <div className="text-center p-4 bg-black/5 rounded-2xl">
                    <p className="text-2xl font-bold text-black">{result.fat}g</p>
                    <p className="text-xs text-gray-500 mt-1">Gordura</p>
                  </div>
                </div>

                {/* Additional Info */}
                {(result.fiber || result.sodium) && (
                  <div className="grid grid-cols-2 gap-4">
                    {result.fiber && (
                      <div className="p-4 border border-black/10 rounded-2xl">
                        <p className="text-sm text-gray-500 mb-1">Fibras</p>
                        <p className="text-lg font-semibold text-black">{result.fiber}g</p>
                      </div>
                    )}
                    {result.sodium && (
                      <div className="p-4 border border-black/10 rounded-2xl">
                        <p className="text-sm text-gray-500 mb-1">Sódio</p>
                        <p className="text-lg font-semibold text-black">{result.sodium}mg</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Portion Recommendation */}
                {result.portionRecommendation && (
                  <div className="p-4 bg-black/5 rounded-2xl">
                    <p className="text-sm font-medium text-black mb-1">Recomendação de Porção</p>
                    <p className="text-sm text-gray-600">{result.portionRecommendation}</p>
                  </div>
                )}

                {/* Healthy Alternatives */}
                {result.healthyAlternatives && result.healthyAlternatives.length > 0 && (
                  <div className="p-4 border border-black/10 rounded-2xl">
                    <p className="text-sm font-medium text-black mb-3">Alternativas Saudáveis</p>
                    <div className="space-y-2">
                      {result.healthyAlternatives.map((alt, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-black" />
                          <span>{alt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleRetry}
                    className="flex-1 bg-white border-2 border-black text-black py-4 rounded-2xl font-medium hover:bg-black/5 transition-all"
                  >
                    Nova Foto
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-black/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar
                  </button>
                </div>

                {/* Confidence Indicator */}
                {result.confidence && result.confidence < 70 && (
                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-400">
                      Confiança: {result.confidence}% • Tire uma foto mais clara para melhor precisão
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
