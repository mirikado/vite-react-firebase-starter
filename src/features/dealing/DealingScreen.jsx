import { Button } from '../../components/ui/Button'
import { setReady, setPhase } from '../../services/gameService'
import { PHASES } from '../../constants/gameConfig'

export const DealingScreen = ({ roomId, playerName, gameData }) => {
  const isReady = gameData?.players?.[playerName]?.ready
  const isHost = gameData?.host === playerName
  const allReady = Object.values(gameData?.players || {}).every(p => p.ready)

  const handleReady = () => setReady(roomId, playerName)

  const handleStartDescribe = () => {
    if (isHost && allReady) setPhase(roomId, PHASES.DESCRIBING)
  }

  if (isReady) {
    return (
      <div className="text-center">
        <p className="text-xl mb-4">Đợi người khác xem từ...</p>
        {isHost && (
          <Button variant="success" disabled={!allReady} onClick={handleStartDescribe}>
            {allReady? 'Bắt đầu mô tả' : 'Chờ mọi người...'}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Từ bí mật của bạn</h2>
      <div className="bg-gray-800 p-10 rounded-2xl mb-6">
        <h1 className="text-5xl font-bold">{gameData?.roles?.[playerName]}</h1>
        <p className="text-gray-400 mt-4">Ghi nhớ từ này!</p>
      </div>
      <Button variant="success" onClick={handleReady}>Tôi đã nhớ</Button>
    </div>
  )
}