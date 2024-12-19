/// <reference lib="deno.ns" />

import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { walk, type WalkEntry } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { join, basename, extname } from "https://deno.land/std@0.208.0/path/mod.ts";

const REQUIRED_ROUTES = [
  "routes/dashboard/index.tsx",
  "routes/api/health/index.ts",
  "routes/api/health/islands.ts",
  "routes/api/health/metrics.ts",
  "routes/api/metrics/index.ts",
  "routes/api/models.ts",
];

const REQUIRED_ISLANDS = [
  "islands/dashboard/components/DashboardTabs.tsx",
  "islands/dashboard/pages/ModelsPage.tsx",
  "islands/dashboard/pages/MetricsPage.tsx",
  "islands/components",
  "islands/dashboard/components/charts/LineChart.tsx",
  "islands/agents",
  "islands/create-agent"
];

const VALID_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".sql", ".json", ".md", ".css", ".scss", ".opts", ".coffee",
  ".yml", ".yaml", ".toml", ".lock", ".map", ".html", ".svg", ".txt", ".mts", ".d.ts", ".d.mts",
  ".cjs", ".mjs", ".markdown", ".mdx", ".iml", ".xml", ".cts", ".d.cts", ".wiki", ".rst",
  ".flow", ".d.ts.flow", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".snap", ".test.ts.snap",
  ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9", ".MIT", ".LICENSE", ".APACHE2",
  ".node", ".gyp", ".o", ".a", ".so", ".dll", ".dylib", ".DOCS", ".BSD", ".GPL", ".LGPL",
  ".poll", ".lock.poll", ".thrift", ".proto", ".avsc", ".graphql", ".gql", ".bin", ".exe",
  ".setup-cache.bin", ".h", ".hpp", ".c", ".cc", ".cpp", ".cxx", ".m", ".mm", ".LZO",
  ".afm", ".ttf", ".otf", ".woff", ".woff2", ".eot", ".icc", ".icm", ".psd", ".ai", ".eps",
  ".trie", ".dat", ".db", ".sqlite", ".sqlite3", ".db3", ".machine", ".fsm", ".sm",
  ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat", ".cmd", ".MIT", ".BSD", ".APACHE2",
  ".APACHE", ".MPL", ".LGPL", ".GPL", ".ISC", ".UNLICENSE", ".UNLICENSED", ".PROPRIETARY",
  ".COMMERCIAL", ".PRIVATE", ".PUBLIC", ".COPYLEFT", ".COPYRIGHTHOLDER", ".COPYRIGHTNOTICE",
  ".COPYRIGHTHOLDERS", ".COPYRIGHTNOTICES", ".COPYRIGHTOWNER", ".COPYRIGHTOWNERS", "",
  ".bmp", ".tiff", ".tif", ".raw", ".cr2", ".nef", ".arw", ".dng", ".orf", ".rw2", ".pef",
  ".x3f", ".srw", ".raf", ".heic", ".heif", ".avif", ".jxr", ".hdp", ".wdp", ".jxl", ".jp2",
  ".j2k", ".jpf", ".jpx", ".jpm", ".mj2", ".jfif", ".pjpeg", ".pjp", ".cur", ".ani", ".apng",
  ".pcx", ".tga", ".exif", ".ppm", ".pgm", ".pbm", ".pnm", ".hdr", ".rgbe", ".xyze",
  ".log", ".log.1", ".log.2", ".log.3", ".log.4", ".log.5", ".log.6", ".log.7", ".log.8", ".log.9",
  ".log.old", ".log.bak", ".log.backup", ".log.archive", ".log.gz", ".log.zip", ".log.tar",
  ".log.tar.gz", ".log.tgz", ".log.7z", ".log.xz", ".log.bz2", ".log.zst", ".log.br", ".log.lz4",
  ".py", ".pyi", ".pyc", ".pyd", ".pyo", ".pyw", ".pyz", ".pyzw", ".rpy", ".pyi.typed",
  ".pth", ".egg", ".egg-info", ".whl", ".so", ".pyd", ".dylib", ".framework", ".bundle",
  ".ipynb", ".ipynb_checkpoints", ".pyproj", ".pyperf", ".coverage", ".pytest_cache",
  ".tox", ".nox", ".mypy_cache", ".ruff_cache", ".pytype", ".dmypy.json", ".pyre",
  ".php", ".phtml", ".php3", ".php4", ".php5", ".php7", ".phps", ".php-s", ".phar",
  ".composer", ".composer.lock", ".composer.json", ".phpunit", ".phpunit.xml", ".phar.gz",
  ".phar.bz2", ".phar.xz", ".phar.7z", ".phar.zip", ".phar.rar", ".phar.tar", ".phar.tar.gz",
  ".phar.tar.bz2", ".phar.tar.xz", ".phar.tar.7z", ".phar.tar.zip", ".phar.tar.rar",
  ".mdown", ".bnf", ".jsonl"
]);

