'use client'

import { useState, useEffect } from 'react'
import { Camera, X, Search, Plus, Home, TrendingUp, Settings, User, ChevronRight, Droplets, Flame, Apple, Activity, Calendar, Clock, Check, Circle } from 'lucide-react'
import SplashScreen from '@/components/custom/splash-screen'
import OnboardingFlow from '@/components/custom/onboarding-flow'
import FoodScanner from '@/components/custom/food-scanner'

// Mock Data - Cal AI Style
const mockUser = {
  name: 'Alex',
  lastWeight: 75.2,
  daysLogged: 12,
  todayCalories: { consumed: 1247, target: 2000 },
  todaySteps: 8432,
  todayWater: 6,
  targetWater: 8,
  recentFoods: [
    { name: 'Aveia com Banana', calories: 320, portion: '1 tigela', time: '8:30', icon: '🥣' },
    { name: 'Peito de Frango Grelhado', calories: 285, portion: '150g', time: '12:45', icon: '🍗' },
    { name: 'Salada Caesar', calories: 180, portion: '1 prato', time: '12:50', icon: '🥗' },
    { name: 'Whey Protein', calories: 120, portion: '1 scoop', time: '15:30', icon: '🥤' }
  ],
  recentActivities: [
    { name: 'Corrida', duration: '30 min', calories: 280, intensity: 'Moderado', time: '7:00' },
    { name: 'Musculação', duration: '45 min', calories: 320, intensity: 'Alto', time: '18:00' }
  ]
}

const foodDatabase = [
  { name: 'Banana', calories: 105, portion: '1 média (118g)', category: 'Frutas' },
  { name: 'Aveia', calories: 150, portion: '40g', category: 'Grãos' },
  { name: 'Peito de Frango', calories: 165, portion: '100g', category: 'Proteínas' },
  { name: 'Arroz Integral', calories: 111, portion: '100g cozido', category: 'Grãos' },
  { name: 'Batata Doce', calories: 86, portion: '100g', category: 'Carboidratos' },
  { name: 'Ovo', calories: 78, portion: '1 grande', category: 'Proteínas' },
  { name: 'Whey Protein', calories: 120, portion: '1 scoop (30g)', category: 'Suplementos' },
  { name: 'Maçã', calories: 95, portion: '1 média (182g)', category: 'Frutas' }
]

