import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

interface VideoStreamProps {
  socket: Socket
  room: string | null
}

const VideoStream = ({ socket, room }: VideoStreamProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        return stream
      } catch (error) {
        console.error('Error accessing media devices:', error)
      }
    }

    const initializePeerConnection = async (stream: MediaStream) => {
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      }

      peerConnection.current = new RTCPeerConnection(configuration)

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream)
      })

      // Handle incoming stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
          setIsConnecting(false)
        }
      }

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            room,
            candidate: event.candidate,
          })
        }
      }

      return peerConnection.current
    }

    const setupWebRTC = async () => {
      const stream = await initializeMedia()
      if (!stream) return

      const pc = await initializePeerConnection(stream)

      // Socket event listeners
      socket.on('offer', async (offer) => {
        if (!pc) return
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('answer', { room, answer })
      })

      socket.on('answer', async (answer) => {
        if (!pc) return
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
      })

      socket.on('ice-candidate', async (candidate) => {
        if (!pc) return
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      })

      // Create and send offer if we're the initiator
      if (room) {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('offer', { room, offer })
      }
    }

    if (room) {
      setupWebRTC()
    }

    return () => {
      peerConnection.current?.close()
    }
  }, [socket, room])

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Remote Video (Full Screen) */}
        <div className="absolute inset-0 bg-gray-800">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500">Connecting...</div>
            </div>
          )}
        </div>
        
        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-purple-600">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover mirror"
            autoPlay
            playsInline
            muted
          />
        </div>
      </div>
    </div>
  )
}

export default VideoStream