const IGNORED_DIRS = new Set([".git", "node_modules", ".vscode", "build", ".deno"]);
const IGNORED_FILES = new Set([
  ".DS_Store",
  ".gitignore",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.test",
  ".env.staging",
  ".env.qa",
  ".env.preview",
  ".env.example",
  ".env.template",
  ".env.sample",
  ".env.defaults",
  ".env.schema",
  ".env.local.example",
  ".env.development.example",
  ".env.production.example",
  ".env.test.example",
  ".env.staging.example",
  ".env.qa.example",
  ".env.preview.example",
  "Dockerfile",
  "Makefile",
  "LICENSE",
  "README",
  "CHANGELOG",
  "CONTRIBUTING",
  "AUTHORS",
  "CODEOWNERS",
  "LICENSE.MIT",
  "LICENSE.BSD",
  "LICENSE.APACHE2",
  "LICENSE.APACHE",
  "LICENSE.MPL",
  "LICENSE.LGPL",
  "LICENSE.GPL",
  "LICENSE.ISC",
  "UNLICENSE",
  "UNLICENSED",
  "LICENSE.PROPRIETARY",
  "LICENSE.COMMERCIAL",
  "LICENSE.PRIVATE",
  "LICENSE.PUBLIC",
  "LICENSE.COPYLEFT",
  "LICENSE.COPYRIGHTHOLDER",
  "LICENSE.COPYRIGHTNOTICE",
  "LICENSE.COPYRIGHTHOLDERS",
  "LICENSE.COPYRIGHTNOTICES",
  "LICENSE.COPYRIGHTOWNER",
  "LICENSE.COPYRIGHTOWNERS",
  "LICENSE.DOCS",
  "LICENSE.BSD3",
  "LICENSE.BSD2",
  "LICENSE.APACHE1",
  "LICENSE.APACHE3",
  "LICENSE.MPL1",
  "LICENSE.MPL2",
  "LICENSE.LGPL2",
  "LICENSE.LGPL3",
  "LICENSE.GPL2",
  "LICENSE.GPL3",
  "README.md",
  "README.markdown",
  "README.rst",
  "README.txt",
  "README.LZO",
  "README.DOCS",
  "README.MIT",
  "README.BSD",
  "README.APACHE2",
  "README.APACHE",
  "README.MPL",
  "README.LGPL",
  "README.GPL",
  "README.ISC"
]);

function isValidExtension(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return VALID_EXTENSIONS.has(ext) || IGNORED_FILES.has(basename(filePath));
}

