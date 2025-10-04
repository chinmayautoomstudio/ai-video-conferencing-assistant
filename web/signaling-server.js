// Simple WebSocket signaling server for WebRTC connections
const WebSocket = require('ws')
const http = require('http')
const url = require('url')

const server = http.createServer()
const wss = new WebSocket.Server({ server })

// Store active rooms and connections
const rooms = new Map() // roomId -> Set of connections
const connections = new Map() // connection -> roomId

wss.on('connection', (ws, req) => {
  const query = url.parse(req.url, true).query
  const roomId = query.roomId
  const userId = query.userId || `user-${Date.now()}`

  console.log(`User ${userId} connecting to room ${roomId}`)

  // Add connection to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  rooms.get(roomId).add(ws)
  connections.set(ws, { roomId, userId })

  // Send room info to new user
  const roomConnections = Array.from(rooms.get(roomId))
  const otherUsers = roomConnections
    .filter(conn => conn !== ws)
    .map(conn => connections.get(conn).userId)

  ws.send(JSON.stringify({
    type: 'room-info',
    roomId,
    userId,
    otherUsers
  }))

  // Notify other users about new user
  roomConnections.forEach(conn => {
    if (conn !== ws && conn.readyState === WebSocket.OPEN) {
      conn.send(JSON.stringify({
        type: 'user-joined',
        userId
      }))
    }
  })

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      const { roomId: userRoomId } = connections.get(ws)

      console.log(`Message from ${userId} in room ${userRoomId}:`, data.type)

      // Broadcast message to all other users in the room
      const roomConnections = rooms.get(userRoomId)
      if (roomConnections) {
        roomConnections.forEach(conn => {
          if (conn !== ws && conn.readyState === WebSocket.OPEN) {
            conn.send(JSON.stringify({
              ...data,
              from: userId
            }))
          }
        })
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  ws.on('close', () => {
    const { roomId: userRoomId, userId: userUserId } = connections.get(ws)
    console.log(`User ${userUserId} disconnected from room ${userRoomId}`)

    // Remove from room
    const roomConnections = rooms.get(userRoomId)
    if (roomConnections) {
      roomConnections.delete(ws)
      if (roomConnections.size === 0) {
        rooms.delete(userRoomId)
      }
    }

    // Notify other users
    if (roomConnections) {
      roomConnections.forEach(conn => {
        if (conn.readyState === WebSocket.OPEN) {
          conn.send(JSON.stringify({
            type: 'user-left',
            userId: userUserId
          }))
        }
      })
    }

    connections.delete(ws)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down signaling server...')
  server.close(() => {
    process.exit(0)
  })
})
