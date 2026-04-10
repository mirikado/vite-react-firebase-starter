import { ref, set, update, remove, get, serverTimestamp } from 'firebase/database'
import { db } from './firebase'
import { TURN_TIME } from '../constants/gameConfig'
import { generateRoomId, assignRoles } from '../utils/random'

export const createRoom = async (playerName) => {
  const roomId = generateRoomId()
  const trimmedName = playerName.trim()
  if (!trimmedName) throw new Error('Tên không được để trống')
  const newGame = {
    phase: 'lobby',
    players: {
      [trimmedName]: {
        name: trimmedName,
        alive: true,
        isHost: true,
        ready: false,
        joinedAt: serverTimestamp()
      }
    },
    host: trimmedName,
    currentTurn: 0,
    timer: TURN_TIME,
    createdAt: serverTimestamp()
  }
  await set(ref(db, `rooms/${roomId}`), newGame)

  return roomId
}

export const joinRoom = async (roomId, playerName) => {
  const roomRef = ref(db, `rooms/${roomId}`)
  const trimmedName = playerName.trim()
  if (!trimmedName) throw new Error('Tên không được để trống')
  const snapshot = await get(roomRef)
  if (!snapshot.exists()) throw new Error('Phòng không tồn tại')
  if (snapshot.val().players?.[playerName]) throw new Error('Tên đã có trong phòng')

  await update(ref(db, `rooms/${roomId}/players/${trimmedName}`), {
    name: trimmedName,
    alive: true,
    isHost: false,
    ready: false,
    joinedAt: serverTimestamp()
  })

}

// HÀM MỚI: Tự giành quyền host khi host cũ out
export const claimHost = async (roomId) => {
  const roomRef = ref(db, `rooms/${roomId}`)
  const snap = await get(roomRef)
  if (!snap.exists()) return

  const data = snap.val()

  // Nếu host hiện tại vẫn còn trong phòng thì thôi
  if (data.host && data.players?.[data.host]) return

  const remainingPlayers = Object.keys(data.players || {})

  // Hết người thì xóa phòng
  if (remainingPlayers.length === 0) {
    await remove(roomRef)
    return
  }

  // Chọn thằng vào sớm nhất làm host mới
  const newHost = remainingPlayers.sort((a, b) =>
    data.players[a].joinedAt - data.players[b].joinedAt
  )[0]

  // Update host mới + set isHost: true cho nó
  const updates = {
    host: newHost,
    [`players/${newHost}/isHost`]: true
  }

  // Set isHost: false cho host cũ nếu nó vẫn còn data rác
  if (data.host) {
    updates[`players/${data.host}/isHost`] = null
  }

  await update(roomRef, updates)
}

export const startGame = async (roomId, players) => {
  const { roles, wordPair } = assignRoles(Object.keys(players))
  await update(ref(db, `rooms/${roomId}`), {
    phase: 'dealing',
    roles,
    wordPair,
    currentTurn: 0,
    timer: TURN_TIME
  })
}

export const setReady = async (roomId, playerName) => {
  await update(ref(db, `rooms/${roomId}/players/${playerName}`), { ready: true })
}

export const nextTurn = async (roomId, currentData) => {
  const alivePlayers = Object.keys(currentData.players).filter(p => currentData.players[p].alive)
  const nextTurn = (currentData.currentTurn + 1) % alivePlayers.length

  if (nextTurn === 0) {
    await update(ref(db, `rooms/${roomId}`), { phase: 'voting', timer: TURN_TIME })
  } else {
    await update(ref(db, `rooms/${roomId}`), { currentTurn: nextTurn, timer: TURN_TIME })
  }
}

export const updateTimer = async (roomId, time) => {
  await update(ref(db, `rooms/${roomId}`), { timer: time })
}

export const voteOut = async (roomId, targetName) => {
  await update(ref(db, `rooms/${roomId}/players/${targetName}`), { alive: false })
}

export const setPhase = async (roomId, phase, extra = {}) => {
  await update(ref(db, `rooms/${roomId}`), { phase, ...extra })
}

export const resetGame = async (roomId, players) => {
  const resetPlayers = {}
  Object.entries(players).forEach(([p, data]) => {
    // Chỉ reset những thằng là player thật
    if (data && typeof data === 'object' && 'alive' in data && p.trim() !== '') {
      resetPlayers[p] = { ...data, alive: true, ready: false }
    }
  })
  await update(ref(db, `rooms/${roomId}`), {
    phase: 'lobby',
    players: resetPlayers,
    roles: null,
    winner: null,
    currentTurn: 0,
    wordPair: null
  })
}

export const kickPlayer = async (roomId, targetName) => {
  await remove(ref(db, `rooms/${roomId}/players/${targetName}`))
}

export const leaveRoom = async (roomId, playerName) => {
  await remove(ref(db, `rooms/${roomId}/players/${playerName}`))
}