"use client"

import { useState } from 'react'
import { Send, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useChat } from '@/hooks/use-chat'

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'icons',
  'identicon',
  'initials',
  'lorelei',
  'lorelei-neutral',
  'micah',
  'miniavs',
  'notionists',
  'notionists-neutral',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'shapes',
  'thumbs'
]

const generateRandomAvatar = (name: string) => {
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)]
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
}

export function ChatSidebar() {
  const { messages, users, connected, joinChat, sendMessage, socket } = useChat()
  const [inputMessage, setInputMessage] = useState('')
  const [showJoinDialog, setShowJoinDialog] = useState(true)
  const [userName, setUserName] = useState('')

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    sendMessage(inputMessage)
    setInputMessage('')
  }

  const handleJoinChat = () => {
    if (!userName.trim()) return
    const avatar = generateRandomAvatar(userName)
    joinChat(userName, avatar)
    setShowJoinDialog(false)
  }

  const renderAvatar = (sender: { name: string; avatar?: string }) => (
    <Avatar className="h-8 w-8">
      <AvatarImage src={sender.avatar || generateRandomAvatar(sender.name)} alt={sender.name} />
      <AvatarFallback>{getInitials(sender.name)}</AvatarFallback>
    </Avatar>
  )

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/60">Conectando ao chat...</p>
      </div>
    )
  }

  return (
    <>
      <Dialog open={showJoinDialog && connected} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entre no Chat</DialogTitle>
            <DialogDescription>
              Digite seu nome para participar do chat
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Seu nome..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinChat()}
              autoFocus
            />
            <Button onClick={handleJoinChat}>Entrar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Chat ao Vivo</h2>
              <p className="text-sm text-white/60">
                {connected ? 'Conectado' : 'Conectando...'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">{users.length}</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender.id === 'system'
                    ? 'justify-center'
                    : message.sender.id === socket?.id
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                {message.sender.id !== 'system' && message.sender.id !== socket?.id && (
                  renderAvatar(message.sender)
                )}
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    message.sender.id === 'system'
                      ? 'bg-white/5 text-white/60 text-sm'
                      : message.sender.id === socket?.id
                      ? 'bg-purple-600/80 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.sender.id !== 'system' && (
                    <p className="text-xs text-white/50 mb-1">{message.sender.name}</p>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs text-white/50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {message.sender.id === socket?.id && (
                  renderAvatar(message.sender)
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
              disabled={!connected || showJoinDialog}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!connected || showJoinDialog}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}