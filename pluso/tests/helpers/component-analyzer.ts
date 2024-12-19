import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import {
  dirname,
  join,
  parse,
} from "https://deno.land/std@0.208.0/path/mod.ts";

interface ComponentAnalysis {
  hasHooks: boolean;
  hasSignals: boolean;
  hasBrowserCheck: boolean;
  issues: string[];
}

interface AnalysisReport {
  totalFiles: number;
  totalIssues: number;
  componentIssues: Record<string, ComponentAnalysis>;
}

export async function analyzeComponents(directory: string): Promise<AnalysisReport> {
  const report: AnalysisReport = {
    totalFiles: 0,
    totalIssues: 0,
    componentIssues: {},
  };

  for await (const entry of walk(directory, {
    exts: ["tsx", "ts"],
    skip: [/node_modules/, /\.git/],
  })) {
    if (!entry.isFile) continue;

    const content = await Deno.readTextFile(entry.path);
    const analysis = analyzeComponent(content);
    
    if (analysis.issues.length > 0) {
      report.componentIssues[entry.path] = analysis;
      report.totalIssues += analysis.issues.length;
    }
    report.totalFiles++;
  }

  return report;
}

export function analyzeComponent(content: string): ComponentAnalysis {
  const analysis = {
    hasHooks: false,
    hasSignals: false,
    hasBrowserCheck: false,
    issues: [] as string[],
  };

  // Check for hooks
  if (content.includes('useState') || content.includes('useEffect') || 
      content.includes('useCallback') || content.includes('useMemo')) {
    analysis.hasHooks = true;
    // Only add issue if hooks are found in a route component (no IS_BROWSER check)
    if (!content.includes('IS_BROWSER')) {
      analysis.issues.push("Hooks found outside of island components");
    }
  }

  // Check for signals
  if (content.includes('signal(') || content.includes('useSignal(')) {
    analysis.hasSignals = true;
  }

  // Check for browser check
  if (content.includes('IS_BROWSER')) {
    analysis.hasBrowserCheck = true;
  }

  // Check for mixed usage
  if (analysis.hasHooks && analysis.hasSignals) {
    analysis.issues.push("Mixed usage of signals and useState");
  }

  return analysis;
}

