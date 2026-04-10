import { useState } from 'react'
import { Button } from './components/ui/Button'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold">Vite + React + Firebase Starter</h1>
      <p className="mt-4">Bắt đầu code ở đây...</p>
      <Button className="mt-4">Test Button</Button>
    </div>
  )
}

export default App