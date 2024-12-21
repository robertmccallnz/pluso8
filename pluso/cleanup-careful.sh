#!/bin/bash

# Step 1: Create all necessary directories first
echo "Creating directory structure..."

mkdir -p core/agents/multi
mkdir -p core/agents/ui
mkdir -p core/agents/creation
mkdir -p core/agents/services
mkdir -p core/metrics/rlhf
mkdir -p core/metrics/ui
mkdir -p core/utils
mkdir -p core/types
mkdir -p core/services
mkdir -p core/state
mkdir -p core/routing

mkdir -p ui/components
mkdir -p ui/islands
mkdir -p ui/layouts

mkdir -p routes/api
mkdir -p routes/views
mkdir -p routes/layouts

# Step 2: Verify directories exist
echo "Verifying directory structure..."
ls -R core/
ls -R ui/
ls -R routes/

# Step 3: Move files with error checking
echo "Moving files..."

# Function to safely move files
move_files() {
    if [ -d "$1" ] && [ "$(ls -A $1)" ]; then
        echo "Moving files from $1 to $2"
        mv "$1"/* "$2"/ 2>/dev/null || echo "No files moved from $1 to $2"
    else
        echo "Source directory $1 is empty or doesn't exist"
    fi
}

# Core consolidation
move_files "components/multi-agent" "core/agents/multi"
move_files "islands/agents" "core/agents/ui"
move_files "islands/AgentCreation" "core/agents/creation"
move_files "services" "core/services"

# UI consolidation
move_files "components" "ui/components"
move_files "islands" "ui/islands"

# Routes consolidation
[ -f "routes/_app.tsx" ] && mv routes/_app.tsx routes/layouts/
[ -f "routes/_layout.tsx" ] && mv routes/_layout.tsx routes/layouts/
move_files "routes/api" "routes/api"

# Clean up empty directories
echo "Cleaning up empty directories..."
find . -type d -empty -delete

echo "Cleanup complete. Please verify the changes."