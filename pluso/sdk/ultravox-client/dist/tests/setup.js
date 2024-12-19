"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MockWebSocket extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.onopen = null;
        this.onclose = null;
        this.onmessage = null;
        this.onerror = null;
        this.url = url;
        this.readyState = MockWebSocket.CONNECTING;
        // Simulate connection
        setTimeout(() => {
            this.readyState = MockWebSocket.OPEN;
            if (this.onopen)
                this.onopen({ type: 'open' });
            this.emit('open');
        }, 50);
    }
    send(data) {
        if (this.readyState !== MockWebSocket.OPEN) {
            throw new Error('WebSocket is not open');
        }
        // Simulate message echo for testing
        setTimeout(() => {
            if (this.onmessage)
                this.onmessage({ data });
            this.emit('message', { data });
        }, 50);
    }
    close() {
        this.readyState = MockWebSocket.CLOSED;
        if (this.onclose)
            this.onclose({ type: 'close' });
        this.emit('close');
    }
}
MockWebSocket.CONNECTING = 0;
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSING = 2;
MockWebSocket.CLOSED = 3;
class MockMediaStream {
    constructor() {
        this.tracks = [];
    }
    getTracks() {
        return this.tracks;
    }
    addTrack(track) {
        this.tracks.push(track);
    }
    removeTrack(track) {
        const index = this.tracks.indexOf(track);
        if (index > -1) {
            this.tracks.splice(index, 1);
        }
    }
}
class MockRTCPeerConnection extends events_1.EventEmitter {
    constructor(_configuration) {
        super();
        this.senders = [];
        this.localDescription = null;
        this.remoteDescription = null;
        this.iceConnectionState = 'new';
        this.connectionState = 'new';
        this.onicecandidate = null;
        this.oniceconnectionstatechange = null;
        this.onconnectionstatechange = null;
        this.ondatachannel = null;
        this.ontrack = null;
    }
    addTrack(track, stream) {
        const sender = {
            track,
            replaceTrack: jest.fn(),
            getStats: jest.fn(),
        };
        this.senders.push(sender);
        // Create a proper RTCTrackEvent-like object
        const trackEvent = new Event('track');
        Object.defineProperties(trackEvent, {
            track: { value: track },
            streams: { value: [stream] },
            receiver: {
                value: {
                    track,
                    getStats: jest.fn(),
                }
            },
            transceiver: {
                value: {
                    sender,
                    receiver: { track },
                    direction: 'sendrecv',
                }
            }
        });
        if (this.ontrack) {
            this.ontrack(trackEvent);
        }
        return sender;
    }
    async createOffer() {
        return { type: 'offer', sdp: 'mock-sdp' };
    }
    async createAnswer() {
        return { type: 'answer', sdp: 'mock-sdp' };
    }
    async setLocalDescription(desc) {
        this.localDescription = desc;
    }
    async setRemoteDescription(desc) {
        this.remoteDescription = desc;
    }
    createDataChannel(label, _options) {
        const channel = new events_1.EventEmitter();
        Object.assign(channel, {
            label,
            readyState: 'open',
            send: jest.fn(),
            close: jest.fn(),
        });
        return channel;
    }
    close() {
        this.connectionState = 'closed';
        this.emit('connectionstatechange');
    }
    getStats() {
        return Promise.resolve(new Map());
    }
}
// Create a temporary object to hold our mocks
const mockNavigator = {
    mediaDevices: {
        getUserMedia: jest.fn().mockImplementation(async () => {
            const stream = new MockMediaStream();
            // Create a proper MediaStreamTrack-like object
            const track = new EventTarget();
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
