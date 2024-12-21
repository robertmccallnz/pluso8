import { Handlers } from "$fresh/server.ts";
import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { extname } from "https://deno.land/std@0.208.0/path/mod.ts";

const ALLOWED_EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx", ".json", ".yaml", ".yml", 
  ".md", ".txt", ".css", ".html", ".sh", ".env.example"
];

const EXCLUDED_DIRS = [
  "node_modules", ".git", ".vscode", "dist", "build", 
  "coverage", "tmp", "temp", "logs"
];

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const path = url.searchParams.get("path");
      const query = url.searchParams.get("query");
      const recursive = url.searchParams.get("recursive") === "true";

      // Base directory is the project root
      const baseDir = new URL("../../../", import.meta.url).pathname;
      const targetPath = path ? `${baseDir}/${path}` : baseDir;

      // If a specific file is requested
      if (path && !recursive) {
        try {
          const fileContent = await Deno.readTextFile(targetPath);
          return new Response(JSON.stringify({ 
            type: "file",
            content: fileContent 
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: `File not found: ${path}` 
          }), { 
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      // For directory listing or recursive search
      const files = [];
      for await (const entry of walk(targetPath, {
        includeDirs: false,
        skip: EXCLUDED_DIRS.map(dir => new RegExp(`${dir}$`)),
      })) {
        const ext = extname(entry.path);
        if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

        let include = true;
        if (query) {
          try {
            const content = await Deno.readTextFile(entry.path);
            include = content.toLowerCase().includes(query.toLowerCase());
          } catch {
            include = false;
          }
        }

        if (include) {
          const relativePath = entry.path.replace(baseDir, "");
          let fileContent = null;
          try {
            fileContent = await Deno.readTextFile(entry.path);
          } catch {
            // Skip if file can't be read
            continue;
          }

          files.push({
            path: relativePath,
            content: fileContent,
            size: entry.size,
            modified: (await Deno.stat(entry.path)).mtime
          });
        }
      }

      return new Response(JSON.stringify({ 
        type: "directory",
        files 
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
