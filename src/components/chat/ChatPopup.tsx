import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
}

// Define types for the API response
interface ContentBlock {
  type: 'text';
  text: string;
}

interface ApiResponse {
  role: 'assistant';
  content: ContentBlock[];
  id: string;
}

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.sender,
            content: msg.text
          })),
          model: "claude-3-5-sonnet-20241022",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: ApiResponse = await response.json();
      
      const messageText = data.content
        .filter((item: ContentBlock) => item.type === 'text')
        .map((item: ContentBlock) => item.text)
        .join(' ');

      setMessages(prev => [...prev, {
        id: Date.now(),
        text: messageText,
        sender: 'assistant'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I apologize, but I encountered an error. Please try again.",
        sender: 'assistant'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <div className="flex flex-col items-center">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 shadow-lg mb-2"
          >
            <MessageCircle className="h-8 w-8" />
          </Button>
          <span className="text-sm font-medium text-gray-700">Chat with Maia</span>
        </div>
      )}

      {isOpen && (
        <Card className="w-96 h-[500px] flex flex-col shadow-xl">
          <div className="p-4 bg-[#1a4b8d] text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with Maia</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-[#15407a] text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#1a4b8d] text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <span className="animate-pulse">Maia is typing...</span>
                </div>
              </div>
            )}
          </CardContent>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[44px] resize-none"
                rows={1}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="bg-[#1a4b8d] hover:bg-[#15407a]"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ChatPopup;