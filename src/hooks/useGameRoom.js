import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../services/firebase'
import { claimHost } from '../services/gameService'

export const useGameRoom = (roomId) => {
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    const playerName = localStorage.getItem('playerName')
    if (!playerName) return

    const roomRef = ref(db, `rooms/${roomId}`)
    const unsub = onValue(roomRef, async (snap) => {
      const data = snap.val()
      setGameData(data)
      setLoading(false)

      // Tự giành host nếu host cũ out
      if (data && data.host && !data.players?.[data.host]) {
        await claimHost(roomId)
      }

      // Bị kick hoặc phòng bay màu
      if (data === null || (data && !data.players?.[playerName])) {
        localStorage.removeItem('roomId')
        setTimeout(() => window.location.reload(), 100)
      }

      //  =====================

      // Nếu vào lại mà tên mình không có trong phòng -> tự out
      if (data && playerName && !data.players?.[playerName]) {
        localStorage.removeItem('roomId')
        window.location.reload() // hoặc setRoomId(null)
      }
    })

    return () => unsub()
  }, [roomId])

  return { gameData, loading }
}