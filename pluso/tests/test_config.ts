import { configure } from "tincan";

configure({
  reporter: "pretty",
  bail: false,
  filterFn: undefined,
  timeout: 10000,
  color: true,
});

export const TEST_CONFIG = {
  baseUrl: "http://localhost:8000",
  wsUrl: "ws://localhost:8000",
  testTimeout: 5000,
  mockResponses: {
    defaultAssistantResponse: "This is a test response from the assistant.",
  },
};
