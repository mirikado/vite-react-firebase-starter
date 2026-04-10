import { useState } from 'react'
import { Button } from '../ui/Button'

export const Header = ({ roomId, onLeave }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!roomId) {
    return (
      <div className="text-center mb-6 p-4">
        <h1 className="text-3xl font-bold">🎭 Undercover</h1>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-gray-400">Phòng:</span>
        <b className="text-indigo-400 text-lg">{roomId}</b>
        <Button 
          variant="secondary" 
          onClick={handleCopy} 
          className="py-1 px-2 text-xs"
        >
          {copied ? 'Đã copy!' : 'Copy'}
        </Button>
      </div>
      <Button variant="danger" onClick={onLeave} className="py-2 px-3 text-sm">
        Thoát
      </Button>
    </div>
  )
}