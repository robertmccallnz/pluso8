const islandsDir = new URL("../islands", import.meta.url);
const decoder = new TextDecoder();
const encoder = new TextEncoder();

async function updateFile(path: string) {
  const content = decoder.decode(await Deno.readFile(path));
  
  // Remove JSX pragma
  const updatedContent = content
    .replace(/\/\*\* @jsx h \*\/\n/, '')
    .replace(/\/\*\* @jsx h \*\/\r\n/, '');
  
  await Deno.writeFile(path, encoder.encode(updatedContent));
  console.log(`Updated ${path}`);
}

async function processDirectory(dirPath: string) {
  for await (const entry of Deno.readDir(dirPath)) {
    const fullPath = `${dirPath}/${entry.name}`;
    if (entry.isFile && entry.name.endsWith('.tsx')) {
      await updateFile(fullPath);
    }
  }
}

await processDirectory(islandsDir.pathname);
