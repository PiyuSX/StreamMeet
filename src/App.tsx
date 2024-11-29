import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ChatRoom from './components/ChatRoom'
import TextChatRoom from './components/TextChatRoom'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video-chat" element={<ChatRoom />} />
          <Route path="/text-chat" element={<TextChatRoom />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App