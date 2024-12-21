# Pluso Platform Startup Guide

## Architecture Overview

The Pluso platform is built using Deno Fresh with Preact, following a modern island architecture pattern. Here's how the codebase is organized:

### Directory Structure

```
pluso/
├── core/                 # Core business logic and services
│   ├── agents/          # Agent-related functionality
│   ├── ml/              # Machine learning integrations
│   └── services/        # Platform services
├── islands/             # Interactive client-side components
├── routes/              # Server-side routes and API endpoints
├── components/          # Shared UI components
├── static/              # Static assets
├── utils/              # Utility functions and helpers
└── tests/              # Test files
```

### Key Components

1. **Server-Side (routes/)**
   - API endpoints in `routes/api/`
   - Page handlers in route files
   - Server-side rendering with Fresh

2. **Client-Side (islands/)**
   - Interactive components
   - Agent creation interface
   - Dashboard components

3. **Core Services**
   - Agent Management
   - ML Model Integration
   - Architecture Auto-optimization

## Getting Started

1. **Prerequisites**
   ```bash
   # Install Deno
   curl -fsSL https://deno.land/x/install/install.sh | sh
   
   # Install Node.js (for development tools)
   brew install node
   ```

2. **Environment Setup**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Configure required environment variables:
   OPENAI_API_KEY=your_key
   ANTHROPIC_API_KEY=your_key
   TOGETHER_API_KEY=your_key
   ```

3. **Development**
   ```bash
   # Start development server
   deno task start
   
   # Run tests
   deno test
   
   # Type check
   deno check **/*.ts
   ```

## Architecture Guidelines

### 1. Component Placement

- **Server Components** (`routes/`):
  - Page layouts
  - API handlers
  - Server-side rendering

- **Islands** (`islands/`):
  - Interactive UI components
  - Client-side state management
  - Real-time features

- **Shared Components** (`components/`):
  - Static UI elements
  - Layout components
  - Design system elements

### 2. State Management

- Use Preact Signals for reactive state
- Keep state close to where it's used
- Use server-side state for initial data

### 3. API Design

- RESTful endpoints in `routes/api/`
- WebSocket connections for real-time features
- Type-safe API responses

### 4. ML Integration

- Model selection in `core/ml/`
- Provider-agnostic interfaces
- Automatic optimization

## Best Practices

1. **Code Organization**
   - Follow Fresh/Preact conventions
   - Keep islands minimal
   - Use TypeScript strictly

2. **Performance**
   - Minimize client-side JavaScript
   - Optimize island hydration
   - Use streaming where possible

3. **Testing**
   - Unit tests for core logic
   - Integration tests for APIs
   - Component tests for islands

4. **Security**
   - Validate all inputs
   - Use environment variables
   - Follow OWASP guidelines

## Common Tasks

### Adding a New Route
1. Create route file in `routes/`
2. Add page component
3. Add to `fresh.gen.ts`

### Creating an Island
1. Add component in `islands/`
2. Keep it focused and minimal
3. Handle hydration properly

### Integrating ML Models
1. Add provider in `core/ml/providers/`
2. Implement interface
3. Register with model selector

### Adding Agent Capabilities
1. Define types in `core/agents/types/`
2. Implement in `core/agents/services/`
3. Register with agent manager

## Troubleshooting

### Common Issues

1. **Island Hydration**
   - Check browser console
   - Verify client/server code split
   - Check Fresh configuration

2. **API Errors**
   - Verify environment variables
   - Check API provider status
   - Review rate limits

3. **Performance Issues**
   - Monitor island size
   - Check bundle analysis
   - Review render patterns

### Debug Tools

1. **Development**
   ```bash
   # Enable debug logging
   DEBUG=true deno task start
   
   # Analyze bundle
   deno task analyze
   ```

2. **Monitoring**
   - Check `/api/health`
   - Monitor metrics endpoint
   - Review error logs

## Deployment

1. **Production Build**
   ```bash
   deno task build
   ```

2. **Environment**
   - Set production variables
   - Configure SSL
   - Set up monitoring

3. **Scaling**
   - Configure load balancing
   - Set up caching
   - Monitor resources

## Support

- GitHub Issues
- Documentation
- Development Team

Remember to keep this guide updated as the architecture evolves.
