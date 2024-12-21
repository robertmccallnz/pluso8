import { signal } from "@preact/signals";
import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect } from "preact/hooks";

interface FileChange {
  path: string;
  content: string;
  description: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  files?: Array<{
    path: string;
    content: string;
    size: number;
    modified: string;
  }>;
  changes?: FileChange[];
}

// Global signals for state management
export const messages = signal<Message[]>([]);
export const inputValue = signal("");
export const isLoading = signal(false);
export const isOpen = signal(true);
export const isFixing = signal(false);

async function searchCodebase(query: string): Promise<Message["files"]> {
  try {
    const response = await fetch(`/api/maia/codebase?query=${encodeURIComponent(query)}&recursive=true`);
    if (!response.ok) {
      throw new Error(`Failed to search codebase: ${response.statusText}`);
    }
    const data = await response.json();
    return data.files;
  } catch (error) {
    console.error("Error searching codebase:", error);
    return [];
  }
}

async function getFileContent(path: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/maia/codebase?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error(`Failed to get file content: ${response.statusText}`);
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error getting file content:", error);
    return null;
  }
}

async function fixCodebase(query: string, files: Message["files"]): Promise<FileChange[]> {
  try {
    const response = await fetch("/api/maia/meta-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        context: {
          files: files?.map(f => ({
            path: f.path,
            content: f.content,
          })),
        },
        strategy: "iterative-refinement",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fix codebase: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Refresh the page to show the changes
    if (data.success && data.changes.length > 0) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    return data.changes;
  } catch (error) {
    console.error("Error fixing codebase:", error);
    return [];
  }
}

export default function MaiaWidget() {
  if (!IS_BROWSER) {
    return null;
  }

  useEffect(() => {
    if (messages.value.length === 0) {
      const greetingMessage: Message = {
        role: "assistant",
        content: "Hi, I'm Maia! I can help you understand and fix your codebase. I can:\n- Search through your code\n- Explain how things work\n- Fix issues using meta prompting\n- Make improvements to your code\n\nJust let me know what you need!",
        timestamp: Date.now(),
      };
      messages.value = [greetingMessage];
    }
  }, []);

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!inputValue.value.trim() || isLoading.value) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue.value,
      timestamp: Date.now(),
    };

    messages.value = [...messages.value, userMessage];
    inputValue.value = "";
    isLoading.value = true;

    try {
      // Search codebase for relevant files
      const files = await searchCodebase(userMessage.content);
      
      // Check if the user wants to fix something
      const isFixRequest = userMessage.content.toLowerCase().includes("fix") || 
                          userMessage.content.toLowerCase().includes("change") ||
                          userMessage.content.toLowerCase().includes("update") ||
                          userMessage.content.toLowerCase().includes("modify");

      let changes: FileChange[] = [];
      if (isFixRequest && files) {
        isFixing.value = true;
        changes = await fixCodebase(userMessage.content, files);
      }

      // Add an assistant message with the search results and changes
      const assistantMessage: Message = {
        role: "assistant",
        content: changes.length > 0 
          ? "I've found and fixed some issues in your codebase. Here are the changes I made:"
          : "I found some relevant files in the codebase. Let me help you understand them.",
        timestamp: Date.now(),
        files,
        changes,
      };

      messages.value = [...messages.value, assistantMessage];
    } catch (error) {
      console.error("Error processing message:", error);
      messages.value = [...messages.value, {
        role: "assistant",
        content: "I apologize, but I encountered an error while working with the codebase. Please try again.",
        timestamp: Date.now(),
      }];
    } finally {
      isLoading.value = false;
      isFixing.value = false;
    }
  };

  return (
    <div class="fixed top-20 right-4 z-50">
      {isOpen.value ? (
        <div class="w-96 bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <h2 class="text-lg font-semibold">Maia</h2>
                <p class="text-sm text-gray-500">Code Assistant</p>
              </div>
            </div>
            <button
              onClick={() => isOpen.value = false}
              class="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <div class="h-[calc(100vh-12rem)] overflow-y-auto p-4 space-y-4">
            {messages.value.map((message, index) => (
              <div
                key={index}
                class={`flex flex-col ${
                  message.role === "assistant" ? "items-start" : "items-end"
                }`}
              >
                <div
                  class={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "assistant"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p class="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.changes && message.changes.length > 0 && (
                    <div class="mt-2 space-y-2">
                      <p class="font-semibold">Changes made:</p>
                      {message.changes.map((change, changeIndex) => (
                        <div key={changeIndex} class="text-sm">
                          <p class="font-mono">{change.path}</p>
                          <p class="text-gray-600">{change.description}</p>
                          <pre class="mt-1 p-2 bg-gray-800 text-white rounded overflow-x-auto">
                            <code>{change.content}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.files && message.files.length > 0 && (
                    <div class="mt-2 space-y-2">
                      <p class="font-semibold">Related files:</p>
                      {message.files.map((file, fileIndex) => (
                        <div key={fileIndex} class="text-sm">
                          <p class="font-mono">{file.path}</p>
                          <pre class="mt-1 p-2 bg-gray-800 text-white rounded overflow-x-auto">
                            <code>{file.content}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span class="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} class="p-4 border-t border-gray-200">
            <div class="flex space-x-2">
              <input
                type="text"
                value={inputValue.value}
                onInput={(e) => inputValue.value = e.currentTarget.value}
                placeholder={isFixing.value ? "Fixing codebase..." : "Ask about or fix your code..."}
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading.value || isFixing.value}
              />
              <button
                type="submit"
                disabled={isLoading.value || isFixing.value}
                class={`px-4 py-2 rounded-lg ${
                  isLoading.value || isFixing.value
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isLoading.value ? "..." : isFixing.value ? "Fixing" : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => isOpen.value = true}
          class="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          <div class="w-6 h-6 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span>Chat with Maia</span>
        </button>
      )}
    </div>
  );
}