export async function fixComponent(content: string) {
  const analysis = analyzeComponent(content);
  let updatedContent = content;

  // Add IS_BROWSER check if missing
  if (!analysis.hasBrowserCheck) {
    if (!updatedContent.includes('$fresh/runtime')) {
      updatedContent = `import { IS_BROWSER } from "$fresh/runtime.ts";\n${updatedContent}`;
    }

    // Find the component function
    const componentMatch = updatedContent.match(/export\s+default\s+function\s+(\w+)[^{]*{/);
    if (componentMatch) {
      const componentStart = updatedContent.indexOf(componentMatch[0]) + componentMatch[0].length;
      updatedContent = 
        updatedContent.slice(0, componentStart) +
        '\n  if (!IS_BROWSER) {\n    return <div>Loading...</div>;\n  }\n\n' +
        updatedContent.slice(componentStart);
    }
  }

  // Convert hooks to signals
  if (analysis.hasHooks) {
    console.log("Input content:", updatedContent);
    
    // Add signal import if needed
    if (!updatedContent.includes('signal from "@preact/signals"')) {
      if (updatedContent.includes('type Signal from "@preact/signals"')) {
        // Replace the existing import to include signal
        updatedContent = updatedContent.replace(
          /import\s*{\s*type Signal\s*}\s*from\s*"@preact\/signals"\s*;/,
          'import { signal, type Signal } from "@preact/signals";'
        );
      } else {
        // Add new import
        updatedContent = `import { signal, type Signal } from "@preact/signals";\n${updatedContent}`;
      }
    }
    
    // Remove hooks import
    updatedContent = updatedContent.replace(/import\s*{[^}]*}\s*from\s*['"]preact\/hooks['"];\s*\n?/, '');

    // Handle both typed and untyped useState declarations
    const typedStatePattern = /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\s*<([^>]+)>\s*\((.*?)\)/g;
    const untypedStatePattern = /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\((.*?)\)/g;

    // First handle typed declarations
    let match;
    while ((match = typedStatePattern.exec(updatedContent)) !== null) {
      const [fullMatch, varName, , type, initialValue] = match;
      const signalName = `${varName}Signal`;
      console.log("Found typed useState:", { fullMatch, varName, type, initialValue });
      
      // Replace the state declaration with proper typing
      updatedContent = updatedContent.replace(
        fullMatch,
        `const ${signalName}: Signal<${type}> = signal(${initialValue})`
      );

      // Update references and handlers
      updatedContent = updateReferencesAndHandlers(updatedContent, varName, signalName, type);
    }

    // Then handle untyped declarations
    while ((match = untypedStatePattern.exec(updatedContent)) !== null) {
      const [fullMatch, varName, , initialValue] = match;
      const signalName = `${varName}Signal`;
      console.log("Found untyped useState:", { fullMatch, varName, initialValue });
      
      // Infer type from initial value
      const type = inferType(initialValue);
      
      // Replace the state declaration
      updatedContent = updatedContent.replace(
        fullMatch,
        `const ${signalName}: Signal<${type}> = signal(${initialValue})`
      );

      // Update references and handlers
      updatedContent = updateReferencesAndHandlers(updatedContent, varName, signalName, type);
    }

    console.log("Final content:", updatedContent);
  }

  return updatedContent;
}

function inferType(value: string): string {
  if (value === '""' || value.startsWith('"') || value.startsWith("'")) {
    return 'string';
  }
  if (value === 'true' || value === 'false') {
    return 'boolean';
  }
  if (!isNaN(Number(value))) {
    return 'number';
  }
  if (value === '[]') {
    return 'any[]';
  }
  if (value === '{}') {
    return 'Record<string, unknown>';
  }
  return 'unknown';
}

function updateReferencesAndHandlers(content: string, varName: string, signalName: string, type: string): string {
  // Replace variable references first (except in event handlers)
  const varPattern = new RegExp(`\\b${varName}\\b(?!Signal)(?!\\s*[+]\\s*1)`, 'g');
  content = content.replace(varPattern, `${signalName}.value`);

  // Handle onClick event handlers with increment pattern
  const clickPattern = new RegExp(`onClick={\\s*\\(\\)\\s*=>\\s*set${varName[0].toUpperCase()}${varName.slice(1)}\\s*\\(\\s*${varName}\\s*\\+\\s*1\\s*\\)}`, 'g');
  content = content.replace(
    clickPattern,
    `onClick={() => ${signalName}.value = ${signalName}.value + 1}`
  );

  // Handle onInput event handlers with proper typing
  const inputPattern = new RegExp(`onInput={\\s*\\([^}]*\\)\\s*=>\\s*set${varName[0].toUpperCase()}${varName.slice(1)}\\s*\\([^}]*\\)}`, 'g');
  content = content.replace(
    inputPattern,
    `onInput={(e: Event) => ${signalName}.value = (e.target as HTMLInputElement).value}`
  );

  // Clean up any remaining setter calls
  content = content.replace(
    new RegExp(`\\bset${varName[0].toUpperCase()}${varName.slice(1)}\\s*\\((.*?)\\)`, 'g'),
    (match, expr) => {
      // Replace any references to the original variable in the expression
      expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), `${signalName}.value`);
      return `${signalName}.value = ${expr}`;
    }
  );

  return content;
}

export async function validateCriticalComponents(componentPaths: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  for (const path of componentPaths) {
    try {
      const content = await Deno.readTextFile(path);
      const analysis = analyzeComponent(content);
      results[path] = analysis.issues.length === 0;
    } catch (error) {
      console.error(`Error validating ${path}:`, error);
      results[path] = false;
    }
  }

  return results;
}
