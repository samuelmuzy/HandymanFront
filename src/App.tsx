import { useState } from 'react'
import { Login } from './components/Login'
import { Modal } from './components/Modal'
import './App.css'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-3 bg-button-primary text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-semibold"
      >
        Login
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Login />
      </Modal>
    </div>
  )
}

export default App
