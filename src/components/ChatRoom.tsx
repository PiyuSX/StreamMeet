import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, VideoOff, Mic, MicOff, MessageSquare, X, ArrowRight } from 'lucide-react'
import { io } from 'socket.io-client'
import ChatBox from './ChatBox'
import VideoStream from './VideoStream'

const ChatRoom = () => {
  const navigate = useNavigate()
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [socket, setSocket] = useState<any>(null)
  const [room, setRoom] = useState<string | null>(null)

  useEffect(() => {
    // Use window.location.origin to get the current domain in production
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:3000';
      
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server')
      newSocket.emit('waiting', { type: 'video' })
    })

    newSocket.on('chatReady', (roomId: string) => {
      setRoom(roomId)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleNext = () => {
    if (socket) {
      socket.emit('next', { type: 'video' })
    }
  }

  const handleLeaveChat = () => {
    if (socket) {
      socket.close()
    }
    navigate('/')
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    // Implementation for actually toggling video stream
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    // Implementation for actually toggling audio stream
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {socket && <VideoStream socket={socket} room={room} />}
        
        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800/80 p-3 rounded-lg backdrop-blur">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700"
          >
            <ArrowRight size={20} />
          </button>
          <button
            onClick={handleLeaveChat}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div
        className={`${
          isChatOpen ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-80 bg-gray-800 border-l border-gray-700`}
      >
        {socket && <ChatBox socket={socket} room={room} />}
      </div>
    </div>
  )
}

export default ChatRoom