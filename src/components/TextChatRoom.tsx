import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, X, ArrowRight } from 'lucide-react'
import { io } from 'socket.io-client'

interface Message {
  id: number
  text: string
  isSent: boolean
}

const TextChatRoom = () => {
  const navigate = useNavigate()
  const [socket, setSocket] = useState<any>(null)
  const [room, setRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnecting, setIsConnecting] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Use window.location.origin to get the current domain in production
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:3000';
      
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server')
      newSocket.emit('waiting', { type: 'text' })
    })

    newSocket.on('chatReady', (roomId: string) => {
      setRoom(roomId)
      setIsConnecting(false)
      setMessages([])
    })

    newSocket.on('chat-message', (message: string) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: message,
        isSent: false,
      }])
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() && room) {
      const message = {
        id: Date.now(),
        text: newMessage,
        isSent: true,
      }
      setMessages(prev => [...prev, message])
      socket.emit('chat-message', { room, message: newMessage })
      setNewMessage('')
    }
  }

  const handleNext = () => {
    setIsConnecting(true)
    setMessages([])
    if (socket) {
      socket.emit('next', { type: 'text' })
    }
  }

  const handleLeaveChat = () => {
    if (socket) {
      socket.close()
    }
    navigate('/')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header - Fixed */}
      <div className="flex-none bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-purple-500" />
          <h1 className="text-lg font-semibold">Text Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            Next
            <ArrowRight size={18} />
          </button>
          <button
            onClick={handleLeaveChat}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-4">
          {isConnecting ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Looking for someone to chat with...</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isSent
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message Input - Fixed */}
      <div className="flex-none p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={isConnecting}
          />
          <button
            onClick={handleSendMessage}
            disabled={isConnecting}
            className="bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2 font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default TextChatRoom