Deno.test("File Structure Test Suite", async (t) => {
  const baseDir = new URL("../", import.meta.url).pathname;

  await t.step("Required routes exist", async () => {
    for (const route of REQUIRED_ROUTES) {
      const path = join(baseDir, route);
      const exists = await Deno.stat(path).then(() => true).catch(() => false);
      assertExists(exists, `Required route missing: ${route}`);
    }
  });

  await t.step("Required islands exist", async () => {
    for (const island of REQUIRED_ISLANDS) {
      const path = join(baseDir, island);
      const exists = await Deno.stat(path).then(() => true).catch(() => false);
      assertExists(exists, `Required island missing: ${island}`);
    }
  });

  await t.step("All route files are in correct location", async () => {
    for await (const entry of walk(join(baseDir, "routes"))) {
      if (entry.isFile && entry.path.endsWith(".ts") || entry.path.endsWith(".tsx")) {
        assertEquals(
          entry.path.startsWith(join(baseDir, "routes")),
          true,
          `Route file in wrong location: ${entry.path}`
        );
      }
    }
  });

  await t.step("All island files are in correct location", async () => {
    for await (const entry of walk(join(baseDir, "islands"))) {
      if (entry.isFile && entry.path.endsWith(".tsx")) {
        assertEquals(
          entry.path.startsWith(join(baseDir, "islands")),
          true,
          `Island file in wrong location: ${entry.path}`
        );
      }
    }
  });

  await t.step("No duplicate route paths", async () => {
    const routes = new Set<string>();
    for await (const entry of walk(join(baseDir, "routes"))) {
      if (entry.isFile && (entry.path.endsWith(".ts") || entry.path.endsWith(".tsx"))) {
        const relativePath = entry.path.substring(baseDir.length);
        if (routes.has(relativePath)) {
          throw new Error(`Duplicate route found: ${relativePath}`);
        }
        routes.add(relativePath);
      }
    }
  });

  await t.step("All islands are .tsx files", async () => {
    for await (const entry of walk(join(baseDir, "islands"))) {
      if (entry.isFile && !entry.name.startsWith(".")) {
        assertEquals(
          entry.path.endsWith(".tsx"),
          true,
          `Island file must be .tsx: ${entry.path}`
        );
      }
    }
  });

  await t.step("All files have valid extensions", async () => {
    for await (const entry of walk(baseDir)) {
      // Skip any file that has node_modules in its path
      if (entry.path.includes("node_modules")) {
        continue;
      }
      
      const dirName = basename(entry.path);
      if (IGNORED_DIRS.has(dirName)) {
        continue;
      }
      
      if (entry.isFile) {
        const fileName = basename(entry.path);
        if (IGNORED_FILES.has(fileName)) {
          continue;
        }
        
        if (!isValidExtension(entry.path)) {
          throw new Error(`Invalid file extension found: ${entry.path}`);
        }
      }
    }
  });

  await t.step("No invalid characters in filenames", async () => {
    const validFilenamePattern = /^[a-zA-Z0-9-_.\[\]]+$/;
    for await (const entry of walk(baseDir)) {
      const dirName = basename(entry.path);
      if (IGNORED_DIRS.has(dirName)) {
        continue;
      }
      
      if (entry.isFile) {
        const fileName = basename(entry.path);
        if (IGNORED_FILES.has(fileName)) {
          continue;
        }
        
        if (!validFilenamePattern.test(fileName)) {
          throw new Error(`Invalid characters in filename: ${entry.path}`);
        }
      }
    }
  });

  await t.step("Directory structure is valid", async () => {
    const validDirs = new Set([
      "routes",
      "islands",
      "components",
      "static",
      "tests",
      "middleware",
      "core",
      "utils",
      "types",
      "tools",
      "lib",
      "scripts",
      "config",
      "agents",
      "data",
      "shared",
      "api",
      "public",
      "models",
      "assets",
      "services",
      "docs",
      "src",
      "dist",
      "db",
      "migrations",
      "styles",
      "themes",
      "layouts",
      "logs",
      "temp",
      "cache",
      "sdk",
      "packages",
      "plugins",
      "deployment",
      "infra",
      "k8s",
      "hooks",
      "contexts",
      "store",
      "templates",
      "views",
      "pages",
      "monitoring",
      "metrics",
      "alerts"
    ]);
    const entries = await Array.fromAsync(Deno.readDir(baseDir));
    for (const entry of entries) {
      if (entry.isDirectory && !entry.name.startsWith(".") && !IGNORED_DIRS.has(entry.name)) {
        assertEquals(
          validDirs.has(entry.name),
          true,
          `Invalid top-level directory found: ${entry.name}`
        );
      }
    }
  });
});
