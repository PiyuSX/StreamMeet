import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Socket } from 'socket.io-client'

interface Message {
  id: number
  text: string
  isSent: boolean
}

interface ChatBoxProps {
  socket: Socket
  room: string | null
}

const ChatBox = ({ socket, room }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && room) {
      const message = {
        id: Date.now(),
        text: newMessage,
        isSent: true,
      }
      setMessages([...messages, message])
      socket.emit('chat-message', { room, message: newMessage })
      setNewMessage('')
    }
  }

  // Listen for incoming messages
  socket.on('chat-message', (message: string) => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: message,
        isSent: false,
      },
    ])
  })

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header - Fixed */}
      <div className="flex-none p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-4">
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
          />
          <button
            onClick={handleSendMessage}
            className="bg-purple-600 hover:bg-purple-700 rounded-lg p-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox