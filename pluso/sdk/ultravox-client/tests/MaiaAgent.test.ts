import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts";
import { UltravoxSession, UltravoxSessionStatus, Role, Medium, ToolResponse } from "../src/UltravoxSession.ts";
import { createMaiaStageConfig } from "../src/agents/maia.ts";

// Import mock implementations from UltravoxSession.test.ts
import "./UltravoxSession.test.ts";

// Mock WebSocket implementation
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
    // Simulate connection success immediately
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.emit('open');
    }, 0);
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    
    const message = JSON.parse(data);
    if (message.type === 'offer') {
      // Simulate server response with an answer
      setTimeout(() => {
        this.emit('message', {
          data: JSON.stringify({
            type: 'answer',
            sdp: 'mock_sdp'
          })
        });
      }, 0);
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.emit('close');
    }, 0);
  }
}

// Mock RTCPeerConnection
class MockRTCPeerConnection extends EventEmitter {
  localDescription: any = null;
  remoteDescription: any = null;
  iceConnectionState = 'new';
  connectionState = 'new';

  constructor() {
    super();
    setTimeout(() => {
      this.iceConnectionState = 'connected';
      this.connectionState = 'connected';
      this.emit('iceconnectionstatechange');
      this.emit('connectionstatechange');
    }, 0);
  }

  createOffer() {
    return Promise.resolve({ type: 'offer', sdp: 'mock_sdp' });
  }

  setLocalDescription(desc: any) {
    this.localDescription = desc;
    return Promise.resolve();
  }

  setRemoteDescription(desc: any) {
    this.remoteDescription = desc;
    return Promise.resolve();
  }

  createDataChannel(label: string) {
    return new MockRTCDataChannel(label);
  }

  addTrack() {
    return { id: 'mock_sender' };
  }

  close() {}
}

// Mock RTCDataChannel
class MockRTCDataChannel extends EventEmitter {
  label: string;
  readyState = 'connecting';

  constructor(label: string) {
    super();
    this.label = label;
    setTimeout(() => {
      this.readyState = 'open';
      this.emit('open');
    }, 0);
  }

  send(data: string) {}
  close() {
    this.readyState = 'closed';
    this.emit('close');
  }
}

// Mock MediaStream
class MockMediaStream {
  id = 'mock_stream';
  active = true;

  getTracks() {
    return [{
      kind: 'audio',
      enabled: true,
      stop: () => {}
    }];
  }
}

// Replace global objects with mocks
(globalThis as any).WebSocket = MockWebSocket;
(globalThis as any).RTCPeerConnection = MockRTCPeerConnection;
(globalThis as any).MediaStream = MockMediaStream;

Deno.test({
  name: "Maia Agent Tests",
  async fn(t) {
    await t.step("should connect to Maia agent", async () => {
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true
      });

      const stageConfig = createMaiaStageConfig({
        initialMessages: [
          {
            role: Role.USER,
            content: "Hello, Maia!",
            medium: Medium.TEXT,
            timestamp: new Date().toISOString()
          }
        ]
      });

      await session.joinCall("ws://localhost:8080");
      assertEquals(session.getStatus(), UltravoxSessionStatus.IDLE);

      // Send initial message
      const transcripts = session.getTranscripts();
      assertEquals(transcripts.length, 0, "Should start with no transcripts");

      await session.leaveCall();
      assertEquals(session.getStatus(), UltravoxSessionStatus.DISCONNECTED);
    });

    await t.step("should handle Maia responses", async () => {
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true
      });

      const stageConfig = createMaiaStageConfig({
        initialMessages: [
          {
            role: Role.USER,
            content: "What can you help me with?",
            medium: Medium.TEXT,
            timestamp: new Date().toISOString()
          }
        ]
      });

      await session.joinCall("ws://localhost:8080");
      assertEquals(session.getStatus(), UltravoxSessionStatus.IDLE);

      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate receiving a transcript
      (session as any).ws.emit('message', {
        data: JSON.stringify({
          type: 'transcript',
          text: 'Hello from Maia',
          isFinal: true,
          speaker: 'agent',
          medium: 'text'
        })
      });

      const transcripts = session.getTranscripts();
      assertEquals(transcripts.length, 1);
      assertEquals(transcripts[0].text, 'Hello from Maia');

      await session.leaveCall();
      assertEquals(session.getStatus(), UltravoxSessionStatus.DISCONNECTED);
    });

    await t.step("should handle Maia tools", async () => {
      let toolCalled = false;
      const session = new UltravoxSession({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        enableDataChannel: true,
        enableAudio: true,
        onToolResponse: async (tool: string, params: any): Promise<ToolResponse> => {
          toolCalled = true;
          return {
            responseType: "text" as const,
            data: "Tool response"
          };
        }
      });

      const stageConfig = createMaiaStageConfig({
        initialMessages: [
          {
            role: Role.USER,
            content: "Change the stage",
            medium: Medium.TEXT,
            timestamp: new Date().toISOString()
          }
        ]
      });

      await session.joinCall("ws://localhost:8080");
      assertEquals(session.getStatus(), UltravoxSessionStatus.IDLE);

      // Wait for tool call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate receiving a tool request
      (session as any).ws.emit('message', {
        data: JSON.stringify({
          type: 'tool_request',
          tool: 'test_tool',
          params: {}
        })
      });

      // Wait for tool response
      await new Promise(resolve => setTimeout(resolve, 100));
      assertEquals(toolCalled, true);

      await session.leaveCall();
      assertEquals(session.getStatus(), UltravoxSessionStatus.DISCONNECTED);
    });
  }
});
