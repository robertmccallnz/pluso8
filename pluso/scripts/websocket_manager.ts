import { connectToAgentWebSocket, closeAllConnections } from "./websocket_manager.ts";

const AGENTS = [
    { id: "maia", endpoints: ["/ws"] },
    { id: "jeff_LEGAL", endpoints: ["/ws"] },
    { id: "pet_UNIA", endpoints: ["/ws"] }
];
const TEST_MESSAGE = "Test message: Are you operational?";

class WebSocketManager {
    private connections: Map<string, WebSocket> = new Map();

    async initializeConnections() {
        for (const agent of AGENTS) {
            const ws = await connectToAgentWebSocket(agent.id);
            if (ws) {
                this.connections.set(agent.id, ws);
            }
        }
    }

    async runDailyTest() {
        for (const [agentId, ws] of this.connections.entries()) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "message",
                    content: TEST_MESSAGE
                }));
                console.log(`Daily test sent to ${agentId}`);
            }
        }
    }

    closeAllConnections() {
        closeAllConnections();
        this.connections.clear();
    }
}

const manager = new WebSocketManager();

// Initialize connections on startup
await manager.initializeConnections();

// Schedule daily test
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
setInterval(() => {
    manager.runDailyTest();
}, TWENTY_FOUR_HOURS);

// Run first test immediately after a short delay to ensure connections are established
setTimeout(() => {
    manager.runDailyTest();
}, 5000);

// Handle process termination
Deno.addSignalListener("SIGINT", () => {
    console.log("Shutting down WebSocket connections...");
    manager.closeAllConnections();
    Deno.exit(0);
});
