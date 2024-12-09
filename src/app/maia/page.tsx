// app/maia/page.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import ChatPopup from '@/components/chat/ChatPopup';

export default function MaiaPage() {
  const services = [
    {
      english: "Customer Service Management",
      maori: "Whakahaerehia Ratonga Kiritaki"
    },
    {
      english: "Chat Support",
      maori: "Tautoko Korero"
    },
    {
      english: "Client Interaction Optimization",
      maori: "Whakapai Whakawhitinga Kiritaki"
    },
    {
      english: "Real-time Communication Solutions",
      maori: "Whakangao Whakawhitinga Tere"
    }
  ]

  const translationServices = [
    {
      english: "Professional Translation Services",
      maori: "Ratonga Whakamāori Ngā Mahi"
    },
    {
      english: "Multilingual Communication Support",
      maori: "Tautoko Whakawhitinga Reo Maha"
    },
    {
      english: "Interpretation and Localization",
      maori: "Whakamāori me te Whakaraupapa"
    }
  ]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-[#1a4b8d]">PluSO</h1>
          <p className="text-lg text-[#1a4b8d] opacity-70">Chat Agency</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-48 h-48 border-4 border-[#1a4b8d] shadow-lg">
            <div className="bg-[#1a4b8d] w-full h-full flex items-center justify-center text-white text-2xl">
              M
            </div>
          </Avatar>
          <h2 className="text-3xl font-bold text-[#1a4b8d]">Maia</h2>
        </div>

        {/* Services Section */}
        <Card className="bg-[#1a4b8d]/10 border-none">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-[#1a4b8d]">Ratonga | Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-[#1a4b8d] border-b-2 border-[#1a4b8d] pb-2">
                  English
                </h3>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li key={`en-${index}`} className="bg-[#1a4b8d]/20 p-3 rounded-lg text-[#1a4b8d]">
                      {service.english}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-[#1a4b8d] border-b-2 border-[#1a4b8d] pb-2">
                  Te Reo Māori
                </h3>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li key={`mi-${index}`} className="bg-[#1a4b8d]/20 p-3 rounded-lg text-[#1a4b8d]">
                      {service.maori}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Translation Services Section */}
        <Card className="bg-[#1a4b8d]/10 border-none">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-[#1a4b8d]">
              Ratonga Whakamāori | Translation Services
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-[#1a4b8d] border-b-2 border-[#1a4b8d] pb-2">
                  English
                </h3>
                <ul className="space-y-2">
                  {translationServices.map((service, index) => (
                    <li key={`en-trans-${index}`} className="bg-[#1a4b8d]/20 p-3 rounded-lg text-[#1a4b8d]">
                      {service.english}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-[#1a4b8d] border-b-2 border-[#1a4b8d] pb-2">
                  Te Reo Māori
                </h3>
                <ul className="space-y-2">
                  {translationServices.map((service, index) => (
                    <li key={`mi-trans-${index}`} className="bg-[#1a4b8d]/20 p-3 rounded-lg text-[#1a4b8d]">
                      {service.maori}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Button */}
        <div className="text-center">
          <Button 
            className="bg-[#1a4b8d] hover:bg-[#1a4b8d]/90"
            size="lg"
          >
            Chat with Maia
          </Button>
        </div>
        <ChatPopup />
        {/* Footer */}
        <footer className="text-center text-[#1a4b8d] opacity-60 text-sm py-6">
          © PluSO 2024 | Tel: +64 022 400 4387
        </footer>
      </div>
    </div>
  )
}