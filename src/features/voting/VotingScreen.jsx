import { Button } from '../../components/ui/Button'
import { voteOut, setPhase } from '../../services/gameService'
import { PHASES } from '../../constants/gameConfig'

export const VotingScreen = ({ roomId, playerName, gameData }) => {
  const isHost = gameData?.host === playerName
  const alivePlayers = Object.entries(gameData?.players || {}).filter(([_, p]) => p.alive)
  const deadPlayers = Object.entries(gameData?.players || {}).filter(([_, p]) =>!p.alive)

  const handleVote = async (targetName) => {
    await voteOut(roomId, targetName)

    if (isHost) {
      setTimeout(() => {
        const newAlive = alivePlayers.filter(([name]) => name!== targetName)
        const undercoverAlive = newAlive.filter(([name]) => gameData.roles[name]!== gameData.wordPair[0])
        const civilianAlive = newAlive.filter(([name]) => gameData.roles[name] === gameData.wordPair[0])

        let winner = ''
        if (undercoverAlive.length === 0) winner = 'Dân thường thắng!'
        else if (undercoverAlive.length >= civilianAlive.length) winner = 'Nội gián thắng!'

        if (winner) setPhase(roomId, PHASES.RESULT, { winner })
      }, 500)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Vote loại ai?</h2>
      <div className="space-y-2">
        {alivePlayers.map(([name]) => name!== playerName && (
          <Button key={name} variant="danger" className="w-full" onClick={() => handleVote(name)}>
            Loại {name}
          </Button>
        ))}
      </div>
      <div className="mt-6 text-gray-400 text-center">
        Đã bị loại: {deadPlayers.map(([name]) => name).join(', ') || 'Chưa có'}
      </div>
    </div>
  )
}