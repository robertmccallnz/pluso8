chmod +x cleanup-focused.sh
#!/bin/bash

echo "Starting focused cleanup..."

# Step 1: Consolidate types
echo "Consolidating types..."
mkdir -p core/types
mv types/*.ts core/types/
mv lib/types/*.ts core/types/

# Step 2: Consolidate utils
echo "Consolidating utils..."
mkdir -p core/utils
mv utils/*.ts core/utils/
mv lib/utils/*.ts core/utils/
mv lib/clientTools.ts core/utils/

# Step 3: Consolidate configurations
echo "Consolidating configs..."
mkdir -p core/config
mv config/*.ts core/config/
mv lib/config/*.ts core/config/
mv tailwind.config.* core/config/
mv twind.config.ts core/config/

# Step 4: Consolidate routes
echo "Organizing routes..."
mkdir -p routes/core
mkdir -p routes/api
mv routes/_*.tsx routes/core/
mv routes/api/* routes/api/

# Step 5: Consolidate tests
echo "Organizing tests..."
mkdir -p tests/core
mkdir -p tests/e2e
mkdir -p tests/integration
mv tests/*.test.ts tests/core/
mv tests/integration/* tests/integration/
mv tests/unit/* tests/integration/

# Step 6: Clean up empty directories
echo "Cleaning empty directories..."
find . -type d -empty -delete

# Step 7: Create new import map
echo "Creating new import map..."
cat > deno.json << EOL
{
  "imports": {
    "@/core/": "./core/",
    "@/routes/": "./routes/",
    "@/ui/": "./ui/",
    "@/types/": "./core/types/",
    "@/utils/": "./core/utils/",
    "@/config/": "./core/config/"
  },
  "tasks": {
    "start": "deno run -A --watch=static/,routes/ dev.ts",
    "build": "deno run -A build.ts",
    "preview": "deno run -A main.ts",
    "test": "deno test -A tests/core/"
  }
}
EOL

# Step 8: Create folder structure documentation
echo "Creating folder structure documentation..."
cat > ARCHITECTURE.md << EOL
# Project Architecture

/core
  /types     - Type definitions
  /utils     - Utility functions
  /config    - Configuration files
  /agents    - Agent system
  /services  - Core services

/routes
  /core      - Core route components
  /api       - API endpoints
  
/ui
  /components - UI components
  /islands    - Interactive components
  
/tests
  /core       - Core tests
  /e2e        - End-to-end tests
  /integration - Integration tests
EOL

echo "Cleanup complete. Please run 'deno check' to verify changes."