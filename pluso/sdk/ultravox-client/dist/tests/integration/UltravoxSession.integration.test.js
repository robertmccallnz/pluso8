"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UltravoxSession_1 = require("../../src/UltravoxSession");
const fetch = require('node-fetch');
const API_KEY = process.env.ULTRAVOX_API_KEY || '';
const API_BASE_URL = 'https://api.ultravox.ai/api';
// Mock stock price tool for testing
const stockPriceTool = {
    modelToolName: 'stock_price',
    description: 'Get the current stock price for a given symbol',
    dynamicParameters: [
        {
            name: 'symbol',
            location: 'PARAMETER_LOCATION_QUERY',
            schema: {
                type: 'string',
                description: 'Stock symbol (e.g., AAPL for Apple Inc.)'
            },
            required: true
        }
    ],
    http: {
        baseUrlPattern: 'https://api.stockmarket.com/v1/price',
        httpMethod: 'GET'
    }
};
// Mock client tool for testing
const clientProfileTool = {
    modelToolName: 'create_profile',
    description: 'Creates a profile for the current caller',
    automaticParameters: [
        {
            name: 'call_id',
            location: 'PARAMETER_LOCATION_QUERY',
            knownValue: 'KNOWN_PARAM_CALL_ID'
        }
    ],
    client: {}
};
async function createCall(medium, firstSpeaker) {
    const response = await fetch(`${API_BASE_URL}/calls`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
        },
        body: JSON.stringify({
            systemPrompt: 'You are an expert on speech-to-speech communication.',
            temperature: 0.8,
            model: 'fixie-ai/ultravox',
            voice: 'Mark',
            medium,
            ...(firstSpeaker && { firstSpeaker })
        })
    });
    if (!response.ok) {
        throw new Error(`Failed to create call: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}
async function createCallWithTools(medium, tools, firstSpeaker) {
    const response = await fetch(`${API_BASE_URL}/calls`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
        },
        body: JSON.stringify({
            systemPrompt: 'You are an expert on speech-to-speech communication with access to tools.',
            temperature: 0.8,
            model: 'fixie-ai/ultravox',
            voice: 'Mark',
            medium,
            selectedTools: tools ? [tools] : [],
            ...(firstSpeaker && { firstSpeaker })
        })
    });
    if (!response.ok) {
        throw new Error(`Failed to create call: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}
describe('UltravoxSession Integration', () => {
    let session;
    let currentCall = null;
    beforeEach(() => {
        session = new UltravoxSession_1.UltravoxSession({
            enableAudio: true,
            enableDataChannel: true,
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });
    });
    afterEach(async () => {
        if (session) {
            await session.leaveCall();
        }
    });
    // Only run tests if API key is configured
    const itif = API_KEY ? it : it.skip;
    describe('WebRTC Integration', () => {
        itif('should establish a full WebRTC conversation flow', async () => {
            // 1. Create a new WebRTC call
            currentCall = await createCall({ webRtc: {} });
            expect(currentCall.joinUrl).toBeTruthy();
            // 2. Track events
            const statusEvents = [];
            const transcripts = [];
            const audioLevels = [];
            session.on('status', (status) => statusEvents.push(status));
            session.on('transcripts', (updates) => transcripts.push(...updates));
            session.on('audioLevel', (level) => audioLevels.push(level));
            // 3. Join the call
            await session.joinCall(currentCall.joinUrl);
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
            // 4. Wait for initial connection and events
            await new Promise(resolve => setTimeout(resolve, 5000));
            // 5. Verify connection flow
            expect(statusEvents).toContain(UltravoxSession_1.UltravoxSessionStatus.CONNECTING);
            expect(statusEvents).toContain(UltravoxSession_1.UltravoxSessionStatus.IDLE);
            // 6. Verify audio is working
            expect(audioLevels.length).toBeGreaterThan(0);
            // 7. Verify we can receive transcripts
            if (transcripts.length > 0) {
                expect(transcripts[0]).toMatchObject({
                    text: expect.any(String),
                    isFinal: expect.any(Boolean),
                    speaker: expect.any(String),
                    medium: expect.any(String)
                });
            }
        }, 30000);
        itif('should handle WebRTC reconnection', async () => {
            // 1. Create a call if we don't have one
            if (!currentCall) {
                currentCall = await createCall({ webRtc: {} });
            }
            // 2. First connection
            await session.joinCall(currentCall.joinUrl);
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
            // 3. Force disconnect
            await session.leaveCall();
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.DISCONNECTED);
            // 4. Reconnect to same call
            await session.joinCall(currentCall.joinUrl);
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        }, 40000);
    });
    describe('WebSocket Integration', () => {
        itif('should establish a WebSocket connection', async () => {
            // 1. Create a WebSocket call
            currentCall = await createCall({
                serverWebSocket: {
                    inputSampleRate: 48000,
                    outputSampleRate: 48000,
                    clientBufferSizeMs: 30000
                }
            });
            const statusEvents = [];
            session.on('status', (status) => statusEvents.push(status));
            // 2. Join call
            await session.joinCall(currentCall.joinUrl);
            expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
            // 3. Verify connection
            expect(statusEvents).toContain(UltravoxSession_1.UltravoxSessionStatus.CONNECTING);
            expect(statusEvents).toContain(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        }, 30000);
    });
    describe('Phone Integration', () => {
        itif('should create outgoing Telnyx call', async () => {
            // 1. Create a Telnyx call
            currentCall = await createCall({ telnyx: {} }, 'FIRST_SPEAKER_USER');
            expect(currentCall.joinUrl).toBeTruthy();
            // Note: Actually making the phone call would require Telnyx credentials
        });
        itif('should create incoming Telnyx call', async () => {
            // 1. Create a Telnyx call for incoming
            currentCall = await createCall({ telnyx: {} }, 'FIRST_SPEAKER_AGENT');
            expect(currentCall.joinUrl).toBeTruthy();
            // Note: Actually receiving the phone call would require Telnyx credentials
        });
    });
    describe('Connection Quality', () => {
        itif('should monitor connection quality', async () => {
            // 1. Create a new call if needed
            if (!currentCall) {
                currentCall = await createCall({ webRtc: {} });
            }
            const qualityUpdates = [];
            session.on('connectionQuality', (quality) => qualityUpdates.push(quality));
            await session.joinCall(currentCall.joinUrl);
            // Monitor connection quality for a few seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            expect(qualityUpdates.length).toBeGreaterThan(0);
            qualityUpdates.forEach(quality => {
                expect(['excellent', 'good', 'fair', 'poor']).toContain(quality);
            });
        }, 20000);
    });
});
describe('UltravoxSession Tool Integration', () => {
    let session;
    let currentCall = null;
    beforeEach(() => {
        session = new UltravoxSession_1.UltravoxSession({
            enableAudio: true,
            enableDataChannel: true,
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ],
            onToolResponse: async (tool, params) => {
                // Mock tool response handling
                if (tool === 'stock_price') {
                    return {
                        data: { price: 150.00, currency: 'USD' }
                    };
                }
                else if (tool === 'create_profile') {
                    return {
                        data: { profileId: '123', status: 'created' }
                    };
                }
                throw new Error(`Unknown tool: ${tool}`);
            }
        });
    });
    afterEach(async () => {
        if (session) {
            await session.leaveCall();
        }
    });
    it('should handle temporary tool calls', async () => {
        currentCall = await createCallWithTools({ webRtc: {} }, { temporaryTool: stockPriceTool });
        await session.joinCall(currentCall.joinUrl);
        expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        // Tool call will be triggered by agent's response
        // We can verify the session stays connected and receives responses
        await new Promise(resolve => setTimeout(resolve, 2000));
        expect(session.getStatus()).not.toBe(UltravoxSession_1.UltravoxSessionStatus.DISCONNECTED);
    });
    it('should handle durable tool calls', async () => {
        // Assuming 'stock_price' is already registered as a durable tool
        currentCall = await createCallWithTools({ webRtc: {} }, { toolName: 'stock_price' });
        await session.joinCall(currentCall.joinUrl);
        expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        await new Promise(resolve => setTimeout(resolve, 2000));
        expect(session.getStatus()).not.toBe(UltravoxSession_1.UltravoxSessionStatus.DISCONNECTED);
    });
    it('should handle client tool calls with automatic parameters', async () => {
        currentCall = await createCallWithTools({ webRtc: {} }, { temporaryTool: clientProfileTool });
        await session.joinCall(currentCall.joinUrl);
        expect(session.getStatus()).toBe(UltravoxSession_1.UltravoxSessionStatus.IDLE);
        await new Promise(resolve => setTimeout(resolve, 2000));
        expect(session.getStatus()).not.toBe(UltravoxSession_1.UltravoxSessionStatus.DISCONNECTED);
    });
});
