// Real WebRTC implementation using native browser APIs
import { isMobile, getOptimizedVideoConstraints, getOptimizedAudioConstraints } from './mobileOptimization'

export interface WebRTCPeer {
  id: string
  pc: RTCPeerConnection
  stream?: MediaStream
  isConnected: boolean
}

export class RealWebRTCManager {
  private localStream: MediaStream | null = null
  private peers: Map<string, WebRTCPeer> = new Map()
  private onRemoteStream: (peerId: string, stream: MediaStream) => void
  private onPeerDisconnected: (peerId: string) => void
  private signalingChannel: any = null

  constructor(
    signalingChannel: any,
    onRemoteStream: (peerId: string, stream: MediaStream) => void,
    onPeerDisconnected: (peerId: string) => void
  ) {
    this.signalingChannel = signalingChannel
    this.onRemoteStream = onRemoteStream
    this.onPeerDisconnected = onPeerDisconnected
    
    console.log('🔧 [DEBUG] RealWebRTCManager initialized')
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

  async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }

    const pc = new RTCPeerConnection(configuration)
    
    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!)
        console.log('🔧 [DEBUG] Added track to peer connection:', track.kind)
      })
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('🔧 [DEBUG] Received remote stream from peer:', peerId)
      const [remoteStream] = event.streams
      this.onRemoteStream(peerId, remoteStream)
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🔧 [DEBUG] Sending ICE candidate to peer:', peerId)
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          targetPeerId: peerId
        })
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('🔧 [DEBUG] Peer connection state changed:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        console.log('🔧 [DEBUG] ✅ Connected to peer:', peerId)
        const peer = this.peers.get(peerId)
        if (peer) {
          peer.isConnected = true
        }
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.log('🔧 [DEBUG] ❌ Disconnected from peer:', peerId)
        this.onPeerDisconnected(peerId)
      }
    }

    // Store peer connection
    this.peers.set(peerId, {
      id: peerId,
      pc,
      isConnected: false
    })

    return pc
  }

  async handleIncomingCall(peerId: string, offer: RTCSessionDescriptionInit) {
    console.log('🔧 [DEBUG] Handling incoming call from peer:', peerId)
    
    const pc = await this.createPeerConnection(peerId)
    
    await pc.setRemoteDescription(offer)
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    
    this.sendSignalingMessage({
      type: 'answer',
      answer,
      targetPeerId: peerId
    })
  }

  async handleIncomingAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
    console.log('🔧 [DEBUG] Handling incoming answer from peer:', peerId)
    
    const peer = this.peers.get(peerId)
    if (peer) {
      await peer.pc.setRemoteDescription(answer)
    }
  }

  async handleIncomingIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    console.log('🔧 [DEBUG] Handling incoming ICE candidate from peer:', peerId)
    
    const peer = this.peers.get(peerId)
    if (peer) {
      await peer.pc.addIceCandidate(candidate)
    }
  }

  async initiateCall(peerId: string) {
    console.log('🔧 [DEBUG] Initiating call to peer:', peerId)
    
    const pc = await this.createPeerConnection(peerId)
    
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    
    this.sendSignalingMessage({
      type: 'offer',
      offer,
      targetPeerId: peerId
    })
  }

  private sendSignalingMessage(message: any) {
    if (this.signalingChannel) {
      console.log('🔧 [DEBUG] Sending signaling message:', message)
      // This would send the message through the signaling channel
      // For now, we'll use a simple approach
      this.signalingChannel.send(JSON.stringify(message))
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = enabled
        console.log('🔧 [DEBUG] Video track enabled:', enabled)
      }
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = enabled
        console.log('🔧 [DEBUG] Audio track enabled:', enabled)
      }
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0]
      this.peers.forEach(peer => {
        const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video')
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack)
        }
      })

      return screenStream
    } catch (error) {
      console.error('Error starting screen share:', error)
      throw error
    }
  }

  stopScreenShare() {
    // Stop screen share and restore camera
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      this.peers.forEach(peer => {
        const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video')
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack)
        }
      })
    }
  }

  removePeer(peerId: string) {
    const peer = this.peers.get(peerId)
    if (peer) {
      peer.pc.close()
      this.peers.delete(peerId)
      console.log('🔧 [DEBUG] Removed peer:', peerId)
    }
  }

  cleanup() {
    console.log('🔧 [DEBUG] Cleaning up WebRTC manager')
    
    // Close all peer connections
    this.peers.forEach(peer => {
      peer.pc.close()
    })
    this.peers.clear()

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop()
      })
      this.localStream = null
    }
  }
}