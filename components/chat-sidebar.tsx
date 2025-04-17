"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Message = {
  id: string
  text: string
  sender: 'user' | 'system'
  timestamp: Date
}

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bem-vindo ao chat! Como posso ajudar?',
      sender: 'system',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')

    // Simular resposta do sistema
    setTimeout(() => {
      const systemResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado por sua mensagem! Como posso ajudar?',
        sender: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemResponse])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Chat ao Vivo</h2>
        <p className="text-sm text-white/60">Converse com nossa equipe</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'system' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback>BOT</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-purple-600/80 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs text-white/50">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/user-avatar.png" />
                  <AvatarFallback>EU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Digite sua mensagem..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}