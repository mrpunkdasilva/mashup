import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ChatMessage, User } from '@/server/socket'

export function useChat() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setConnected(true)
    })

    newSocket.on('message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('userJoined', (user: User) => {
      setUsers(prev => [...prev, user])
    })

    newSocket.on('userLeft', (userId: string) => {
      setUsers(prev => prev.filter(user => user.id !== userId))
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const joinChat = (name: string, avatar?: string) => {
    if (socket) {
      socket.emit('join', { name, avatar })
    }
  }

  const sendMessage = (text: string) => {
    if (socket) {
      socket.emit('sendMessage', text)
    }
  }

  return {
    messages,
    users,
    connected,
    joinChat,
    sendMessage,
    socket // Exportando o socket
  }
}