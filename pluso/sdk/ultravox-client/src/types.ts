export enum UltravoxSessionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  IDLE = 'idle',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  ERROR = 'error'
}

export enum Role {
  AGENT = 'agent',
  USER = 'user',
  SYSTEM = 'system'
}

export enum Medium {
  VOICE = 'voice',
  TEXT = 'text'
}

export interface Transcript {
  type: 'transcript';
  text: string;
  isFinal: boolean;
  speaker: Role;
  medium: Medium;
  metadata?: TranscriptMetadata;
}

export interface UltravoxEvents {
  status: (status: UltravoxSessionStatus) => void;
  transcript: (text: string) => void;
  transcripts: (transcripts: Transcript[]) => void;
  error: (error: Error) => void;
  audioLevel: (level: number) => void;
  connectionQuality: (quality: ConnectionQuality) => void;
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export interface AudioConfig {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  sampleRate?: number;
}

export interface NetworkStats {
  rtt?: number;
  jitter?: number;
  packetLoss?: number;
  bandwidth?: number;
}

export interface TranscriptMetadata {
  confidence: number;
  startTime: number;
  endTime: number;
  wordTimings?: Array<{
    word: string;
    startTime: number;
    endTime: number;
  }>;
}

export interface StageConfig {
  systemPrompt?: string;
  temperature?: number;
  voice?: string;
  languageHint?: string;
  initialMessages?: Message[];
  selectedTools?: Tool[];
}

export interface Stage {
  id: string;
  callId: string;
  config: StageConfig;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  role: Role;
  content: string;
  medium: Medium;
  timestamp: string;
}

export interface Tool {
  temporaryTool: {
    modelToolName: string;
    description: string;
    dynamicParameters: ToolParameter[];
  };
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface StageResponse {
  type: 'new-stage';
  body: StageConfig;
}

export interface ToolResponse {
  responseType: 'text' | 'new-stage' | 'hang-up';
  data: string | StageConfig;
}

export interface CreateCallResponse {
  joinUrl: string;
  callId: string;
}

export interface CallOptions {
  firstSpeaker?: 'FIRST_SPEAKER_USER' | 'FIRST_SPEAKER_AGENT';
  selectedTools?: Tool[];
}

export interface CreateCallOptions {
  webRtc?: {};
  telnyx?: {};
  serverWebSocket?: {
    url: string;
  };
}
