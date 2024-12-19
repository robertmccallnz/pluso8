import { UltravoxSession, UltravoxSessionStatus } from '../../src/UltravoxSession.ts';
import { StageConfig, ToolResponse, Tool, CreateCallResponse, CallOptions } from '../../src/types.ts';

const API_BASE_URL = 'https://api.ultravox.ai/api';
const API_KEY = 'test-api-key';

// Mock RTCPeerConnection
class MockRTCPeerConnection implements RTCPeerConnection {
  private tracks: MediaStreamTrack[] = [];
  private senders: RTCRtpSender[] = [];
  private onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null = null;
  private onnegotiationneeded: ((event: Event) => void) | null = null;
  private oniceconnectionstatechange: ((event: Event) => void) | null = null;
  
  iceConnectionState: RTCIceConnectionState = 'new';
  connectionState: RTCPeerConnectionState = 'new';
  signalingState: RTCSignalingState = 'stable';
  
  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender {
    this.tracks.push(track);
    const sender = {
      track,
      replaceTrack: async (newTrack: MediaStreamTrack | null) => {},
      getStats: async () => new Map(),
      getParameters: () => ({ 
        encodings: [],
        transactionId: '',
        codecs: [],
        rtcp: { reducedSize: false, cname: '' }
      }),
      setParameters: async (params: RTCRtpSendParameters) => params,
      transport: null,
      dtmf: null,
      streams: streams
    } as RTCRtpSender;
    this.senders.push(sender);
    
    // Trigger negotiation needed
    if (this.onnegotiationneeded) {
      this.onnegotiationneeded(new Event('negotiationneeded'));
    }
    return sender;
  }

  getSenders() {
    return this.senders;
  }

  async createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    return {
      type: 'offer',
      sdp: 'v=0\r\n' +
           'o=- 123456789 2 IN IP4 127.0.0.1\r\n' +
           's=-\r\n' +
           't=0 0\r\n' +
           'a=group:BUNDLE audio\r\n' +
           'm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n' +
           'c=IN IP4 0.0.0.0\r\n' +
           'a=rtcp:9 IN IP4 0.0.0.0\r\n' +
           'a=ice-ufrag:mock\r\n' +
           'a=ice-pwd:mockpwd\r\n' +
           'a=fingerprint:sha-256 mock:fingerprint:value\r\n'
    };
  }

  async createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit> {
    return {
      type: 'answer',
      sdp: 'v=0\r\n' +
           'o=- 123456789 2 IN IP4 127.0.0.1\r\n' +
           's=-\r\n' +
           't=0 0\r\n' +
           'a=group:BUNDLE audio\r\n' +
           'm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n'
    };
  }

  setLocalDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    this.signalingState = desc.type === 'offer' ? 'have-local-offer' : 'stable';
    return Promise.resolve();
  }

  setRemoteDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    this.signalingState = desc.type === 'offer' ? 'have-remote-offer' : 'stable';
    return Promise.resolve();
  }

  addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void> {
    if (this.onicecandidate) {
      this.onicecandidate({
        candidate: candidate || null,
        target: this,
        currentTarget: this,
        srcElement: this,
        timeStamp: Date.now(),
        type: 'icecandidate'
      } as RTCPeerConnectionIceEvent);
    }
    return Promise.resolve();
  }

  addEventListener(type: string, listener: EventListener): void {
    switch (type) {
      case 'icecandidate':
        this.onicecandidate = listener as (event: RTCPeerConnectionIceEvent) => void;
        break;
      case 'negotiationneeded':
        this.onnegotiationneeded = listener as (event: Event) => void;
        break;
      case 'iceconnectionstatechange':
        this.oniceconnectionstatechange = listener as (event: Event) => void;
        break;
    }
  }

  removeEventListener(type: string, listener: EventListener): void {
    switch (type) {
      case 'icecandidate':
        this.onicecandidate = null;
        break;
      case 'negotiationneeded':
        this.onnegotiationneeded = null;
        break;
      case 'iceconnectionstatechange':
        this.oniceconnectionstatechange = null;
        break;
    }
  }

  close(): void {
    this.iceConnectionState = 'closed';
    this.connectionState = 'closed';
    this.signalingState = 'closed';
    if (this.oniceconnectionstatechange) {
      this.oniceconnectionstatechange(new Event('iceconnectionstatechange'));
    }
  }

  getConfiguration(): RTCConfiguration {
    return {
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'balanced',
      rtcpMuxPolicy: 'require'
    };
  }
}

