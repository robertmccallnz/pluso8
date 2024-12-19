import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts";
import { EventEmitter } from "node:events";
import { UltravoxSession, UltravoxSessionStatus, Role, Medium } from "../src/UltravoxSession.ts";

// Type declarations for WebRTC and Media APIs
declare global {
  interface RTCIceServer {
    urls: string | string[];
    username?: string;
    credential?: string;
  }

  interface RTCConfiguration {
    iceServers: RTCIceServer[];
  }

  interface RTCPeerConnectionEventMap {
    icecandidate: RTCPeerConnectionIceEvent;
    datachannel: RTCDataChannelEvent;
  }

  interface RTCPeerConnectionIceEvent extends Event {
    candidate: RTCIceCandidate | null;
  }

  interface RTCDataChannelEvent extends Event {
    channel: RTCDataChannel;
  }

  interface RTCPeerConnection {
    localDescription: RTCSessionDescription | null;
    remoteDescription: RTCSessionDescription | null;
    iceConnectionState: string;
    onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null;
    addTrack: (track: MediaStreamTrack, stream: MediaStream) => void;
    createOffer: () => Promise<RTCSessionDescription>;
    createAnswer: () => Promise<RTCSessionDescription>;
    setLocalDescription: (desc: RTCSessionDescription) => Promise<void>;
    setRemoteDescription: (desc: RTCSessionDescription) => Promise<void>;
    addIceCandidate: (candidate: RTCIceCandidate) => Promise<void>;
    createDataChannel: (label: string, options?: any) => RTCDataChannel;
    close: () => void;
  }

  interface RTCDataChannel {
    readyState: string;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((error: Event) => void) | null;
    send: (data: string) => void;
    close: () => void;
  }

  interface RTCSessionDescriptionInit {
    type: string;
    sdp: string;
  }

  interface RTCSessionDescription {
    type: string;
    sdp: string;
  }

  interface RTCIceCandidateInit {
    candidate: string;
    sdpMid?: string | null;
    sdpMLineIndex?: number | null;
  }

  interface RTCIceCandidate {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
  }

  interface MediaDevices {
    getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  }

  interface Navigator {
    mediaDevices: MediaDevices;
  }

  interface MediaStreamConstraints {
    audio?: boolean;
    video?: boolean;
  }

  interface MediaStream {
    getTracks: () => MediaStreamTrack[];
    addTrack: (track: MediaStreamTrack) => void;
  }

  interface MediaStreamTrack {
    kind: string;
    enabled: boolean;
    muted: boolean;
    readyState: string;
    stop: () => void;
  }

  interface Window {
    RTCPeerConnection: {
      new(configuration?: RTCConfiguration): RTCPeerConnection;
    };
    RTCSessionDescription: {
      new(init: RTCSessionDescriptionInit): RTCSessionDescription;
    };
    RTCIceCandidate: {
      new(init: RTCIceCandidateInit): RTCIceCandidate;
    };
    WebSocket: {
      new(url: string): WebSocket;
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    };
  }

  var RTCPeerConnection: {
    new(configuration?: RTCConfiguration): RTCPeerConnection;
    prototype: RTCPeerConnection;
  };
  var RTCSessionDescription: {
    new(init: RTCSessionDescriptionInit): RTCSessionDescription;
    prototype: RTCSessionDescription;
  };
  var RTCIceCandidate: {
    new(init: RTCIceCandidateInit): RTCIceCandidate;
    prototype: RTCIceCandidate;
  };
}

// Mock WebSocket
class MockWebSocket extends EventEmitter {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readyState: number;
  url: string;

  constructor(url: string) {
    super();
    this.readyState = MockWebSocket.CONNECTING;
    this.url = url;
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.emit('open');
      
      // Simulate server sending initial stage config
      this.emit('message', {
        data: JSON.stringify({
          type: 'stage_config',
          config: {
            systemPrompt: 'You are a test agent',
            temperature: 0.7,
            voice: 'en-US-Neural2-F',
            selectedTools: []
          }
        })
      });
    }, 50);
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    
    try {
      const message = JSON.parse(data);
      if (message.type === 'offer') {
        // Simulate server response with an answer
        setTimeout(() => {
          this.emit('message', {
            data: JSON.stringify({
              type: 'answer',
              sdp: {
                type: 'answer',
                sdp: 'mock_sdp'
              }
            })
          });
        }, 50);
      } else if (message.type === 'ice_candidate') {
        // Simulate server response with an ICE candidate
        setTimeout(() => {
          this.emit('message', {
            data: JSON.stringify({
              type: 'ice_candidate',
              candidate: {
                candidate: 'mock_candidate',
                sdpMid: '0',
                sdpMLineIndex: 0
              }
            })
          });
        }, 50);
      } else if (message.type === 'transcript') {
        // Simulate server response with a transcript
        setTimeout(() => {
          this.emit('message', {
            data: JSON.stringify({
              type: 'transcript',
              text: 'Mock transcript response',
              isFinal: true,
              speaker: 'agent',
              medium: 'text'
            })
          });
        }, 50);
      }
    } catch (error) {
      console.error('Error handling mock message:', error);
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.emit('close');
    }, 50);
  }
}

