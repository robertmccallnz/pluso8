# PluSO Agent Templates

This directory contains templates and tools for creating new PluSO agents.

## Directory Structure

```
templates/
├── agent/                 # Base agent template
│   ├── config/           # Agent configuration
│   │   ├── agent.yaml    # Agent metadata and configuration
│   │   └── tools.yaml    # Agent tools configuration
│   ├── src/              # Agent source code
│   │   ├── agent.ts      # Main agent implementation
│   │   ├── tools/        # Custom tool implementations
│   │   └── types.ts      # Agent-specific types
│   └── tests/            # Agent tests
├── sdk/                  # SDK generation templates
│   ├── typescript/       # TypeScript SDK template
│   └── python/          # Python SDK template
└── metrics/             # Metrics dashboard templates
    ├── panels/          # Dashboard panel templates
    └── alerts/          # Alert configuration templates

```

## Creating a New Agent

1. Copy the agent template:
   ```bash
   cp -r templates/agent my-new-agent
   ```

2. Configure the agent:
   - Edit `config/agent.yaml` with agent details
   - Configure tools in `config/tools.yaml`
   - Implement custom tools in `src/tools/`

3. Implement the agent:
   - Extend the base agent class in `src/agent.ts`
   - Add custom types in `src/types.ts`
   - Write tests in `tests/`

4. Generate SDKs:
   ```bash
   deno task generate-sdk my-new-agent
   ```

5. Deploy:
   ```bash
   deno task deploy my-new-agent
   ```

## Metrics Integration

Agents automatically integrate with the PluSO metrics system:
- Performance monitoring
- Error tracking
- Usage analytics
- Cost tracking

View metrics at `/metrics` in the dashboard.

## SDK Generation

Agents can be exported as:
- TypeScript/JavaScript SDK
- Python package
- REST API
- WebAssembly module

## Testing

Run agent tests:
```bash
deno test my-new-agent/tests/
```

## Support

For any questions or assistance:
- Email: hello@pluso.co.nz
- Documentation: https://docs.pluso.co.nz
- Slack: #pluso-support

## License

Copyright 2024 PluSO. All rights reserved.
