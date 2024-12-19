"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltravoxSession = exports.Medium = exports.Role = exports.UltravoxSessionStatus = void 0;
const events_1 = require("events");
var UltravoxSessionStatus;
(function (UltravoxSessionStatus) {
    UltravoxSessionStatus["DISCONNECTED"] = "disconnected";
    UltravoxSessionStatus["DISCONNECTING"] = "disconnecting";
    UltravoxSessionStatus["CONNECTING"] = "connecting";
    UltravoxSessionStatus["IDLE"] = "idle";
    UltravoxSessionStatus["LISTENING"] = "listening";
    UltravoxSessionStatus["THINKING"] = "thinking";
    UltravoxSessionStatus["SPEAKING"] = "speaking";
})(UltravoxSessionStatus || (exports.UltravoxSessionStatus = UltravoxSessionStatus = {}));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["AGENT"] = "agent";
})(Role || (exports.Role = Role = {}));
var Medium;
(function (Medium) {
    Medium["VOICE"] = "voice";
    Medium["TEXT"] = "text";
})(Medium || (exports.Medium = Medium = {}));
class UltravoxSession extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.ws = null;
        this.pc = null;
        this.dataChannel = null;
        this.audioStream = null;
        this.status = UltravoxSessionStatus.DISCONNECTED;
        this.transcripts = [];
        this.rtcConfig = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ],
            enableDataChannel: true,
            enableAudio: true
        };
        if (config) {
            this.rtcConfig = { ...this.rtcConfig, ...config };
        }
    }
    async joinCall(url) {
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
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                this.ws.onopen = () => {
                    clearTimeout(timeout);
                    resolve();
                };
            });
            this.setStatus(UltravoxSessionStatus.IDLE);
        }
        catch (error) {
            this.setStatus(UltravoxSessionStatus.DISCONNECTED);
            throw error;
        }
    }
    async leaveCall() {
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
    getStatus() {
        return this.status;
    }
    getTranscripts() {
        return [...this.transcripts];
    }
    async initializeWebRTC() {
        this.pc = new RTCPeerConnection(this.rtcConfig);
        // Set up data channel if enabled
        if (this.rtcConfig.enableDataChannel) {
            this.setupDataChannel();
        }
        // Set up audio if enabled
        if (this.rtcConfig.enableAudio) {
            await this.setupAudioStream();
        }
        // Handle ICE candidates
        this.pc.onicecandidate = (event) => {
            if (event.candidate && this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'ice_candidate',
                    candidate: event.candidate
                }));
            }
        };
        // Create and send offer
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'offer',
                sdp: this.pc.localDescription
            }));
        }
    }
    setupDataChannel() {
        if (!this.pc)
            return;
        this.dataChannel = this.pc.createDataChannel('ultravox_data', {
            ordered: true,
            maxRetransmits: 3
        });
        this.dataChannel.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleDataChannelMessage(data);
            }
            catch (error) {
                console.error('Error parsing data channel message:', error);
            }
        };
        this.dataChannel.onerror = (error) => {
            console.error('Data channel error:', error);
        };
    }
    async setupAudioStream() {
        if (!this.pc)
            return;
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioStream.getTracks().forEach(track => {
                this.pc.addTrack(track, this.audioStream);
            });
        }
        catch (error) {
            console.error('Error accessing microphone:', error);
            throw error;
        }
    }
    setupWebSocketHandlers() {
        if (!this.ws)
            return;
        this.ws.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                await this.handleWebSocketMessage(data);
            }
            catch (error) {
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
    async handleWebSocketMessage(data) {
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
    handleDataChannelMessage(data) {
        switch (data.type) {
            case 'transcript':
                this.handleTranscript(data);
                break;
            case 'status':
                this.setStatus(data.status);
                break;
        }
    }
    handleTranscript(data) {
        const transcript = {
            text: data.text,
            isFinal: data.isFinal,
            speaker: data.speaker,
            medium: data.medium
        };
        this.transcripts.push(transcript);
        this.emit('transcripts', this.getTranscripts());
    }
    setStatus(status) {
        this.status = status;
        this.emit('status', this.status);
    }
}
exports.UltravoxSession = UltravoxSession;
