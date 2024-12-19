# Pluso AI Platform

A modern AI agent platform built with Fresh and Deno.

## Project Structure

```
/pluso
├── agents/                    # Unified agent-related code
│   ├── core/                 # Core agent functionality
│   │   ├── base/            # Base agent classes and interfaces
│   │   ├── runtime/         # Agent runtime environment
│   │   ├── registry/        # Agent registration and discovery
│   │   └── communication/   # Inter-agent messaging
│   ├── types/               # Shared agent types
│   ├── components/          # Reusable agent UI components
│   ├── islands/            # Interactive agent components
│   ├── services/           # Agent-related services
│   └── utils/              # Agent-specific utilities
├── shared/                  # Shared utilities and types
├── deployment/              # Deployment configuration
└── monitoring/             # Monitoring and metrics
```

## Development

1. Install Deno: https://deno.land/manual/getting_started/installation

2. Start the development server:
```bash
deno task start
```

3. Run tests:
```bash
deno test
```

## Architecture

The platform uses a unified agent architecture where all agent-related code is housed in the `/agents` directory. This ensures:

- Easy location of agent-related files
- Consistent code organization between server and client
- Clear separation of concerns
- Simplified deployment and monitoring

## Contributing

1. Follow the directory structure
2. Add tests for new features
3. Update documentation as needed
