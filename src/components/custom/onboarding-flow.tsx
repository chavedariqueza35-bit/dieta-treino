'use client'

import { useState } from 'react'
import { ChevronRight, Check } from 'lucide-react'

interface OnboardingData {
  goal: string
  targetWeight: string
  activityLevel: string
  currentDiet: string
  restrictions: string[]
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    goal: '',
    targetWeight: '',
    activityLevel: '',
    currentDiet: '',
    restrictions: []
  })

  const questions = [
    {
      title: 'Qual é seu objetivo principal?',
      subtitle: 'Escolha o que melhor descreve sua meta',
      options: [
        { value: 'lose', label: 'Perder peso', emoji: '📉' },
        { value: 'maintain', label: 'Manter peso', emoji: '⚖️' },
        { value: 'gain', label: 'Ganhar peso', emoji: '📈' },
        { value: 'muscle', label: 'Ganhar massa muscular', emoji: '💪' }
      ],
      field: 'goal'
    },
    {
      title: 'Quanto deseja perder ou ganhar?',
      subtitle: 'Defina sua meta de peso',
      options: [
        { value: '2-5', label: '2-5 kg', emoji: '🎯' },
        { value: '5-10', label: '5-10 kg', emoji: '🎯' },
        { value: '10-15', label: '10-15 kg', emoji: '🎯' },
        { value: '15+', label: 'Mais de 15 kg', emoji: '🎯' }
      ],
      field: 'targetWeight'
    },
    {
      title: 'Qual seu nível de atividade física?',
      subtitle: 'Isso nos ajuda a calcular suas necessidades calóricas',
      options: [
        { value: 'sedentary', label: 'Sedentário', emoji: '🛋️', desc: 'Pouco ou nenhum exercício' },
        { value: 'light', label: 'Leve', emoji: '🚶', desc: '1-3 dias por semana' },
        { value: 'moderate', label: 'Moderado', emoji: '🏃', desc: '3-5 dias por semana' },
        { value: 'active', label: 'Ativo', emoji: '🏋️', desc: '6-7 dias por semana' },
        { value: 'very-active', label: 'Muito Ativo', emoji: '💪', desc: 'Treino intenso diário' }
      ],
      field: 'activityLevel'
    },
    {
      title: 'Como é sua alimentação hoje?',
      subtitle: 'Seja honesto para obter melhores resultados',
      options: [
        { value: 'balanced', label: 'Balanceada', emoji: '🥗', desc: 'Como de tudo com moderação' },
        { value: 'unhealthy', label: 'Pouco saudável', emoji: '🍔', desc: 'Muitos processados' },
        { value: 'restrictive', label: 'Restritiva', emoji: '🥙', desc: 'Evito vários alimentos' },
        { value: 'irregular', label: 'Irregular', emoji: '⏰', desc: 'Horários desregulados' }
      ],
      field: 'currentDiet'
    },
    {
      title: 'Tem alguma restrição alimentar?',
      subtitle: 'Selecione todas que se aplicam',
      options: [
        { value: 'none', label: 'Nenhuma', emoji: '✅' },
        { value: 'vegetarian', label: 'Vegetariano', emoji: '🥬' },
        { value: 'vegan', label: 'Vegano', emoji: '🌱' },
        { value: 'lactose', label: 'Intolerância à lactose', emoji: '🥛' },
        { value: 'gluten', label: 'Intolerância ao glúten', emoji: '🌾' },
        { value: 'diabetes', label: 'Diabetes', emoji: '🩺' }
      ],
      field: 'restrictions',
      multiple: true
    }
  ]

  const currentQuestion = questions[step]
  const isMultiple = currentQuestion.multiple
  const currentValue = isMultiple 
    ? (data[currentQuestion.field as keyof OnboardingData] as string[])
    : (data[currentQuestion.field as keyof OnboardingData] as string)

  const handleSelect = (value: string) => {
    if (isMultiple) {
      const current = currentValue as string[]
      if (value === 'none') {
        setData({ ...data, [currentQuestion.field]: ['none'] })
      } else {
        const filtered = current.filter(v => v !== 'none')
        const newValue = filtered.includes(value)
          ? filtered.filter(v => v !== value)
          : [...filtered, value]
        setData({ ...data, [currentQuestion.field]: newValue.length ? newValue : [] })
      }
    } else {
      setData({ ...data, [currentQuestion.field]: value })
    }
  }

  const isSelected = (value: string) => {
    if (isMultiple) {
      return (currentValue as string[]).includes(value)
    }
    return currentValue === value
  }

  const canContinue = isMultiple 
    ? (currentValue as string[]).length > 0
    : currentValue !== ''

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      onComplete(data)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const progress = ((step + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-black rotate-180" />
          </button>
        )}
        <div className="flex-1" />
        <span className="text-sm text-gray-500 font-medium">
          {step + 1} de {questions.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-32">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-black mb-3 leading-tight">
              {currentQuestion.title}
            </h1>
            <p className="text-gray-500 text-lg">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const selected = isSelected(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                    selected
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-black hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-semibold text-lg ${selected ? 'text-white' : 'text-black'}`}>
                        {option.label}
                      </p>
                      {option.desc && (
                        <p className={`text-sm mt-1 ${selected ? 'text-white/70' : 'text-gray-500'}`}>
                          {option.desc}
                        </p>
                      )}
                    </div>
                    {selected && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 safe-area-inset-bottom">
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className={`w-full py-5 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            canContinue
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step < questions.length - 1 ? 'Continuar' : 'Começar'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
