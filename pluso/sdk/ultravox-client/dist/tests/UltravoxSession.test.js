"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UltravoxSession_1 = require("../src/UltravoxSession");
const events_1 = require("events");
// Mock WebSocket
class MockWebSocket extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.readyState = WebSocket.CONNECTING;
        setTimeout(() => {
            this.readyState = WebSocket.OPEN;
            this.emit('open');
        }, 100);
    }
    send(data) {
        // Mock send
    }
    close() {
        this.readyState = WebSocket.CLOSED;
        this.emit('close');
    }
}
// Mock RTCPeerConnection
class MockRTCPeerConnection extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.localDescription = null;
    }
    createDataChannel(label, options) {
        return {
            send: jest.fn(),
            close: jest.fn(),
            readyState: 'open',
        };
    }
    async createOffer() {
        return { type: 'offer', sdp: 'mock-sdp' };
    }
    async setLocalDescription(desc) {
        this.localDescription = desc;
    }
    close() { }
}
// Mock getUserMedia
const mockGetUserMedia = jest.fn().mockResolvedValue({
    getTracks: () => [{
            stop: jest.fn()
        }]
});
// Setup global mocks
global.WebSocket = MockWebSocket;
global.RTCPeerConnection = MockRTCPeerConnection;
global.navigator.mediaDevices = {
    getUserMedia: mockGetUserMedia
};
describe('UltravoxSession', () => {
    let session;
    beforeEach(() => {
        session = new UltravoxSession_1.UltravoxSession();
    });
    afterEach(async () => {
        await session.leaveCall();
    });
    describe('Connection Management', () => {
        it('should connect successfully', async () => {
            const connectPromise = session.joinCall('wss://mock-url');
            await expect(connectPromise).resolves.not.toThrow();
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        });
        it('should handle connection failure', async () => {
            // Mock WebSocket to fail
            global.WebSocket = jest.fn().mockImplementation(() => {
                throw new Error('Connection failed');
            });
            const connectPromise = session.joinCall('wss://mock-url');
            await expect(connectPromise).rejects.toThrow('Connection failed');
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.DISCONNECTED);
        });
        it('should disconnect properly', async () => {
            await session.joinCall('wss://mock-url');
            await session.leaveCall();
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.DISCONNECTED);
        });
    });
    describe('WebRTC Integration', () => {
        it('should setup WebRTC with audio', async () => {
            await session.joinCall('wss://mock-url');
            // Verify that getUserMedia was called
            expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
        });
        it('should handle WebRTC negotiation', async () => {
            const statusHandler = jest.fn();
            session.on('status', statusHandler);
            await session.joinCall('wss://mock-url');
            // Simulate receiving an answer
            const ws = session.ws;
            ws.emit('message', {
                data: JSON.stringify({
                    type: 'answer',
                    sdp: 'mock-answer-sdp'
                })
            });
            expect(statusHandler).toHaveBeenCalledWith(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        });
    });
    describe('Transcript Management', () => {
        it('should handle new transcripts', async () => {
            const transcriptHandler = jest.fn();
            session.on('transcripts', transcriptHandler);
            await session.joinCall('wss://mock-url');
            // Simulate receiving a transcript
            const ws = session.ws;
            const mockTranscript = {
                type: 'transcript',
                text: 'Hello, world!',
                isFinal: true,
                speaker: UltravoxSession_1.Role.AGENT,
                medium: UltravoxSession_1.Medium.VOICE
            };
            ws.emit('message', {
                data: JSON.stringify(mockTranscript)
            });
            expect(transcriptHandler).toHaveBeenCalledWith([mockTranscript]);
        });
        it('should emit transcript events', async () => {
            const transcriptHandler = jest.fn();
            session.on('transcripts', transcriptHandler);
            await session.joinCall('wss://mock-url');
            const mockTranscript = {
                type: 'transcript',
                text: 'Hello, world!',
                isFinal: true,
                speaker: UltravoxSession_1.Role.AGENT,
                medium: UltravoxSession_1.Medium.VOICE
            };
            // Simulate receiving a transcript
            const ws = session.ws;
            ws.emit('message', {
                data: JSON.stringify(mockTranscript)
            });
            expect(transcriptHandler).toHaveBeenCalledWith([mockTranscript]);
        });
    });
    describe('Status Management', () => {
        it('should emit status events', async () => {
            const statusHandler = jest.fn();
            session.on('status', statusHandler);
            await session.joinCall('wss://mock-url');
            expect(statusHandler).toHaveBeenCalledWith(UltravoxSession_1.UltravoxSessionStatus.CONNECTING);
            expect(statusHandler).toHaveBeenCalledWith(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        });
        it('should handle status updates from server', async () => {
            const statusHandler = jest.fn();
            session.on('status', statusHandler);
            await session.joinCall('wss://mock-url');
            // Simulate status update from server
            const ws = session.ws;
            ws.emit('message', {
                data: JSON.stringify({
                    type: 'status',
                    status: UltravoxSession_1.UltravoxSessionStatus.LISTENING
                })
            });
            expect(statusHandler).toHaveBeenCalledWith(UltravoxSession_1.UltravoxSessionStatus.LISTENING);
        });
    });
    describe('Error Handling', () => {
        it('should handle WebSocket errors', async () => {
            const errorHandler = jest.fn();
            session.on('error', errorHandler);
            await session.joinCall('wss://mock-url');
            // Simulate WebSocket error
            const ws = session.ws;
            const mockError = new Error('WebSocket error');
            ws.emit('error', mockError);
            expect(errorHandler).toHaveBeenCalledWith(mockError);
        });
    });
});
