#!/bin/bash

# First, let's find all TypeScript and TSX files
echo "Finding all TypeScript files..."
echo "TypeScript files (.ts):"
find . -name "*.ts" -not -path "*/\.*" -not -path "*/node_modules/*"

echo -e "\nTypeScript React files (.tsx):"
find . -name "*.tsx" -not -path "*/\.*" -not -path "*/node_modules/*"

# Look for specific patterns
echo -e "\nFinding agent-related files:"
find . -type f -name "*agent*.ts" -o -name "*agent*.tsx" -not -path "*/\.*"

echo -e "\nFinding component files:"
find . -type f -name "*component*.ts" -o -name "*component*.tsx" -not -path "*/\.*"

echo -e "\nFinding service files:"
find . -type f -name "*service*.ts" -not -path "*/\.*"

# Create directory structure
echo -e "\nCreating core directory structure..."
mkdir -p core/{agents,services,types,utils,routing,state}

# Move files based on their actual locations
echo -e "\nMoving files to appropriate directories..."

# Function to safely move files
move_if_exists() {
    if [ -f "$1" ]; then
        mkdir -p "$(dirname "$2")"
        mv "$1" "$2"
        echo "Moved: $1 -> $2"
    fi
}

# Move core files first
move_if_exists "types/chat.ts" "core/types/chat.ts"
move_if_exists "types/agent.ts" "core/types/agent.ts"
move_if_exists "utils/chat_formatting.ts" "core/utils/chat-formatting.ts"

# Move service files
for file in $(find . -name "*service*.ts" -not -path "*/core/*"); do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        mv "$file" "core/services/$filename"
        echo "Moved service: $file -> core/services/$filename"
    fi
done

# Move agent files
for file in $(find . -name "*agent*.ts" -o -name "*agent*.tsx" -not -path "*/core/*"); do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        mv "$file" "core/agents/$filename"
        echo "Moved agent file: $file -> core/agents/$filename"
    fi
done

echo "File location and movement complete."