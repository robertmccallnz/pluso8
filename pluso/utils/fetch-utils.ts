// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

// Fetch with exponential backoff
export async function fetchWithBackoff(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 5000,
  } = retryOptions;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited, retry with backoff
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After") || "1", 10);
        const delay = Math.min(
          Math.max(baseDelay * Math.pow(2, attempt), retryAfter * 1000),
          maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw lastError || new Error("Failed to fetch after retries");
}

// Cached fetch with debounce
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

export const fetchWithCache = debounce(async function(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetchWithBackoff(url, options);
  const data = await response.json();
  
  cache.set(url, { data, timestamp: now });
  return data;
}, 200); // Debounce for 200ms