// Mock WebSocket
class MockWebSocket implements WebSocket {
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState: number = WebSocket.CONNECTING;
  url: string;
  protocol: string = '';
  extensions: string = '';
  bufferedAmount: number = 0;
  binaryType: BinaryType = 'blob';

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      if (url.includes('mock-url')) {
        this.readyState = WebSocket.OPEN;
        if (this.onopen) {
          this.onopen(new Event('open'));
        }
      } else {
        if (this.onerror) {
          this.onerror(new Event('error'));
        }
        throw new Error('Connection failed');
      }
    }, 0);
  }

  send(data: string) {
    if (this.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }

    // Parse the incoming message
    const message = JSON.parse(data);

    // Mock message response based on message type
    setTimeout(() => {
      if (this.onmessage) {
        if (message.type === 'status') {
          this.onmessage(new MessageEvent('message', {
            data: JSON.stringify({
              type: 'status',
              status: UltravoxSessionStatus.IDLE
            })
          }));
        } else if (message.type === 'tool') {
          this.onmessage(new MessageEvent('message', {
            data: JSON.stringify({
              type: 'tool_response',
              responseType: 'text',
              data: 'Tool executed successfully'
            })
          }));
        }
      }
    }, 0);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }

  addEventListener(type: string, listener: EventListener) {
    switch (type) {
      case 'open':
        this.onopen = listener as (event: Event) => void;
        break;
      case 'message':
        this.onmessage = listener as (event: MessageEvent) => void;
        break;
      case 'close':
        this.onclose = listener as (event: CloseEvent) => void;
        break;
      case 'error':
        this.onerror = listener as (event: Event) => void;
        break;
    }
  }

  removeEventListener(type: string, listener: EventListener) {
    switch (type) {
      case 'open':
        this.onopen = null;
        break;
      case 'message':
        this.onmessage = null;
        break;
      case 'close':
        this.onclose = null;
        break;
      case 'error':
        this.onerror = null;
        break;
    }
  }
}

describe('Maia Integration', () => {
  let session: UltravoxSession;

  beforeEach(() => {
    // Mock WebSocket
    (global as any).WebSocket = MockWebSocket;
    
    // Mock RTCPeerConnection
    (global as any).RTCPeerConnection = MockRTCPeerConnection;

    // Mock MediaStream
    (global as any).MediaStream = jest.fn().mockImplementation(() => ({
      getTracks: () => [{
        kind: 'audio',
        enabled: true,
        stop: () => {}
      }]
    }));

    // Mock navigator.mediaDevices
    const mockMediaDevices = {
      getUserMedia: jest.fn().mockImplementation(async (constraints) => {
        return new (global as any).MediaStream();
      }),
      enumerateDevices: jest.fn().mockResolvedValue([
        { kind: 'audioinput', deviceId: 'default', label: 'Default Audio Device' }
      ])
    };

    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: mockMediaDevices,
      configurable: true,
      writable: true
    });

    // Initialize session with config
    session = new UltravoxSession({
      iceServers: [],
      enableDataChannel: true,
      enableAudio: true,
      onToolResponse: async (tool: string, params: any): Promise<ToolResponse> => {
        return {
          responseType: 'text',
          data: 'Tool response'
        };
      }
    });
  });

  afterEach(async () => {
    if (session) {
      await session.leaveCall();
    }
  });

  it('should initialize with Maia configuration', async () => {
    expect(session).toBeDefined();
  });

  it('should handle tool responses', async () => {
    const response = await session['onToolResponse']?.('test-tool', {});
    expect(response).toBeDefined();
    expect(response?.responseType).toBe('text');
  });
});

