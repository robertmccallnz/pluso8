import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

/**
 * Generates a secure API key with prefix for an agent
 * Returns both the full key and its prefix for display
 */
export function generateApiKey(): { key: string; prefix: string } {
  const timestamp = Date.now().toString();
  const random = crypto.getRandomValues(new Uint8Array(16));
  const combined = new TextEncoder().encode(timestamp + Array.from(random).join(''));
  const encoded = base64Encode(combined)
    .replace(/\+/g, '') // Remove +
    .replace(/\//g, '') // Remove /
    .replace(/=/g, ''); // Remove =
  
  const key = `pluso_live_${encoded}`;
  const prefix = key.split('_')[2].substring(0, 8); // Get first 8 chars after pluso_live_
  
  return { key, prefix };
}

/**
 * Validates an API key format
 */
export function isValidApiKey(key: string): boolean {
  return /^pluso_live_[A-Za-z0-9]{32,}$/.test(key);
}

/**
 * Extracts the prefix from an API key
 */
export function getKeyPrefix(apiKey: string): string {
  if (!isValidApiKey(apiKey)) {
    throw new Error('Invalid API key format');
  }
  return apiKey.split('_')[2].substring(0, 8);
}

/**
 * Hashes an API key for storage
 */
export async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates API key permissions
 */
export function validateKeyPermissions(
  requiredPermissions: string[],
  keyPermissions: Record<string, boolean>
): boolean {
  return requiredPermissions.every(permission => keyPermissions[permission] === true);
}

/**
 * Checks if an API key has expired
 */
export function isKeyExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}
