import { EventEmitter } from 'events';
export declare enum UltravoxSessionStatus {
    DISCONNECTED = "disconnected",
    DISCONNECTING = "disconnecting",
    CONNECTING = "connecting",
    IDLE = "idle",
    LISTENING = "listening",
    THINKING = "thinking",
    SPEAKING = "speaking"
}
export declare enum Role {
    USER = "user",
    AGENT = "agent"
}
export declare enum Medium {
    VOICE = "voice",
    TEXT = "text"
}
export interface Transcript {
    text: string;
    isFinal: boolean;
    speaker: Role;
    medium: Medium;
}
interface RTCConfig {
    iceServers: RTCIceServer[];
    enableDataChannel?: boolean;
    enableAudio?: boolean;
    onToolResponse?: (tool: string, params: any) => Promise<{
        data?: any;
        responseType?: 'hang-up' | 'new-stage';
    }>;
}
export declare class UltravoxSession extends EventEmitter {
    private ws;
    private pc;
    private dataChannel;
    private audioStream;
    private status;
    private transcripts;
    private rtcConfig;
    constructor(config?: Partial<RTCConfig>);
    joinCall(url: string): Promise<void>;
    leaveCall(): Promise<void>;
    getStatus(): UltravoxSessionStatus;
    getTranscripts(): Transcript[];
    private initializeWebRTC;
    private setupDataChannel;
    private setupAudioStream;
    private setupWebSocketHandlers;
    private handleWebSocketMessage;
    private handleDataChannelMessage;
    private handleTranscript;
    private setStatus;
}
export {};
