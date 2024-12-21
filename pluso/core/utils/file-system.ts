import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

export class FileSystem {
  async readFile(path: string): Promise<string> {
    try {
      return await Deno.readTextFile(path);
    } catch (error) {
      console.error(`Error reading file ${path}:`, error);
      throw error;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    try {
      await Deno.writeTextFile(path, content);
    } catch (error) {
      console.error(`Error writing file ${path}:`, error);
      throw error;
    }
  }

  async findFiles(root: string, pattern: RegExp): Promise<string[]> {
    const files: string[] = [];
    try {
      for await (const entry of walk(root)) {
        if (entry.isFile && pattern.test(entry.path)) {
          files.push(entry.path);
        }
      }
    } catch (error) {
      console.error(`Error finding files in ${root}:`, error);
      throw error;
    }
    return files;
  }

  async getRelatedFiles(path: string): Promise<string[]> {
    const dir = path.substring(0, path.lastIndexOf("/"));
    const files: string[] = [];
    try {
      for await (const entry of walk(dir, { maxDepth: 1 })) {
        if (entry.isFile && entry.path !== path) {
          files.push(entry.path);
        }
      }
    } catch (error) {
      console.error(`Error getting related files for ${path}:`, error);
      throw error;
    }
    return files;
  }

  async getFileInfo(path: string): Promise<Deno.FileInfo> {
    try {
      return await Deno.stat(path);
    } catch (error) {
      console.error(`Error getting file info for ${path}:`, error);
      throw error;
    }
  }

  async createDirectory(path: string): Promise<void> {
    try {
      await Deno.mkdir(path, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${path}:`, error);
      throw error;
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch {
      return false;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await Deno.remove(path);
    } catch (error) {
      console.error(`Error deleting file ${path}:`, error);
      throw error;
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    try {
      await Deno.copyFile(source, destination);
    } catch (error) {
      console.error(`Error copying file from ${source} to ${destination}:`, error);
      throw error;
    }
  }

  async moveFile(source: string, destination: string): Promise<void> {
    try {
      await Deno.rename(source, destination);
    } catch (error) {
      console.error(`Error moving file from ${source} to ${destination}:`, error);
      throw error;
    }
  }
}
