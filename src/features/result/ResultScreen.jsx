import { Button } from '../../components/ui/Button'
import { resetGame } from '../../services/gameService'

export const ResultScreen = ({ roomId, playerName, gameData }) => {
  const isHost = gameData?.host === playerName
  const playerList = Object.entries(gameData?.players || {})

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-6">{gameData?.winner}</h2>
      <h3 className="text-xl mb-4">Lật vai:</h3>
      <div className="space-y-2 mb-6">
        {playerList.map(([name, p]) => (
          <p key={name} className={`${!p.alive? 'line-through opacity-50' : ''}`}>
            {name}: <b>{gameData?.roles?.[name]}</b>
            {gameData?.roles?.[name]!== gameData?.wordPair?.[0] && ' 🕵️'}
            {!p.alive && ' 💀'}
          </p>
        ))}
      </div>
      {isHost && <Button variant="success" onClick={() => resetGame(roomId, gameData.players)}>Chơi lại</Button>}
    </div>
  )
}