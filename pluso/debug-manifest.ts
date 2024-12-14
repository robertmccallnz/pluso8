import { _parse, _join, dirname, resolve, relative } from "jsr:@std/path";
import { toFileUrl } from "jsr:@std/path/to_file_url";


// Custom type guard to safely check if something is an Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function extractProjectRoot(filePath: string): string {
  const pathParts = filePath.split('/');
  const pluso8Index = pathParts.indexOf('pluso8');
  const plusoIndex = pathParts.indexOf('pluso');
  
  if (pluso8Index !== -1) {
    return pathParts.slice(0, pluso8Index + 2).join('/');
  }
  
  if (plusoIndex !== -1) {
    return pathParts.slice(0, plusoIndex + 2).join('/');
  }

  throw new Error(`Could not find 'pluso8' or 'pluso' in the file path: ${filePath}`);
}

interface ModulePathResolutionResult {
  projectRoot: string;
  originalBasePath: string;
  normalizedBasePath: string;
  relativePath: string;
  fullPath: string;
  fileUrl: string;
}

export function resolveAdvancedModulePath(
  originalBasePath: string, 
  relativePath: string
): ModulePathResolutionResult {
  const projectRoot = extractProjectRoot(originalBasePath);
  const normalizedBasePath = dirname(originalBasePath);
  
  // Intelligently handle different relative path scenarios
  let fullPath: string;
  if (relativePath.startsWith('/')) {
    // Absolute path within project
    fullPath = resolve(projectRoot, `.${relativePath}`);
  } else if (relativePath.startsWith('../')) {
    // Go up multiple directories
    fullPath = resolve(normalizedBasePath, relativePath);
  } else if (relativePath.startsWith('./')) {
    // Relative to current directory
    fullPath = resolve(normalizedBasePath, relativePath);
  } else {
    // Assume relative to project root
    fullPath = resolve(projectRoot, relativePath);
  }

  const fileUrl = toFileUrl(fullPath).href;

  return {
    projectRoot,
    originalBasePath,
    normalizedBasePath,
    relativePath,
    fullPath,
    fileUrl
  };
}

export async function validateModuleImport(fullPath: string): Promise<{ 
  status: string, 
  path: string, 
  size?: number, 
  isFile?: boolean 
}> {
  try {
    const fileInfo = await Deno.stat(fullPath);
    return {
      status: "Valid",
      path: fullPath,
      size: fileInfo.size,
      isFile: fileInfo.isFile
    };
  } catch (error) {
    if (isError(error)) {
      return {
        status: "Invalid",
        path: fullPath,
        size: 0,
        isFile: false
      };
    }
    throw error;
  }
}

export async function performAdvancedImportDiagnostics(
  originalBasePath: string, 
  possibleRelativePaths: string[]
): Promise<string[]> {
  console.log("🚀 Advanced Te Reo Assistant Import Resolution");
  console.log("🔍 Advanced Import Path Diagnostics");

  const validImportPaths: string[] = [];

  for (const relativePath of possibleRelativePaths) {
    try {
      const moduleResolution = resolveAdvancedModulePath(originalBasePath, relativePath);
      console.log("🔍 Advanced Module Path Resolution:", moduleResolution);

      const validationResult = await validateModuleImport(moduleResolution.fullPath);
      console.log(
        validationResult.status === "Valid" 
          ? "✅ Advanced Module Import Validation:" 
          : "❌ Advanced Module File Access Error:", 
        validationResult
      );

      if (validationResult.status === "Valid") {
        validImportPaths.push(relativePath);
      }
    } catch (error) {
      console.error("❌ Import Resolution Error:", error);
    }
  }

  console.log("\n✅ Valid Import Paths:", validImportPaths);

  console.log("\n📝 Advanced Import Fix Suggestions:");
  validImportPaths.forEach(path => {
    console.log(`import * as kupuScraper from "${path}"`);
  });

  return validImportPaths;
}

// Wrap main execution in an async function to properly use await
async function main() {
  const originalBasePath = Deno.args[0] || 
    "/Users/robertmccall/pluso8/pluso/tools/te-reo-assistant.ts/mod.ts";
  
  const possibleRelativePaths = [
    "./kupu-scraper/mod.ts",
    "kupu-scraper/mod.ts", 
    "../kupu-scraper/mod.ts",
    "../../tools/kupu-scraper/mod.ts",
    "/tools/kupu-scraper/mod.ts",
    "../tools/kupu-scraper/mod.ts"
  ];

  await performAdvancedImportDiagnostics(originalBasePath, possibleRelativePaths);
}

// Only run main if this is the main module
if (import.meta.main) {
  main().catch(console.error);
}