import { Timer } from '../../components/ui/Timer'
import { useTimer } from '../../hooks/useTimer'

export const PlayingScreen = ({ roomId, playerName, gameData }) => {
  const isHost = gameData?.host === playerName
  useTimer(roomId, gameData, isHost)

  const alivePlayers = Object.entries(gameData?.players || {}).filter(([_, p]) => p.alive)
  const currentPlayerName = alivePlayers[gameData?.currentTurn]?.[0]
  const isMyTurn = currentPlayerName === playerName

  return (
    <div className="text-center">
      <Timer seconds={gameData?.timer} />
      <h2 className="text-2xl font-bold mb-4">Lượt của: {currentPlayerName}</h2>
      {isMyTurn && (
        <div className="bg-green-600 p-4 rounded-lg text-lg mb-6">
          Đến lượt bạn! Từ của bạn: <b>{gameData?.roles?.[playerName]}</b>
        </div>
      )}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        {alivePlayers.map(([name]) => (
          <span key={name} className={`px-3 py-1 rounded-full transition-all ${
            name === currentPlayerName? 'bg-indigo-600 scale-110' : 'bg-gray-700 opacity-50'
          }`}>
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}