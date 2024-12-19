// Script to check for similar files
import { walk } from "https://deno.land/std/fs/mod.ts";
import { relative } from "https://deno.land/std/path/mod.ts";

const BASE_DIR = "/Users/robertmccall/pluso8/pluso";

interface FileInfo {
  path: string;
  content: string;
  size: number;
}

async function findSimilarFiles() {
  const files = new Map<string, FileInfo>();
  const similarFiles = new Map<string, string[]>();

  // Collect all TypeScript/TSX files
  for await (const entry of walk(BASE_DIR, {
    exts: ["ts", "tsx"],
    skip: [/node_modules/, /\.git/],
  })) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      const relativePath = relative(BASE_DIR, entry.path);
      files.set(relativePath, {
        path: entry.path,
        content,
        size: content.length,
      });
    }
  }

  // Compare files
  const fileEntries = Array.from(files.entries());
  for (let i = 0; i < fileEntries.length; i++) {
    const [path1, file1] = fileEntries[i];
    
    // Skip very small files
    if (file1.size < 100) continue;

    for (let j = i + 1; j < fileEntries.length; j++) {
      const [path2, file2] = fileEntries[j];
      
      // If file sizes are within 10% of each other
      const sizeDiff = Math.abs(file1.size - file2.size) / Math.max(file1.size, file2.size);
      if (sizeDiff < 0.1) {
        // Calculate similarity (simple for now)
        const similarity = calculateSimilarity(file1.content, file2.content);
        if (similarity > 0.7) {  // 70% similar
          if (!similarFiles.has(path1)) {
            similarFiles.set(path1, []);
          }
          similarFiles.get(path1)!.push(path2);
        }
      }
    }
  }

  return similarFiles;
}

function calculateSimilarity(str1: string, str2: string): number {
  const lines1 = str1.split("\n");
  const lines2 = str2.split("\n");
  
  let matches = 0;
  const totalLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < Math.min(lines1.length, lines2.length); i++) {
    if (lines1[i].trim() === lines2[i].trim()) {
      matches++;
    }
  }
  
  return matches / totalLines;
}

// Run the check
console.log("Checking for similar files...");
findSimilarFiles()
  .then(similarFiles => {
    if (similarFiles.size === 0) {
      console.log("No similar files found.");
      return;
    }

    console.log("\nPotentially similar files:");
    for (const [file, similars] of similarFiles) {
      console.log(`\n${file} is similar to:`);
      similars.forEach(similar => console.log(`  - ${similar}`));
    }
  })
  .catch(console.error);
