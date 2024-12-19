export declare enum UltravoxSessionStatus {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    IDLE = "idle",
    LISTENING = "listening",
    SPEAKING = "speaking",
    ERROR = "error"
}
export declare enum Role {
    AGENT = "agent",
    USER = "user",
    SYSTEM = "system"
}
export declare enum Medium {
    VOICE = "voice",
    TEXT = "text"
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
    transcripts: (transcripts: Transcript[]) => void;
    error: (error: Error) => void;
    audioLevel: (level: number) => void;
    connectionQuality: (quality: ConnectionQuality) => void;
}
export declare enum ConnectionQuality {
    EXCELLENT = "excellent",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor"
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