export default function CalAIClone() {
  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentScreen, setCurrentScreen] = useState('home')
  const [showFoodScanner, setShowFoodScanner] = useState(false)
  const [waterCount, setWaterCount] = useState(mockUser.todayWater)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('calai-onboarding-complete')
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('calai-onboarding-complete', 'true')
    localStorage.setItem('calai-user-data', JSON.stringify(data))
    setShowOnboarding(false)
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleFoodSave = (food: any) => {
    console.log('Food saved:', food)
    setShowFoodScanner(false)
  }

  const incrementWater = () => {
    if (waterCount < mockUser.targetWater) {
      setWaterCount(waterCount + 1)
    }
  }

  const decrementWater = () => {
    if (waterCount > 0) {
      setWaterCount(waterCount - 1)
    }
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  // HOME SCREEN - Cal AI Style
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">Cal AI</h1>
              <p className="text-xs text-gray-500">Olá, {mockUser.name}</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* Calendar Week */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex justify-between">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
            <div key={index} className={`flex flex-col items-center ${index === 3 ? 'opacity-100' : 'opacity-40'}`}>
              <span className="text-xs text-gray-500 mb-2">{day}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index === 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className="text-sm font-semibold">{18 + index}</span>
              </div>
              {index === 3 && (
                <div className="w-1 h-1 bg-green-500 rounded-full mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Steps & Calories Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Steps */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-5 h-5 text-black" />
              <span className="text-xs text-gray-500">Passos</span>
            </div>
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="36" 
                  stroke="#000000" 
                  strokeWidth="6" 
                  fill="none"
                  strokeDasharray={`${(mockUser.todaySteps / 10000) * 226} 226`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-black">{mockUser.todaySteps}</span>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500">de 10.000</p>
          </div>

          {/* Calories Burned */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-5 h-5 text-black" />
              <span className="text-xs text-gray-500">Queimadas</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Corrida</span>
                  <span className="text-xs font-semibold text-black">280</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-black h-1.5 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Musculação</span>
                  <span className="text-xs font-semibold text-black">320</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-black h-1.5 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Water Tracker - Cal AI Style */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-black" />
              <h3 className="font-semibold text-black">Água</h3>
            </div>
            <span className="text-sm text-gray-500">{waterCount}/{mockUser.targetWater} copos</span>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={decrementWater}
              disabled={waterCount === 0}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-gray-200 transition-colors"
            >
              <span className="text-xl font-bold text-black">−</span>
            </button>
            
            <div className="flex-1 flex gap-2">
              {Array.from({ length: mockUser.targetWater }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-12 rounded-xl transition-all duration-300 ${
                    i < waterCount 
                      ? 'bg-black' 
                      : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={incrementWater}
              disabled={waterCount === mockUser.targetWater}
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-gray-800 transition-colors"
            >
              <span className="text-xl font-bold text-white">+</span>
            </button>
          </div>
        </div>

        {/* Recent Log */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-black">Registro Recente</h3>
            <button className="text-sm text-black font-medium">Ver tudo</button>
          </div>

          <div className="space-y-3">
            {mockUser.recentFoods.map((food, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                    {food.icon}
                  </div>
                  <div>
                    <p className="font-medium text-black text-sm">{food.name}</p>
                    <p className="text-xs text-gray-500">{food.portion} • {food.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black text-sm">{food.calories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-black">Atividades</h3>
            <button className="text-sm text-black font-medium">Ver tudo</button>
          </div>

          <div className="space-y-3">
            {mockUser.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-black text-sm">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.duration} • {activity.intensity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black text-sm">{activity.calories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // PROGRESS SCREEN - Cal AI Style
  const ProgressScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl font-bold text-black">Progresso</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Weight & Days Logged */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-3 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#f3f4f6" strokeWidth="5" fill="none" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="#000000" 
                  strokeWidth="5" 
                  fill="none"
                  strokeDasharray={`${(mockUser.lastWeight / 100) * 176} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" />
              </div>
            </div>
            <p className="text-2xl font-bold text-black mb-1">{mockUser.lastWeight}</p>
            <p className="text-xs text-gray-500">Último peso</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-3 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#f3f4f6" strokeWidth="5" fill="none" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="#22c55e" 
                  strokeWidth="5" 
                  fill="none"
                  strokeDasharray={`${(mockUser.daysLogged / 30) * 176} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-black mb-1">{mockUser.daysLogged}</p>
            <p className="text-xs text-gray-500">Dias registrados</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-2xl p-2 border border-gray-100 flex gap-2">
          {['90 Dias', '6 Meses', '1 Ano', 'Tudo'].map((period, index) => (
            <button
              key={index}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                index === 0 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Goal Progress Chart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <h3 className="font-semibold text-black mb-4">Progresso da Meta</h3>
          
          {/* Simple Line Chart */}
          <div className="h-48 flex items-end justify-between gap-2 mb-4">
            {[65, 70, 68, 72, 71, 75, 73, 76, 74, 75.2].map((value, index) => {
              const height = (value / 80) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                  <div 
                    className="w-full bg-gradient-to-t from-black to-gray-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            })}
          </div>

          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-sm font-medium text-green-700">
              Você está indo muito bem! Continue assim 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // FOOD DATABASE SCREEN - Cal AI Style
  const FoodDatabaseScreen = () => {
    const filteredFoods = foodDatabase.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-black rotate-180" />
            </button>
            <h1 className="text-xl font-bold text-black">Food Database</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Descreva o que você comeu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="flex gap-6">
            {['all', 'meals', 'foods', 'scans'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab 
                    ? 'text-black' 
                    : 'text-gray-400'
                }`}
              >
                {tab === 'all' && 'All'}
                {tab === 'meals' && 'My meals'}
                {tab === 'foods' && 'My foods'}
                {tab === 'scans' && 'Saved scans'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Log Empty Food Button */}
        <div className="px-6 py-4">
          <button 
            onClick={() => setShowFoodScanner(true)}
            className="w-full border-2 border-black rounded-full py-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Camera className="w-5 h-5 text-black" />
            <span className="font-medium text-black">Escanear alimento</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">SUGESTÕES</h3>
          <div className="space-y-2">
            {filteredFoods.map((food, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-black">{food.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{food.portion}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{food.calories} kcal</span>
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // SETTINGS SCREEN
  const SettingsScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl font-bold text-black">Configurações</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {[
          { label: 'Perfil', icon: User },
          { label: 'Metas', icon: Activity },
          { label: 'Notificações', icon: Settings },
          { label: 'Privacidade', icon: Settings }
        ].map((item, index) => (
          <button
            key={index}
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-black" />
              <span className="font-medium text-black">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem('calai-onboarding-complete')
            setShowOnboarding(true)
          }}
          className="w-full bg-white rounded-2xl p-4 border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors mt-8"
        >
          Refazer Configuração Inicial
        </button>
      </div>
    </div>
  )

  // BOTTOM NAVIGATION - Cal AI Style
  const BottomNav = () => {
    const navItems = [
      { icon: Home, label: 'Home', screen: 'home' },
      { icon: TrendingUp, label: 'Progress', screen: 'progress' },
      { icon: null, label: '', screen: '' }, // Spacer for center button
      { icon: Settings, label: 'Settings', screen: 'settings' },
      { icon: User, label: 'Profile', screen: 'profile' }
    ]

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 safe-area-inset-bottom z-50">
        <div className="flex items-center justify-between relative">
          {navItems.map((item, index) => {
            if (index === 2) {
              return (
                <button
                  key={index}
                  onClick={() => setCurrentScreen('food-database')}
                  className="absolute left-1/2 -translate-x-1/2 -top-8 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              )
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentScreen(item.screen)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  currentScreen === item.screen 
                    ? 'text-black' 
                    : 'text-gray-400'
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />
      case 'progress':
        return <ProgressScreen />
      case 'food-database':
        return <FoodDatabaseScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="font-inter">
      {renderScreen()}
      <BottomNav />
      
      {/* Food Scanner Modal */}
      {showFoodScanner && (
        <FoodScanner 
          onClose={() => setShowFoodScanner(false)}
          onSave={handleFoodSave}
        />
      )}
    </div>
  )
}