describe('UltravoxSession Integration', () => {
  let session: UltravoxSession;
  let currentCall: CreateCallResponse | null = null;
  let webhookId: string | null = null;

  beforeAll(async () => {
    // Set up webhook for call events
    const webhook = await createWebhook({
      url: 'https://example.com/webhook',
      events: ['call.started', 'call.ended']
    });
    webhookId = webhook.webhookId;
  });

  afterAll(async () => {
    // Clean up webhook
    if (webhookId) {
      await fetch(`${API_BASE_URL}/webhooks/${webhookId}`, {
        method: 'DELETE',
        headers: {
          'X-Unsafe-API-Key': API_KEY
        }
      });
    }
  });

  beforeEach(() => {
    session = new UltravoxSession({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      enableDataChannel: true,
      enableAudio: true
    });
  });

  afterEach(async () => {
    if (currentCall) {
      await session.leaveCall();
      currentCall = null;
    }
  });

  describe('WebRTC Integration', () => {
    it('should establish a full WebRTC conversation flow', async () => {
      const audioLevels: number[] = [];
      const transcripts: string[] = [];
      const statusEvents: UltravoxSessionStatus[] = [];

      session.on('audioLevel', (level: number) => audioLevels.push(level));
      session.on('transcript', (text: string) => transcripts.push(text));
      session.on('status', (status: UltravoxSessionStatus) => statusEvents.push(status));

      currentCall = await createCall(
        { webRtc: {} },
        { firstSpeaker: 'FIRST_SPEAKER_USER' } as CallOptions
      );

      await session.joinCall(currentCall.joinUrl);
      expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

      // Wait for audio levels to be collected
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verify audio is working
      expect(audioLevels.length).toBeGreaterThan(0);

      // Verify we can receive transcripts
      if (transcripts.length > 0) {
        expect(transcripts[0]).toBeTruthy();
      }

      // Verify connection flow
      expect(statusEvents).toContain(UltravoxSessionStatus.CONNECTING);
      expect(statusEvents).toContain(UltravoxSessionStatus.IDLE);
    });

    it('should handle WebRTC reconnection', async () => {
      // 1. Create a call if we don't have one
      if (!currentCall) {
        currentCall = await createCall(
          { webRtc: {} },
          { firstSpeaker: 'FIRST_SPEAKER_USER' } as CallOptions
        );
      }

      // 2. First connection
      await session.joinCall(currentCall.joinUrl);
      expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

      // 3. Force disconnect
      await session.leaveCall();
      expect(session.getStatus()).toBe(UltravoxSessionStatus.DISCONNECTED);

      // 4. Reconnect to same call
      await session.joinCall(currentCall.joinUrl);
      expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);
    }, 40000);
  });

  describe('WebSocket Integration', () => {
    it('should establish a WebSocket connection', async () => {
      // 1. Create a WebSocket call
      currentCall = await createCall({
        serverWebSocket: {
          inputSampleRate: 48000,
          outputSampleRate: 48000,
          clientBufferSizeMs: 30000
        }
      });

      const statusEvents: UltravoxSessionStatus[] = [];
      session.on('status', (status) => statusEvents.push(status));

      // 2. Join call
      await session.joinCall(currentCall.joinUrl);
      expect(session.getStatus()).toBe(UltravoxSessionStatus.Connected);

      // 3. Verify connection
      expect(statusEvents).toContain(UltravoxSessionStatus.Connecting);
      expect(statusEvents).toContain(UltravoxSessionStatus.Connected);
    }, 30000);
  });

  describe('Phone Integration', () => {
    it('should create outgoing Telnyx call', async () => {
      // 1. Create a Telnyx call
      currentCall = await createCall(
        { telnyx: {} },
        'FIRST_SPEAKER_USER'
      );

      expect(currentCall.joinUrl).toBeTruthy();
      // Note: Actually making the phone call would require Telnyx credentials
    });

    it('should create incoming Telnyx call', async () => {
      // 1. Create a Telnyx call for incoming
      currentCall = await createCall(
        { telnyx: {} },
        'FIRST_SPEAKER_AGENT'
      );

      expect(currentCall.joinUrl).toBeTruthy();
      // Note: Actually receiving the phone call would require Telnyx credentials
    });
  });

  describe('Connection Quality', () => {
    it('should monitor connection quality', async () => {
      // 1. Create a new call if needed
      if (!currentCall) {
        currentCall = await createCall({ webRtc: {} });
      }

      const qualityUpdates: string[] = [];
      session.on('connectionQuality', (quality) => qualityUpdates.push(quality));

      await session.joinCall(currentCall.joinUrl);

      // Monitor connection quality for a few seconds
      await new Promise(resolve => setTimeout(resolve, 5000));

      expect(qualityUpdates.length).toBeGreaterThan(0);
      qualityUpdates.forEach(quality => {
        expect(['excellent', 'good', 'fair', 'poor']).toContain(quality);
      });
    }, 20000);
  });
});

