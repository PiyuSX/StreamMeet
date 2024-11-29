import { useNavigate } from 'react-router-dom'
import { Video, MessageSquare, ExternalLink } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-indigo-800/30 to-pink-800/30 animate-gradient" />
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
          {/* Logo/Title section */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent animate-pulse">
                StreamMeet
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Connect instantly with people around the world through video or text chat
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-4 text-gray-300 text-sm">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              ✨ No registration required
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              🔒 Private and secure connections
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              🌐 Connect with people globally
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/video-chat')}
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg w-full transform transition-all hover:scale-105 shadow-lg"
            >
              <Video className="group-hover:animate-bounce" size={24} />
              <span className="text-lg font-semibold">Start Video Chat</span>
            </button>
            <button
              onClick={() => navigate('/text-chat')}
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg w-full transform transition-all hover:scale-105 shadow-lg"
            >
              <MessageSquare className="group-hover:animate-bounce" size={24} />
              <span className="text-lg font-semibold">Start Text Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-gray-400">
              Created with ❤️ by{' '}
              <span className="font-semibold text-purple-400">Piyush Rajbanshi</span>
            </p>
            <a
              href="https://piyux.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Visit my website</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home