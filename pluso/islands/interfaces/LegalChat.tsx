import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import tabScraper from "../../tools/scrapers/tab/mod.ts";

interface Message {
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: number;
}

interface TabEvent {
  id: string;
  name: string;
  venue: string;
  startTime: string;
  status: string;
  type: 'racing' | 'sports';
  url: string;
  distance?: number;
  prize?: number;
  horses?: {
    id: string;
    number: number;
    name: string;
    jockey: string;
    trainer: string;
    weight: number;
    odds: number;
    position?: number;
    finishTime?: string;
  }[];
  result?: {
    winner: {
      name: string;
    };
    margins: string[];
    totalTime: string;
    trackCondition: string;
  };
}

interface Legislation {
  title: string;
  lastUpdated: string;
  sections: {
    id: string;
    number: string;
    title: string;
    content: string;
    subsections: {
      id: string;
      number: string;
      content: string;
    }[];
  }[];
}

export default function LegalChat() {
  const isConnected = useSignal(false);
  const messages = useSignal<Message[]>([]);
  const inputText = useSignal('');
  const wsRef = useSignal<WebSocket | null>(null);
  const fileInputRef = useSignal<HTMLInputElement | null>(null);
  const tabEvents = useSignal<TabEvent[]>([]);
  const isLoadingEvents = useSignal(false);
  const legislation = useSignal<any>(null);
  const isLoadingLegislation = useSignal(false);
  const legislationError = useSignal<string | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/agents/ws-chat`;
    console.log('Connecting to WebSocket at:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.value = ws;

    ws.addEventListener('open', () => {
      console.log('WebSocket connected');
      isConnected.value = true;
    });

    ws.addEventListener('message', (event) => {
      console.log('Message received:', event.data);
      messages.value = [...messages.value, {
        text: event.data,
        type: event.data === 'Thinking...' ? 'system' : 'assistant',
        timestamp: Date.now()
      }];
    });

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      isConnected.value = false;
    });

    ws.addEventListener('close', (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      isConnected.value = false;
      wsRef.value = null;
    });

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      wsRef.value = null;
      isConnected.value = false;
    };
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!wsRef.value || wsRef.value.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not connected, cannot send message');
      return;
    }

    const text = inputText.value.trim();
    if (!text) {
      console.log('Empty message, not sending');
      return;
    }

    console.log('Sending message:', text);
    wsRef.value.send(text);
    messages.value = [...messages.value, {
      text: text,
      type: 'user',
      timestamp: Date.now()
    }];
    inputText.value = '';
  };

  const handleFileUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !wsRef.value) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      wsRef.value.send(JSON.stringify({
        type: 'pdf_upload',
        filename: file.name,
        content: result.text
      }));

      messages.value = [...messages.value, {
        text: `📄 Uploaded: ${file.name}`,
        type: 'system',
        timestamp: Date.now()
      }];
    } catch (error) {
      console.error('Upload error:', error);
      messages.value = [...messages.value, {
        text: '❌ Failed to upload PDF',
        type: 'system',
        timestamp: Date.now()
      }];
    }
  };

  const exportChat = () => {
    const chatContent = messages.value
      .filter(m => m.type !== 'system')
      .map(m => `${m.type === 'user' ? 'You' : 'Jeff Legal'}: ${m.text}`)
      .join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fetchTabEvents = async (type: 'racing' | 'sports' = 'racing') => {
    try {
      console.log('Starting to fetch', type, 'events');
      isLoadingEvents.value = true;
      const events = await tabScraper.getRaceEvents(type);
      console.log('Received events:', events);
      tabEvents.value = events;
      
      if (events.length === 0) {
        messages.value = [...messages.value, {
          text: `No ${type} events found.`,
          type: 'system',
          timestamp: Date.now()
        }];
      } else {
        messages.value = [...messages.value, {
          text: `Found ${events.length} ${type} events.`,
          type: 'system',
          timestamp: Date.now()
        }];
      }
    } catch (error) {
      console.error('Error fetching TAB events:', error);
      messages.value = [...messages.value, {
        text: 'Failed to fetch TAB events. Please try again later.',
        type: 'system',
        timestamp: Date.now()
      }];
    } finally {
      isLoadingEvents.value = false;
    }
  };

  const viewLegislation = () => {
    const legislationUrl = "https://legislation.govt.nz/regulation/public/2011/0374/latest/DLM4072719.html";
    
    // Open legislation in new tab
    window.open(legislationUrl, '_blank');
    
    // Add legislation content to chat for Jeff's context
    messages.value = [...messages.value, {
      text: `Māori Land Court Rules 2011

Key sections:
1.4 Purpose
The purpose of these rules is to—
(a) promote the purpose and principles of Te Ture Whenua Maori Act 1993; and
(b) enable the court to deal with matters as fairly, efficiently, simply, and speedily as is consistent with justice; and
(c) recognise tikanga Māori in court operations and processes; and
(d) enable parties to participate in court processes; and
(e) facilitate the resolution of disputes.

1.5 Interpretation
In these rules, unless the context otherwise requires,—
Act means Te Ture Whenua Maori Act 1993
applicant includes any person who makes an application to the court
application includes—
(a) an application made under the Act or any other enactment:
(b) a claim or other proceeding commenced in the court
Chief Judge means the Chief Judge of the Māori Land Court
Chief Registrar means the Chief Registrar of the Māori Land Court
court means the Māori Land Court
Judge means a Judge of the Māori Land Court
party means a person who is an applicant or a respondent
Registrar means a Registrar of the Māori Land Court
respondent means any person who opposes an application to the court
rules means these rules
tikanga Māori means Māori customary values and practices`,
      type: 'system',
      timestamp: Date.now()
    }, {
      text: "I've opened the Māori Land Court Rules 2011 in a new tab for you to reference. I also have the key sections in my context now, so I can help explain any part of these rules. What would you like to know about?",
      type: 'assistant',
      timestamp: Date.now()
    }];
  };

  return (
    <div class="p-4">
      <div class="mb-6 flex gap-6">
        <div class="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Meet Jeff - Your Legal Expert</h2>
          <p class="text-gray-600 mb-4">
            Jeff brings decades of experience in New Zealand law, specializing in property law and regulations. He can help you with:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>Property Law & Transactions 🏠</li>
            <li>Māori Land Law & Te Tiriti o Waitangi 📜</li>
            <li>Racing & Sports Regulations ⚖️</li>
            <li>Document Analysis & Legal Guidance 📋</li>
          </ul>
        </div>

        <div class="w-80 bg-white rounded-lg shadow-md overflow-hidden">
          <div class="relative h-80 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop"
              alt="Jeff - Legal Expert"
              class="w-full h-full object-cover object-center"
            />
          </div>
          <div class="p-4 text-center bg-white">
            <h3 class="text-xl font-semibold text-gray-800">Jeff</h3>
            <p class="text-gray-600 mt-1">Senior Legal Expert</p>
            <div class="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Available Now
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 flex justify-between items-center">
        <div class="font-bold">
          {isConnected.value ? (
            <span class="text-green-600">Connected 🟢</span>
          ) : (
            <span class="text-red-600">Disconnected 🔴</span>
          )}
        </div>
        <div class="flex gap-2">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            class="hidden"
            ref={(el) => fileInputRef.value = el}
          />
          <button
            onClick={() => fileInputRef.value?.click()}
            disabled={!isConnected.value}
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Upload PDF 📄
          </button>
          <button
            onClick={exportChat}
            disabled={messages.value.length === 0}
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Export Chat 💾
          </button>
          <button
            onClick={() => fetchTabEvents('racing')}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            disabled={isLoadingEvents.value}
          >
            {isLoadingEvents.value ? 'Loading...' : 'Get Racing Events 🏇'}
          </button>
          <button
            onClick={() => fetchTabEvents('sports')}
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            disabled={isLoadingEvents.value}
          >
            {isLoadingEvents.value ? 'Loading...' : 'Get Sports Events ⚽'}
          </button>
          <button
            onClick={viewLegislation}
            class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            View Māori Land Court Rules 📜
          </button>
        </div>
      </div>

      {tabEvents.value.length > 0 && (
        <div class="mb-4 bg-white rounded-lg shadow-md p-4">
          <h3 class="text-lg font-semibold mb-2">Latest {tabEvents.value[0].type === 'racing' ? 'Racing' : 'Sports'} Events</h3>
          <div class="grid grid-cols-1 gap-4">
            {tabEvents.value.map(event => (
              <div key={event.id} class="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-lg">{event.name}</div>
                    <div class="text-sm text-gray-600 space-y-1">
                      <div><span class="font-medium">Venue:</span> {event.venue}</div>
                      <div><span class="font-medium">Start Time:</span> {new Date(event.startTime).toLocaleString()}</div>
                      <div>
                        <span class="font-medium">Status:</span> 
                        <span class={`ml-1 ${event.status === 'Live' || event.status === 'Open' ? 'text-green-600' : 'text-blue-600'}`}>
                          {event.status}
                        </span>
                      </div>
                      {event.distance && <div><span class="font-medium">Distance:</span> {event.distance}m</div>}
                      {event.prize && <div><span class="font-medium">Prize Money:</span> ${event.prize.toLocaleString()}</div>}
                    </div>
                  </div>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    View on TAB →
                  </a>
                </div>

                {event.horses && (
                  <div class="mt-4">
                    <div class="font-medium mb-2">Race Card</div>
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horse</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jockey</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                            {event.result && (
                              <>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          {event.horses.map((horse) => (
                            <tr key={horse.id} class={horse.position === 1 ? 'bg-yellow-50' : ''}>
                              <td class="px-3 py-2 whitespace-nowrap text-sm">{horse.number}</td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                {horse.name}
                                {horse.position === 1 && <span class="ml-2 text-yellow-500">🏆</span>}
                              </td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm">{horse.jockey}</td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm">{horse.trainer}</td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm">{horse.weight}kg</td>
                              <td class="px-3 py-2 whitespace-nowrap text-sm">${horse.odds.toFixed(2)}</td>
                              {event.result && (
                                <>
                                  <td class="px-3 py-2 whitespace-nowrap text-sm">
                                    {horse.position}
                                    {horse.position <= 3 && (
                                      <span class="ml-1">
                                        {horse.position === 1 ? '🥇' : horse.position === 2 ? '🥈' : '🥉'}
                                      </span>
                                    )}
                                  </td>
                                  <td class="px-3 py-2 whitespace-nowrap text-sm">{horse.finishTime}</td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {event.result && (
                      <div class="mt-4 bg-gray-50 p-3 rounded-md">
                        <div class="font-medium mb-2">Race Result</div>
                        <div class="text-sm space-y-1">
                          <div><span class="font-medium">Winner:</span> {event.result.winner.name}</div>
                          <div><span class="font-medium">Margins:</span> {event.result.margins.join(', ')}</div>
                          <div><span class="font-medium">Time:</span> {event.result.totalTime}</div>
                          <div><span class="font-medium">Track:</span> {event.result.trackCondition}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {legislationError.value && (
        <div class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {legislationError.value}
        </div>
      )}

      <div class="mb-4 h-[400px] overflow-y-auto border rounded-lg p-4 bg-gray-50 shadow-inner">
        {messages.value.length === 0 ? (
          <div class="text-gray-500 text-center">Start chatting with Jeff about property law or upload a document for analysis</div>
        ) : (
          messages.value.map((msg, i) => (
            <div
              key={i}
              class={`mb-3 ${
                msg.type === 'user'
                  ? 'text-right'
                  : msg.type === 'system'
                  ? 'text-center'
                  : 'text-left'
              }`}
            >
              <div
                class={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.type === 'system'
                    ? 'bg-gray-200 text-gray-600 text-sm'
                    : 'bg-white shadow-md'
                }`}
              >
                {msg.text}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} class="flex gap-2">
        <input
          type="text"
          value={inputText.value}
          onInput={(e) => inputText.value = (e.target as HTMLInputElement).value}
          placeholder="Ask Jeff about property law..."
          class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected.value}
        />
        <button
          type="submit"
          disabled={!isConnected.value}
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}