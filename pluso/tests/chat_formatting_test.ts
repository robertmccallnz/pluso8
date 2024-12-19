import { assertEquals } from "../deps.ts";
import { formatChatMessage } from "../utils/chat_formatting.ts";

Deno.test("formatChatMessage - formats user message correctly", () => {
  const message = formatChatMessage("Hello world", "user");
  
  assertEquals(message.text, "Hello world");
  assertEquals(message.type, "user");
  assertEquals(typeof message.id, "string");
  assertEquals(message.id.includes("helloWorld"), true);
});

Deno.test("formatChatMessage - formats assistant message correctly", () => {
  const message = formatChatMessage("How can I help?", "assistant");
  
  assertEquals(message.text, "How can I help?");
  assertEquals(message.type, "assistant");
  assertEquals(typeof message.id, "string");
  assertEquals(message.id.includes("howCanIHelp"), true);
});

Deno.test("formatChatMessage - formats system message correctly", () => {
  const message = formatChatMessage("Connection error", "system");
  
  assertEquals(message.text, "Connection error");
  assertEquals(message.type, "system");
  assertEquals(typeof message.id, "string");
  assertEquals(message.id.includes("connectionError"), true);
});

Deno.test("formatChatMessage - handles empty message", () => {
  const message = formatChatMessage("", "user");
  
  assertEquals(message.text, "");
  assertEquals(message.type, "user");
  assertEquals(typeof message.id, "string");
  assertEquals(message.id.length > 0, true);
});

Deno.test("formatChatMessage - handles special characters", () => {
  const message = formatChatMessage("Hello! @#$%^&*()", "user");
  
  assertEquals(message.text, "Hello! @#$%^&*()");
  assertEquals(message.type, "user");
  assertEquals(typeof message.id, "string");
  assertEquals(message.id.includes("hello"), true);
});
