import { useState, useEffect, useRef } from 'react'

export const useAudioLevel = (stream: MediaStream | null) => {
  const [audioLevel, setAudioLevel] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!stream) {
      setAudioLevel(0)
      setIsSpeaking(false)
      return
    }

    const audioTrack = stream.getAudioTracks()[0]
    if (!audioTrack || !audioTrack.enabled) {
      setAudioLevel(0)
      setIsSpeaking(false)
      return
    }

    try {
      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)

      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateAudioLevel = () => {
        if (!analyser) return

        analyser.getByteFrequencyData(dataArray)
        
        // Calculate average audio level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        const normalizedLevel = average / 255

        setAudioLevel(normalizedLevel)
        setIsSpeaking(normalizedLevel > 0.1) // Threshold for speaking detection

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }

      updateAudioLevel()
    } catch (error) {
      console.warn('Failed to create audio analyser:', error)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stream])

  return { audioLevel, isSpeaking }
}
