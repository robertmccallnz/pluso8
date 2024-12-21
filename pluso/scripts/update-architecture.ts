import { walk } from "https://deno.land/std/fs/walk.ts";
import { dirname, join } from "https://deno.land/std/path/mod.ts";

interface FileStructure {
  name: string;
  type: "file" | "directory";
  children?: FileStructure[];
}

interface ComponentInfo {
  name: string;
  path: string;
  exports: string[];
  imports: string[];
}

interface ArchitectureOutput {
  timestamp: string;
  structure: FileStructure;
  components: ComponentInfo[];
  schema: string;
}

async function generateDirectoryStructure(rootPath: string): Promise<FileStructure> {
  const structure: FileStructure = {
    name: rootPath.split("/").pop() || "",
    type: "directory",
    children: [],
  };

  for await (const entry of walk(rootPath, {
    maxDepth: 4,
    includeDirs: true,
    skip: [/node_modules/, /\.git/],
  })) {
    const relativePath = entry.path.replace(rootPath, "");
    const parts = relativePath.split("/").filter(Boolean);
    let current = structure;

    for (const part of parts) {
      if (!current.children) {
        current.children = [];
      }

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          type: entry.isDirectory ? "directory" : "file",
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  return structure;
}

async function analyzeComponents(rootPath: string): Promise<ComponentInfo[]> {
  const components: ComponentInfo[] = [];

  for await (const entry of walk(rootPath, {
    exts: [".tsx", ".ts"],
    skip: [/node_modules/, /\.git/],
  })) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      const exports = content.match(/export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g) || [];
      const imports = content.match(/import\s+.*?from\s+['"].*?['"]/g) || [];

      components.push({
        name: entry.name,
        path: entry.path.replace(rootPath, ""),
        exports: exports.map((exp) => exp.split(/\s+/).pop() || ""),
        imports: imports.map((imp) => imp.match(/from\s+['"](.+?)['"]/)?.[1] || ""),
      });
    }
  }

  return components;
}

async function generateArchitectureData(rootPath: string): Promise<ArchitectureOutput> {
  const structure = await generateDirectoryStructure(rootPath);
  const components = await analyzeComponents(rootPath);
  const schemaPath = join(rootPath, "db", "schema.sql");
  const schema = await Deno.readTextFile(schemaPath);

  return {
    timestamp: new Date().toISOString(),
    structure,
    components,
    schema,
  };
}

function formatForMarkdown(data: ArchitectureOutput): string {
  return `# Pluso Platform Architecture
Last Updated: ${new Date(data.timestamp).toLocaleString()}

## Directory Structure
\`\`\`
${JSON.stringify(data.structure, null, 2)}
\`\`\`

## Components
${data.components.map((comp) => `
### ${comp.name}
- Path: ${comp.path}
- Exports: ${comp.exports.join(", ")}
- Dependencies: ${comp.imports.join(", ")}
`).join("\n")}

## Database Schema
\`\`\`sql
${data.schema}
\`\`\``;
}

function formatForChat(data: ArchitectureOutput): string {
  return `**Current Pluso Architecture Overview**
Last Updated: ${new Date(data.timestamp).toLocaleString()}

**Key Directories:**
${formatDirectoryTree(data.structure, 0)}

**Active Components:**
${data.components.slice(0, 5).map(comp => 
  `- \`${comp.name}\`: ${comp.exports.length} exports, ${comp.imports.length} dependencies`
).join("\n")}
${data.components.length > 5 ? `...and ${data.components.length - 5} more components` : ""}

**Database Tables:**
${data.schema.match(/CREATE TABLE \w+/g)?.map(table => 
  `- ${table.replace("CREATE TABLE ", "")}`
).join("\n") || "No tables found"}

For full details, see ARCHITECTURE.md`;
}

function formatDirectoryTree(node: FileStructure, level: number): string {
  const indent = "  ".repeat(level);
  const prefix = level === 0 ? "" : "- ";
  let result = `${indent}${prefix}${node.name}${node.type === "directory" ? "/" : ""}\n`;
  
  if (node.children && level < 3) {
    result += node.children
      .filter(child => !child.name.startsWith("."))
      .map(child => formatDirectoryTree(child, level + 1))
      .join("");
  }
  
  return result;
}

export async function updateArchitectureDoc(format: "markdown" | "chat" = "markdown"): Promise<string> {
  try {
    const rootPath = Deno.cwd();
    const data = await generateArchitectureData(rootPath);
    const content = format === "markdown" ? formatForMarkdown(data) : formatForChat(data);
    
    if (format === "markdown") {
      await Deno.writeTextFile("ARCHITECTURE.md", content);
      console.log("Architecture document updated successfully");
    }
    
    return content;
  } catch (error) {
    console.error("Error updating architecture document:", error);
    throw error;
  }
}

if (import.meta.main) {
  const format = Deno.args[0] as "markdown" | "chat" || "markdown";
  await updateArchitectureDoc(format);
}
