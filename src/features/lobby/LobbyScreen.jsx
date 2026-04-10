import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { createRoom, joinRoom, startGame, kickPlayer } from '../../services/gameService'
import { MIN_PLAYERS } from '../../constants/gameConfig'
import { useApi } from '../../hooks/useApi'

export const LobbyScreen = ({ roomId, playerName, gameData, setRoomId, setPlayerName }) => {
  const [joinRoomId, setJoinRoomId] = useState('')
  const [localError, setLocalError] = useState('')
  const { loadingMap, error, callApi } = useApi()
  const isHost = gameData?.host === playerName
  const playerList = Object.entries(gameData?.players || {})

  const handleCreate = async () => {
    const newRoomId = await callApi('createRoom', createRoom, playerName)
    setRoomId(newRoomId)
  }

  const handleJoin = async () => {
    await callApi('joinRoom', joinRoom, joinRoomId.toUpperCase(), playerName)
    setRoomId(joinRoomId.toUpperCase())
  }

  const handleStart = () => {
    if (playerList.length < MIN_PLAYERS) return setLocalError(`Cần ít nhất ${MIN_PLAYERS} người`)
    setLocalError('')
    startGame(roomId, gameData.players)
  }

  const handleKick = async (targetName) => {
    if (window.confirm(`Kick ${targetName} ra khỏi phòng?`)) {
      await callApi('kickPlayer', kickPlayer, roomId, targetName)
    }
  }

  const displayError = error || localError

  if (!roomId) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">🎭 Undercover</h1>
        <Input placeholder="Tên của bạn" value={playerName} onChange={e => setPlayerName(e.target.value)} />
        <Button className="w-full mt-4" onClick={handleCreate} disabled={loadingMap.createRoom}>
          {loadingMap.createRoom ? 'Đang tạo...' : 'Tạo phòng mới'}
        </Button>
        <div className="text-center my-4 text-gray-500">hoặc</div>
        <Input placeholder="Mã phòng" value={joinRoomId} onChange={e => setJoinRoomId(e.target.value.toUpperCase())} />
        <Button className="w-full mt-4" onClick={handleJoin} disabled={loadingMap.joinRoom}>
          {loadingMap.joinRoom ? 'Đang vào phòng...' : 'Vào phòng'}
        </Button>
        {displayError && <p className="text-red-500 text-center mt-4">{displayError}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-3 text-center">Người chơi ({playerList.length})</h3>
        <ul className="space-y-2">
          {playerList.map(([name, p]) => (
            <li key={name} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span>
                {p.isHost && '👑 '}
                {name}
                {name === playerName && ' (Bạn)'}
              </span>
              {isHost && name !== playerName && (
                <button
                  onClick={() => handleKick(name)}
                  disabled={loadingMap.kickPlayer}
                  className="text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
                >
                  {loadingMap.kickPlayer ? '...' : 'Kick'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isHost ? (
        <Button variant="success" className="w-full" onClick={handleStart}>
          Bắt đầu game ({playerList.length} người)
        </Button>
      ) : (
        <p className="text-gray-400 text-center">Đợi chủ phòng bắt đầu...</p>
      )}
      {displayError && <p className="text-red-500 text-center mt-4">{displayError}</p>}
    </div>
  )
}