// Utilitários para o sistema de vídeos
export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const estimateProcessingTime = (videoType: 'long' | 'short', segments: number) => {
  if (videoType === 'short') {
    return Math.max(30, segments * 5)
  }
  return Math.max(120, segments * 10)
}

export const generateVideoFilename = (title: string, format: string = 'mp4') => {
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  const timestamp = new Date().getTime()
  return `${normalizedTitle}-${timestamp}.${format}`
}
