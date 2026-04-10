import { WORD_PAIRS } from '../constants/gameConfig'

export const generateRoomId = () =>
  Math.random().toString(36).substring(2, 7).toUpperCase()

export const assignRoles = (playerList) => {
  const wordPair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]
  const undercoverCount = playerList.length >= 6? 2 : 1

  let roles = {}
  playerList.forEach(p => roles[p] = wordPair[0])

  const shuffled = [...playerList].sort(() => 0.5 - Math.random())
  for (let i = 0; i < undercoverCount; i++) {
    roles[shuffled[i]] = wordPair[1]
  }

  return { roles, wordPair }
}