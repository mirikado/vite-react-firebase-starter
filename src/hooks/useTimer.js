import { useEffect } from 'react'
import { updateTimer, nextTurn } from '../services/gameService'

export const useTimer = (roomId, gameData, isHost) => {
  useEffect(() => {
    if (!isHost || gameData?.phase!== 'describing' ||!gameData) return

    const interval = setInterval(() => {
      const currentTime = gameData.timer
      if (currentTime <= 0) {
        nextTurn(roomId, gameData)
      } else {
        updateTimer(roomId, currentTime - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isHost, gameData?.phase, gameData?.timer, roomId])
}