core/workers/task-worker.ts
interface TaskMessage {
  taskFn: string;
  data: any;
}

const taskRegistry = new Map<string, (data: any) => Promise<any>>();

// Register available tasks
taskRegistry.set('processData', async (data: any) => {
  // Example data processing task
  return data.map((item: number) => item * 2);
});

self.addEventListener('message', async (e: MessageEvent<TaskMessage>) => {
  try {
    const { taskFn, data } = e.data;
    const task = taskRegistry.get(taskFn);
    
    if (!task) {
      throw new Error(`Unknown task: ${taskFn}`);
    }

    const result = await task(data);
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
});