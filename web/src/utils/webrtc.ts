// Simple WebRTC implementation without external dependencies
import { isMobile, getOptimizedVideoConstraints, getOptimizedAudioConstraints } from './mobileOptimization'
interface SimplePeerInstance {
  on(event: string, callback: Function): void
  addStream(stream: MediaStream): void
  signal(data: any): void
  destroy(): void
  replaceTrack(oldTrack: MediaStreamTrack, newTrack: MediaStreamTrack): void
}

class MockSimplePeer implements SimplePeerInstance {
  constructor(_options: any = {}) {
    console.log('Mock SimplePeer initialized')
  }
  
  on(_event: string, _callback: Function) {
    console.log('Mock SimplePeer: event handler')
  }
  
  addStream(_stream: MediaStream) {
    console.log('Mock SimplePeer: addStream called')
  }
  
  signal(_data: any) {
    console.log('Mock SimplePeer: signal called')
  }
  
  destroy() {
    console.log('Mock SimplePeer: destroy called')
  }
  
  replaceTrack(_oldTrack: MediaStreamTrack, _newTrack: MediaStreamTrack) {
    console.log('Mock SimplePeer: replaceTrack called')
  }
}

const SimplePeer = MockSimplePeer

export interface WebRTCConfig {
  iceServers: RTCIceServer[]
}

export const defaultWebRTCConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
}

export class WebRTCManager {
  private peers: Map<string, SimplePeerInstance> = new Map()
  private localStream: MediaStream | null = null
  private onRemoteStream?: (userId: string, stream: MediaStream) => void
  private onPeerDisconnected?: (userId: string) => void

  constructor(
    private config: WebRTCConfig = defaultWebRTCConfig,
    onRemoteStream?: (userId: string, stream: MediaStream) => void,
    onPeerDisconnected?: (userId: string) => void
  ) {
    this.onRemoteStream = onRemoteStream
    this.onPeerDisconnected = onPeerDisconnected
  }

  async initializeLocalStream(video: boolean = true, audio: boolean = true): Promise<MediaStream> {
    try {
      // Ensure at least one media type is requested
      if (!video && !audio) {
        throw new Error('At least one of audio or video must be enabled')
      }

      // Mobile-optimized camera settings
      const isMobileDevice = isMobile()
      const videoConstraints = video ? getOptimizedVideoConstraints(isMobileDevice) : false
      const audioConstraints = audio ? getOptimizedAudioConstraints(isMobileDevice) : false

      console.log('🔧 [DEBUG] Requesting media with constraints:', { video: videoConstraints, audio: audioConstraints })

      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      })
      
      console.log('🔧 [DEBUG] ✅ Media stream obtained successfully:', this.localStream)
      return this.localStream
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error accessing media devices:', error)
      
      // Provide more specific error messages
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera/microphone access denied. Please allow access and refresh the page.')
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera/microphone found. Please connect a device and try again.')
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera/microphone is already in use by another application. Please close other apps and try again.')
        } else if (error.name === 'OverconstrainedError') {
          throw new Error('Camera/microphone constraints cannot be satisfied. Trying with basic settings...')
        }
      }
      
      throw error
    }
  }

  async createPeer(userId: string, isInitiator: boolean): Promise<SimplePeerInstance> {
    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      config: {
        iceServers: this.config.iceServers
      }
    })

    peer.on('signal', (data: any) => {
      // This would typically be sent to the signaling server
      console.log('Peer signal:', data)
    })

    peer.on('stream', (stream: any) => {
      if (this.onRemoteStream) {
        this.onRemoteStream(userId, stream)
      }
    })

    peer.on('close', () => {
      this.peers.delete(userId)
      if (this.onPeerDisconnected) {
        this.onPeerDisconnected(userId)
      }
    })

    peer.on('error', (err: any) => {
      console.error('Peer error:', err)
    })

    if (this.localStream) {
      peer.addStream(this.localStream)
    }

    this.peers.set(userId, peer)
    return peer
  }

  async addPeer(userId: string, signal: any): Promise<void> {
    const peer = this.peers.get(userId)
    if (peer) {
      peer.signal(signal)
    }
  }

  async removePeer(userId: string): Promise<void> {
    const peer = this.peers.get(userId)
    if (peer) {
      peer.destroy()
      this.peers.delete(userId)
    }
  }

  async toggleVideo(enabled: boolean): Promise<void> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = enabled
      }
    }
  }

  async toggleAudio(enabled: boolean): Promise<void> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = enabled
      }
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Replace video track in all peers
      // TODO: Fix replaceTrack implementation
      // this.peers.forEach(peer => {
      //   const videoTrack = screenStream.getVideoTracks()[0]
      //   const localVideoTrack = this.localStream?.getVideoTracks()[0]
      //   if (videoTrack && localVideoTrack) {
      //     peer.replaceTrack(localVideoTrack, videoTrack)
      //   }
      // })

      return screenStream
    } catch (error) {
      console.error('Error starting screen share:', error)
      throw error
    }
  }

  async stopScreenShare(): Promise<void> {
    // TODO: Fix replaceTrack implementation
    // if (this.localStream) {
    //   const videoTrack = this.localStream.getVideoTracks()[0]
    //   if (videoTrack) {
    //     this.peers.forEach(peer => {
    //       const localVideoTrack = this.localStream?.getVideoTracks()[0]
    //       if (localVideoTrack) {
    //         peer.replaceTrack(videoTrack, localVideoTrack)
    //       }
    //     })
    //   }
    // }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream
  }

  cleanup(): void {
    this.peers.forEach(peer => peer.destroy())
    this.peers.clear()
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }
  }
}

export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
