// components/VideoGenerationProgress.tsx
'use client'

import { useState, useEffect } from 'react'

interface ProgressProps {
  isGenerating: boolean
  totalDuration: number
  currentProgress: number
  estimatedTime: number
}

export function VideoGenerationProgress({ 
  isGenerating, 
  totalDuration, 
  currentProgress, 
  estimatedTime 
}: ProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGenerating) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isGenerating])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (!isGenerating) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-blue-800">🎬 Gerando Vídeo...</h4>
        <span className="text-sm text-blue-600">
          {formatTime(elapsedTime)} / ~{formatTime(estimatedTime)}
        </span>
      </div>
      
      <div className="w-full bg-blue-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-blue-600">
        <div>• Processando texto</div>
        <div>• Renderizando cenas</div>
        <div>• Adicionando efeitos</div>
      </div>
      
      <p className="text-xs text-blue-500 mt-2">
        Gerando vídeo de {Math.floor(totalDuration / 60)}min em 4K otimizado...
      </p>
    </div>
  )
}
