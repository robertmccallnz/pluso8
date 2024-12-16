# PluSO Agent TypeScript SDK

This SDK provides TypeScript bindings for your PluSO agent.

## Installation

```bash
npm install @pluso/agent-sdk
```

## Usage

```typescript
import { PluSOAgent } from '@pluso/agent-sdk';

// Initialize agent
const agent = new PluSOAgent({
  apiKey: 'your-api-key',
  agentId: 'your-agent-id'
});

// Send message
const response = await agent.sendMessage('Hello, agent!');

// Use tools
const result = await agent.useTool('tool-name', {
  param1: 'value1'
});

// Get metrics
const metrics = await agent.getMetrics();
```

## WebAssembly Usage

```typescript
import { initWasm } from '@pluso/agent-sdk/wasm';

// Initialize WebAssembly agent
const agent = await initWasm();

// Use the agent directly (no API calls)
const response = await agent.process('Hello!');
```

## Features

- Full TypeScript support
- WebAssembly optimization
- Automatic retry handling
- Metric collection
- Tool integration
- Error handling

## Need Help?

For support or questions, contact us:
- Email: hello@pluso.co.nz
- Documentation: https://docs.pluso.co.nz

## Documentation

See [full documentation](https://docs.pluso.ai/sdk/typescript) for more details.
