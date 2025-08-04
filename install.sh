#!/bin/bash

# CodeCognition Framework Quick Install Script
# For GitHub users who want simple one-command installation

set -e

echo "🚀 CodeCognition Framework - Quick Install"
echo "Advanced multi-agent coordination for Claude Code"
echo

# Check if npm/node is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    echo "Please install Node.js and npm first: https://nodejs.org/"
    exit 1
fi

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code is required but not installed."
    echo "Please install Claude Code first: npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Get Claude Code version
CLAUDE_VERSION=$(claude --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
echo "✅ Found Claude Code version: $CLAUDE_VERSION"

# Check if version is sufficient (1.0.60+)
if [[ $(echo "$CLAUDE_VERSION 1.0.60" | tr " " "\n" | sort -V | head -n1) != "1.0.60" ]]; then
    echo "⚠️  Claude Code version 1.0.60+ required for subagents support"
    echo "Current version: $CLAUDE_VERSION"
    echo "Please update: npm install -g @anthropic-ai/claude-code@latest"
    exit 1
fi

# Install CodeCognition
echo "📦 Installing CodeCognition framework..."

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Clone from GitHub
echo "Downloading framework..."
if command -v git &> /dev/null; then
    git clone https://github.com/MultimediumDesign/codecognition-framework.git
    cd codecognition-framework
else
    echo "Git not found, downloading archive..."
    curl -L https://github.com/MultimediumDesign/codecognition-framework/archive/main.tar.gz | tar xz
    cd codecognition-framework-main
fi

# Install dependencies and run installation
echo "Installing Node.js dependencies..."
npm install --silent

echo "🔧 Running framework installation..."
node scripts/install.js

echo
echo "✅ CodeCognition Framework installed successfully!"
echo
echo "📖 Next steps:"
echo "  1. Start Claude Code: claude"
echo "  2. Test framework: \"Is CodeCognition active?\""
echo "  3. Try multi-agent task: \"Analyze this codebase with multiple agents\""
echo
echo "📚 Documentation:"
echo "  codecognition docs    - View documentation"
echo "  codecognition status  - Check installation"  
echo "  codecognition agents  - List available agents"
echo

# Cleanup
cd /
rm -rf "$TEMP_DIR"

echo "🎉 Ready to supercharge your development workflow!"