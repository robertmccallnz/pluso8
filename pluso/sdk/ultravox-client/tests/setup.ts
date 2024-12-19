import { EventEmitter } from 'events';

class MockWebSocket extends EventEmitter {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState: number;
  url: string;
  onopen: ((event: any) => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;

  constructor(url: string) {
    super();
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) this.onopen({ type: 'open' });
      this.emit('open');
    }, 50);
  }

  send(data: string): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    // Simulate message echo for testing
    setTimeout(() => {
      if (this.onmessage) this.onmessage({ data });
      this.emit('message', { data });
    }, 50);
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) this.onclose({ type: 'close' });
    this.emit('close');
  }
}

class MockMediaStream {
  private tracks: MediaStreamTrack[] = [];

  getTracks(): MediaStreamTrack[] {
    return this.tracks;
  }

  addTrack(track: MediaStreamTrack): void {
    this.tracks.push(track);
  }

  removeTrack(track: MediaStreamTrack): void {
    const index = this.tracks.indexOf(track);
    if (index > -1) {
      this.tracks.splice(index, 1);
    }
  }
}

class MockRTCPeerConnection extends EventEmitter {
  private senders: RTCRtpSender[] = [];
  localDescription: RTCSessionDescription | null = null;
  remoteDescription: RTCSessionDescription | null = null;
  iceConnectionState: RTCIceConnectionState = 'new';
  connectionState: RTCPeerConnectionState = 'new';
  onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null = null;
  oniceconnectionstatechange: ((event: Event) => void) | null = null;
  onconnectionstatechange: ((event: Event) => void) | null = null;
  ondatachannel: ((event: RTCDataChannelEvent) => void) | null = null;
  ontrack: ((event: RTCTrackEvent) => void) | null = null;

  constructor(_configuration: RTCConfiguration) {
    super();
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream): RTCRtpSender {
    const sender = {
      track,
      replaceTrack: jest.fn(),
      getStats: jest.fn(),
    } as unknown as RTCRtpSender;

    this.senders.push(sender);

    // Create a proper RTCTrackEvent-like object
    const trackEvent = new Event('track') as RTCTrackEvent;
    Object.defineProperties(trackEvent, {
      track: { value: track },
      streams: { value: [stream] },
      receiver: { 
        value: {
          track,
          getStats: jest.fn(),
        } as unknown as RTCRtpReceiver 
      },
      transceiver: { 
        value: {
          sender,
          receiver: { track },
          direction: 'sendrecv',
        } as unknown as RTCRtpTransceiver 
      }
    });

    if (this.ontrack) {
      this.ontrack(trackEvent);
    }

    return sender;
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    return { type: 'offer', sdp: 'mock-sdp' };
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    return { type: 'answer', sdp: 'mock-sdp' };
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    this.localDescription = desc as RTCSessionDescription;
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    this.remoteDescription = desc as RTCSessionDescription;
  }

  createDataChannel(label: string, _options?: RTCDataChannelInit): RTCDataChannel {
    const channel = new EventEmitter() as unknown as RTCDataChannel;
    Object.assign(channel, {
      label,
      readyState: 'open',
      send: jest.fn(),
      close: jest.fn(),
    });
    return channel;
  }

  close(): void {
    this.connectionState = 'closed';
    this.emit('connectionstatechange');
  }

  getStats(): Promise<RTCStatsReport> {
    return Promise.resolve(new Map() as unknown as RTCStatsReport);
  }
}

// Create a temporary object to hold our mocks
const mockNavigator = {
  mediaDevices: {
    getUserMedia: jest.fn().mockImplementation(async () => {
      const stream = new MockMediaStream();
      
      // Create a proper MediaStreamTrack-like object
      const track = new EventTarget() as MediaStreamTrack;
      Object.defineProperties(track, {
        kind: { value: 'audio' },
        enabled: { value: true, writable: true },
        id: { value: 'mock-audio-track-id' },
        label: { value: 'Mock Audio Track' },
        readyState: { value: 'live' },
        muted: { value: false },
        onended: { value: null, writable: true },
        onmute: { value: null, writable: true },
        onunmute: { value: null, writable: true },
        stop: { value: jest.fn() },
        clone: { value: jest.fn() }
      });

      stream.addTrack(track);
      return stream;
    }),
  },
};

// Assign our mocks to the global object
Object.defineProperty(global, 'RTCPeerConnection', {
  writable: true,
  value: MockRTCPeerConnection,
});

Object.defineProperty(global, 'MediaStream', {
  writable: true,
  value: MockMediaStream,
});

Object.defineProperty(global, 'WebSocket', {
  writable: true,
  value: MockWebSocket,
});

Object.defineProperty(global, 'navigator', {
  writable: true,
  value: mockNavigator,
});
