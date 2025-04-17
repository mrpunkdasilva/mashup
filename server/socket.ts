import { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { randomUUID } from 'crypto'

export type ChatMessage = {
  id: string
  text: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  timestamp: Date
}

export type User = {
  id: string
  name: string
  avatar: string
}

export const users = new Map<string, User>()
export const messages: ChatMessage[] = []

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userData: Omit<User, 'id'>) => {
      const user: User = {
        id: socket.id,
        name: userData.name,
        avatar: userData.avatar
      }
      users.set(socket.id, user)
      
      const welcomeMessage: ChatMessage = {
        id: randomUUID(),
        text: `${user.name} entrou no chat!`,
        sender: {
          id: 'system',
          name: 'Sistema',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system'
        },
        timestamp: new Date()
      }
      
      messages.push(welcomeMessage)
      io.emit('message', welcomeMessage)
      io.emit('userJoined', user)
    })

    socket.on('sendMessage', (text: string) => {
      const user = users.get(socket.id)
      if (!user) return

      const message: ChatMessage = {
        id: randomUUID(),
        text,
        sender: user,
        timestamp: new Date()
      }

      messages.push(message)
      io.emit('message', message)
    })

    socket.on('disconnect', () => {
      const user = users.get(socket.id)
      if (!user) return

      users.delete(socket.id)
      
      const leaveMessage: ChatMessage = {
        id: randomUUID(),
        text: `${user.name} saiu do chat`,
        sender: {
          id: 'system',
          name: 'Sistema',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system'
        },
        timestamp: new Date()
      }

      messages.push(leaveMessage)
      io.emit('message', leaveMessage)
      io.emit('userLeft', user.id)
    })
  })

  return io
}