import { EventEmitter } from "node:events";

export enum UltravoxSessionStatus {
  DISCONNECTED = 'disconnected',
  DISCONNECTING = 'disconnecting',
  CONNECTING = 'connecting',
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking'
}

export enum Role {
  USER = 'user',
  AGENT = 'agent'
}

export enum Medium {
  VOICE = 'voice',
  TEXT = 'text'
}

export enum ConnectionQuality {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good'
}

interface StageConfig {
  // Add properties for StageConfig
}

interface Transcript {
  text: string;
  isFinal: boolean;
  speaker: Role;
  medium: Medium;
}

interface RTCConfig {
  iceServers: RTCIceServer[];
  enableDataChannel?: boolean;
  enableAudio?: boolean;
  onToolResponse?: (tool: string, params: any) => Promise<ToolResponse>;
}

export interface ToolResponse {
  responseType: 'text' | 'new-stage';
  data: string | StageConfig;
}

interface UltravoxEvents {
  'status': [status: UltravoxSessionStatus];
  'transcript': [text: string];
  'transcripts': [transcripts: Transcript[]];
  'error': [error: Error];
  'audioLevel': [level: number];
  'connectionQuality': [quality: ConnectionQuality];
}

export class UltravoxSession extends EventEmitter {
  private ws: WebSocket | null = null;
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioStream: MediaStream | null = null;
  private status: UltravoxSessionStatus = UltravoxSessionStatus.DISCONNECTED;
  private transcripts: Transcript[] = [];
  private rtcConfig: RTCConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    enableDataChannel: true,
    enableAudio: true
  };
  private onToolResponse?: (tool: string, params: any) => Promise<ToolResponse>;

  constructor(config: {
    iceServers: RTCIceServer[];
    enableDataChannel?: boolean;
    enableAudio?: boolean;
    onToolResponse?: (tool: string, params: any) => Promise<ToolResponse>;
  }) {
    super();
    this.rtcConfig = { ...this.rtcConfig, ...config };
    this.onToolResponse = config.onToolResponse;
  }

  public async joinCall(url: string): Promise<void> {
    try {
      this.setStatus(UltravoxSessionStatus.CONNECTING);
      
      // Initialize WebSocket connection
      this.ws = new WebSocket(url);
      this.setupWebSocketHandlers();

      // Initialize WebRTC if enabled
      if (this.rtcConfig.enableDataChannel || this.rtcConfig.enableAudio) {
        await this.initializeWebRTC();
      }

      // Wait for connection to be established
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        
        this.ws!.onopen = () => {
          clearTimeout(timeout);
          resolve();
        };
      });

      this.setStatus(UltravoxSessionStatus.IDLE);
    } catch (error) {
      this.setStatus(UltravoxSessionStatus.DISCONNECTED);
      throw error;
    }
  }

  public async leaveCall(): Promise<void> {
    this.setStatus(UltravoxSessionStatus.DISCONNECTING);

    // Close WebRTC connections
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    // Close WebSocket connection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setStatus(UltravoxSessionStatus.DISCONNECTED);
  }

  public getStatus(): UltravoxSessionStatus {
    return this.status;
  }

  public getTranscripts(): Transcript[] {
    return [...this.transcripts];
  }

  public async handleToolCall(tool: string, params: any): Promise<ToolResponse> {
    if (!this.onToolResponse) {
      throw new Error('No tool response handler configured');
    }
    return this.onToolResponse(tool, params);
  }

  private async initializeWebRTC(): Promise<void> {
    try {
      const pc = new RTCPeerConnection(this.rtcConfig);
      this.pc = pc;

      // Set up data channel if enabled
      if (this.rtcConfig.enableDataChannel) {
        this.setupDataChannel();
      }

      // Set up audio if enabled
      if (this.rtcConfig.enableAudio) {
        await this.setupAudioStream();
      }

      // Handle ICE candidates
      pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate && this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'ice_candidate',
            candidate: event.candidate
          }));
        }
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'offer',
          sdp: pc.localDescription
        }));
      }
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }

  private setupDataChannel(): void {
    if (!this.pc) return;

    this.dataChannel = this.pc.createDataChannel('ultravox_data', {
      ordered: true,
      maxRetransmits: 3
    });

    this.dataChannel.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        this.handleDataChannelMessage(data);
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    this.dataChannel.onerror = (event: Event) => {
      console.error('Data channel error:', event);
    };
  }

  private async setupAudioStream(): Promise<void> {
    if (!this.pc) return;

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioStream.getTracks().forEach(track => {
        this.pc!.addTrack(track, this.audioStream!);
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        await this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.setStatus(UltravoxSessionStatus.DISCONNECTED);
    };

    this.ws.onclose = () => {
      this.setStatus(UltravoxSessionStatus.DISCONNECTED);
    };
  }

  private async handleWebSocketMessage(data: any): Promise<void> {
    switch (data.type) {
      case 'answer':
        if (this.pc && data.sdp) {
          await this.pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
        break;

      case 'ice_candidate':
        if (this.pc && data.candidate) {
          await this.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        break;

      case 'transcript':
        this.handleTranscript(data);
        break;

      case 'status':
        this.setStatus(data.status);
        break;
    }
  }

  private handleDataChannelMessage(data: any): void {
    switch (data.type) {
      case 'transcript':
        this.handleTranscript(data);
        break;

      case 'status':
        this.setStatus(data.status);
        break;
    }
  }

  private handleTranscript(data: any): void {
    const transcript: Transcript = {
      text: data.text,
      isFinal: data.isFinal,
      speaker: data.speaker,
      medium: data.medium
    };

    this.transcripts.push(transcript);
    this.emit('transcripts', this.getTranscripts());
    this.emit('transcript', transcript.text);
  }

  private setStatus(status: UltravoxSessionStatus): void {
    this.status = status;
    this.emit('status', this.status);
  }
}
