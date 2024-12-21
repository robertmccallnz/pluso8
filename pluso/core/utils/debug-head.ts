import { asset } from "$fresh/runtime.ts";

export function debugAssetLoading(assetPath: string): void {
  try {
    const resolvedPath = asset(assetPath);
    console.log(`[Debug] Asset resolved: ${assetPath} -> ${resolvedPath}`);
    
    // Simulate asset loading
    fetch(resolvedPath)
      .then(response => {
        if (!response.ok) {
          console.error(`[Debug] Asset failed to load: ${assetPath}`, {
            status: response.status,
            statusText: response.statusText
          });
        } else {
          console.log(`[Debug] Asset loaded successfully: ${assetPath}`);
        }
      })
      .catch(error => {
        console.error(`[Debug] Asset loading error: ${assetPath}`, error);
      });
  } catch (error) {
    console.error(`[Debug] Asset resolution error: ${assetPath}`, error);
  }
}

export function validateHeadTags(): void {
  console.log('[Debug] Validating Head tags...');
  
  const headElement = document.head;
  if (!headElement) {
    console.error('[Debug] Head element not found!');
    return;
  }

  // Check for duplicate meta tags
  const metaTags = headElement.getElementsByTagName('meta');
  const metaProperties = new Map();
  
  for (const meta of metaTags) {
    const property = meta.getAttribute('property') || meta.getAttribute('name');
    if (property) {
      if (metaProperties.has(property)) {
        console.error(`[Debug] Duplicate meta tag found: ${property}`);
      }
      metaProperties.set(property, meta);
    }
  }

  // Check critical meta tags
  const criticalTags = ['viewport', 'charset'];
  criticalTags.forEach(tag => {
    if (!metaProperties.has(tag)) {
      console.error(`[Debug] Missing critical meta tag: ${tag}`);
    }
  });

  // Log all asset links
  const links = headElement.getElementsByTagName('link');
  for (const link of links) {
    const href = link.getAttribute('href');
    const rel = link.getAttribute('rel');
    console.log(`[Debug] Found link: ${rel} -> ${href}`);
  }
}