describe('UltravoxSession Tool Integration', () => {
  let session: UltravoxSession;
  let currentCall: CreateCallResponse | null = null;

  beforeEach(() => {
    session = new UltravoxSession({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      enableDataChannel: true,
      enableAudio: true,
      onToolResponse: async (tool: string, params: any): Promise<ToolResponse> => {
        // Mock tool response handling
        if (tool === 'stock_price') {
          return {
            data: { price: 150.00, currency: 'USD' }
          };
        } else if (tool === 'create_profile') {
          return {
            data: { profileId: '123', status: 'created' }
          };
        }
        throw new Error(`Unknown tool: ${tool}`);
      }
    });
  });

  afterEach(async () => {
    if (session) {
      await session.leaveCall();
    }
  });

  it('should handle temporary tool calls', async () => {
    currentCall = await createCallWithTools(
      { webRtc: {} },
      { temporaryTool: stockPriceTool }
    );

    await session.joinCall(currentCall.joinUrl);
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

    // Tool call will be triggered by agent's response
    // We can verify the session stays connected and receives responses
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(session.getStatus()).not.toBe(UltravoxSessionStatus.DISCONNECTED);
  });

  it('should handle durable tool calls', async () => {
    // Assuming 'stock_price' is already registered as a durable tool
    currentCall = await createCallWithTools(
      { webRtc: {} },
      { toolName: 'stock_price' }
    );

    await session.joinCall(currentCall.joinUrl);
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(session.getStatus()).not.toBe(UltravoxSessionStatus.DISCONNECTED);
  });

  it('should handle client tool calls with automatic parameters', async () => {
    currentCall = await createCallWithTools(
      { webRtc: {} },
      { temporaryTool: clientProfileTool }
    );

    await session.joinCall(currentCall.joinUrl);
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(session.getStatus()).not.toBe(UltravoxSessionStatus.DISCONNECTED);
  });
});

describe('Stage Management', () => {
  let session: UltravoxSession;
  let currentCall: CreateCallResponse | null = null;

  beforeEach(() => {
    session = new UltravoxSession({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      enableDataChannel: true,
      enableAudio: true,
      onToolResponse: async (tool: string, params: any): Promise<ToolResponse> => {
        if (tool === 'changeStage') {
          return {
            responseType: 'new-stage',
            data: {
              systemPrompt: 'New stage prompt',
              temperature: 0.8,
              voice: 'en-US-Neural2-H',
              selectedTools: [
                {
                  temporaryTool: {
                    modelToolName: 'changeStage',
                    description: 'Changes the current stage of the conversation',
                    dynamicParameters: []
                  }
                }
              ]
            }
          };
        }
        return { responseType: 'text', data: 'Default response' };
      }
    });
  });

  afterEach(async () => {
    if (currentCall) {
      await session.leaveCall();
      currentCall = null;
    }
  });

  it('should handle stage transitions', async () => {
    currentCall = await createCall(
      { webRtc: {} },
      {
        firstSpeaker: 'FIRST_SPEAKER_USER',
        selectedTools: [
          {
            temporaryTool: {
              modelToolName: 'changeStage',
              description: 'Changes the current stage of the conversation',
              dynamicParameters: []
            }
          }
        ]
      }
    );

    await session.joinCall(currentCall.joinUrl);
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

    // Simulate stage change
    const stageChangeResponse = await session.handleToolCall('changeStage', {});
    expect(stageChangeResponse.responseType).toBe('new-stage');
    if (stageChangeResponse.responseType === 'new-stage') {
      const data = stageChangeResponse.data as StageConfig;
      expect(data).toMatchObject({
        systemPrompt: 'New stage prompt',
        temperature: 0.8,
        voice: 'en-US-Neural2-H'
      });
    }

    // Verify session remains connected after stage change
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);
  });

  it('should maintain connection during stage transitions', async () => {
    currentCall = await createCall(
      { webRtc: {} },
      {
        firstSpeaker: 'FIRST_SPEAKER_USER',
        selectedTools: [
          {
            temporaryTool: {
              modelToolName: 'changeStage',
              description: 'Changes the current stage of the conversation',
              dynamicParameters: []
            }
          }
        ]
      }
    );

    await session.joinCall(currentCall.joinUrl);
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);

    // Multiple stage transitions
    for (let i = 0; i < 3; i++) {
      const stageChangeResponse = await session.handleToolCall('changeStage', {
        systemPrompt: `Stage ${i + 1} prompt`
      });
      expect(stageChangeResponse.responseType).toBe('new-stage');
      expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Verify final state
    expect(session.getStatus()).toBe(UltravoxSessionStatus.IDLE);
  });
});