// Mock RTCPeerConnection
class MockRTCPeerConnection extends EventEmitter {
  localDescription: RTCSessionDescription | null = null;
  remoteDescription: RTCSessionDescription | null = null;
  iceConnectionState = 'new';
  onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null = null;

  constructor(_config?: RTCConfiguration) {
    super();
  }

  async createOffer(): Promise<RTCSessionDescription> {
    const offer = {
      type: 'offer',
      sdp: 'mock_offer_sdp'
    };
    return new RTCSessionDescription(offer);
  }

  async createAnswer(): Promise<RTCSessionDescription> {
    const answer = {
      type: 'answer',
      sdp: 'mock_answer_sdp'
    };
    return new RTCSessionDescription(answer);
  }

  async setLocalDescription(desc: RTCSessionDescription): Promise<void> {
    this.localDescription = desc;
    // Simulate ICE candidate
    setTimeout(() => {
      if (this.onicecandidate) {
        this.onicecandidate({
          candidate: new RTCIceCandidate({
            candidate: 'mock_candidate',
            sdpMid: '0',
            sdpMLineIndex: 0
          })
        } as RTCPeerConnectionIceEvent);
      }
    }, 50);
  }

  async setRemoteDescription(desc: RTCSessionDescription): Promise<void> {
    this.remoteDescription = desc;
  }

  async addIceCandidate(_candidate: RTCIceCandidate): Promise<void> {
    // Mock implementation
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    // Mock implementation
  }

  createDataChannel(label: string, _options?: any): RTCDataChannel {
    return new MockDataChannel(label);
  }

  close() {
    this.iceConnectionState = 'closed';
  }
}

// Mock DataChannel
class MockDataChannel extends EventEmitter {
  readyState = "open";
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: Event) => void) | null = null;
  label: string;

  constructor(label: string) {
    super();
    this.label = label;
  }

  send(data: string) {
    try {
      const message = JSON.parse(data);
      // Echo back the message to simulate server response
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data }));
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(new Event('error'));
      }
    }
  }

  close() {
    this.readyState = "closed";
    this.emit('close');
  }
}

// Mock MediaStreamTrack
class MockMediaStreamTrack extends EventEmitter {
  kind = "audio";
  enabled = true;
  muted = false;
  readyState = "live";

  stop() {
    this.readyState = "ended";
  }
}

// Mock MediaStream
class MockMediaStream extends EventEmitter {
  private tracks: MockMediaStreamTrack[] = [];

  constructor(tracks: MockMediaStreamTrack[] = []) {
    super();
    this.tracks = tracks;
  }

  getTracks() {
    return this.tracks;
  }

  addTrack(track: MediaStreamTrack) {
    this.tracks.push(track as MockMediaStreamTrack);
  }
}

// Setup global mocks
(globalThis as any).WebSocket = MockWebSocket;
(globalThis as any).RTCPeerConnection = MockRTCPeerConnection;
(globalThis as any).RTCSessionDescription = class implements RTCSessionDescription {
  type: string;
  sdp: string;
  constructor(init: RTCSessionDescriptionInit) {
    this.type = init.type;
    this.sdp = init.sdp;
  }
};
(globalThis as any).RTCIceCandidate = class implements RTCIceCandidate {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
  constructor(init: RTCIceCandidateInit) {
    this.candidate = init.candidate;
    this.sdpMid = init.sdpMid ?? null;
    this.sdpMLineIndex = init.sdpMLineIndex ?? null;
  }
};
(globalThis as any).MediaStream = MockMediaStream;
(globalThis as any).MediaStreamTrack = MockMediaStreamTrack;

// Mock getUserMedia
const mockGetUserMedia = () => {
  const track = new MockMediaStreamTrack();
  const stream = new MockMediaStream([track]);
  return Promise.resolve(stream);
};

// Setup navigator mock
Object.defineProperty(globalThis, 'navigator', {
  value: {
    mediaDevices: {
      getUserMedia: mockGetUserMedia
    }
  },
  configurable: true
});

Deno.test({
  name: "UltravoxSession Tests",
  async fn(t) {
    await t.step("should connect successfully", async () => {
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true
      });
      await session.joinCall("ws://localhost:8080");
      assertEquals(session.getStatus(), UltravoxSessionStatus.IDLE);
      await session.leaveCall();
    });

    await t.step("should handle close events", async () => {
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true
      });
      await session.joinCall("ws://localhost:8080");
      await session.leaveCall();
      assertEquals(session.getStatus(), UltravoxSessionStatus.DISCONNECTED);
    });

    await t.step("should handle media stream", async () => {
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true
      });
      await session.joinCall("ws://localhost:8080");
      await session.leaveCall();
    });

    await t.step("should clean up on close", async () => {
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true
      });
      await session.joinCall("ws://localhost:8080");
      await session.leaveCall();
      assertEquals(session.getStatus(), UltravoxSessionStatus.DISCONNECTED);
    });
  }
});
