#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

console.log(chalk.blue.bold("🎉 CodeCognition Framework Installed!"));
console.log(chalk.gray("Advanced multi-agent coordination for Claude Code\n"));

// Check if Claude Code is available
try {
  const { execSync } = require("child_process");
  const claudeVersion = execSync("claude --version", {
    encoding: "utf8",
  }).trim();
  console.log(chalk.green("✅ Claude Code detected: " + claudeVersion));
} catch (error) {
  console.log(chalk.yellow("⚠️  Claude Code not found in PATH"));
  console.log(
    chalk.gray("   Install with: npm install -g @anthropic-ai/claude-code\n"),
  );
}

console.log(chalk.cyan.bold("🚀 Quick Start:"));
console.log(
  "  Install: curl -fsSL https://raw.githubusercontent.com/MultimediumDesign/codecognition-framework/main/install.sh | bash",
);
console.log(
  "  Status:  node ~/.claude/CodeCognition/bin/codecognition.js status",
);
console.log(
  "  Agents:  node ~/.claude/CodeCognition/bin/codecognition.js agents",
);
console.log(
  "  Docs:    https://github.com/MultimediumDesign/codecognition-framework#readme",
);

console.log(chalk.cyan.bold("\n🤖 Usage Examples:"));
console.log('  "Analyze this codebase architecture using multiple agents"');
console.log('  "Implement user authentication with full quality gates"');
console.log('  "@architect review the system design"');
console.log('  "Launch emergency response for the database issue"');

console.log(chalk.cyan.bold("\n📖 Documentation:"));
console.log("  https://github.com/MultimediumDesign/codecognition-framework");

console.log(
  chalk.green.bold(
    "\n✨ Transform your development workflow with AI agent coordination!",
  ),
);

// Check if already installed
const homeDir = os.homedir();
const frameworkDir = path.join(homeDir, ".claude", "CodeCognition");

if (fs.pathExistsSync(frameworkDir)) {
  console.log(chalk.yellow.bold("\n💡 Framework already installed!"));
  console.log(
    "   Run " +
      chalk.cyan("node ~/.claude/CodeCognition/bin/codecognition.js status") +
      " to check configuration",
  );
} else {
  console.log(
    chalk.yellow.bold(
      "\n⚡ Next: Run the install script to activate the framework",
    ),
  );
  console.log(
    "curl -fsSL https://raw.githubusercontent.com/MultimediumDesign/codecognition-framework/main/install.sh | bash",
  );
}
