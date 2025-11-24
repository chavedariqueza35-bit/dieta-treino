'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Animação de entrada (1.5s) + hold (0.5s) + fade out (0.5s)
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(onComplete, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo com animação estilo Apple */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Logo */}
        <div className="relative z-10 animate-scale-in">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl font-bold text-black">C</span>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent animate-shine" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .animate-scale-in {
          animation: scale-in 1s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 2s ease-in-out;
        }
      `}</style>
    </div>
  )
}
