// routes/api/agents/management.ts

// Add missing handler functions
async function handleGetAgentState(agentId: string): Promise<Response> {
  const worker = workerPool.findWorker(agentId);
  if (!worker) {
    return new Response(JSON.stringify({ error: "Agent not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  const state = await worker.getState();
  return new Response(JSON.stringify(state), {
    headers: { "Content-Type": "application/json" }
  });
}

async function handleListAgents(): Promise<Response> {
  const activeWorkers = workerPool.getActiveWorkerCount();
  return new Response(JSON.stringify({
    activeWorkers,
    hasCapacity: workerPool.hasCapacity()
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

async function handleCreateAgent(req: Request): Promise<Response> {
  try {
    const params: AgentCreateParams = await req.json();
    const isolate = new AgentIsolate(params.config);
    const worker = await workerPool.allocateWorker(isolate);

    return new Response(JSON.stringify({
      agentId: isolate.id,
      status: "created"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

async function handleUpdateAgent(req: Request, agentId: string): Promise<Response> {
  try {
    const config = await req.json();
    const worker = workerPool.findWorker(agentId);
    
    if (!worker) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    await worker.updateConfig(config);
    return new Response(JSON.stringify({ status: "updated" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

async function handleDeleteAgent(agentId: string): Promise<Response> {
  try {
    await workerPool.freeWorker(agentId);
    return new Response(JSON.stringify({ status: "deleted" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

function methodNotAllowed(): Response {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}
