// app/agents/maia/chat-interface.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 mb-4 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <Avatar className="w-8 h-8">
                  {message.role === 'assistant' ? (
                    <img src="/maia-avatar.jpg" alt="Maia" />
                  ) : (
                    <div className="bg-blue-500 w-full h-full flex items-center justify-center text-white">
                      U
                    </div>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-[#1a4b8d]/10 text-[#1a4b8d]'
                      : 'bg-[#1a4b8d] text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <img src="/maia-avatar.jpg" alt="Maia" />
                </Avatar>
                <div className="bg-[#1a4b8d]/10 rounded-lg px-4 py-2 text-[#1a4b8d]">
                  Typing...
                </div>
              </div>
            )}
          </ScrollArea>

          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}