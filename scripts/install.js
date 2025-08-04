#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");

class CodeCognitionInstaller {
  constructor() {
    this.homeDir = os.homedir();
    this.claudeDir = path.join(this.homeDir, ".claude");
    this.frameworkDir = path.join(this.claudeDir, "CodeCognition");
    this.agentsDir = path.join(this.claudeDir, "agents");
    this.sourceDir = __dirname.replace("/scripts", "");
  }

  async install(cliPreferences) {
    console.log(chalk.blue.bold("🚀 CodeCognition Framework Installer"));
    console.log(
      chalk.gray("Advanced multi-agent coordination for Claude Code\n"),
    );

    // Check prerequisites
    await this.checkPrerequisites();

    // Get installation preferences
    const preferences = await this.getInstallationPreferences(cliPreferences);

    // Install framework
    await this.installFramework(preferences);

    // Setup agents
    await this.setupAgents();

    // Configure settings
    await this.configureSettings(preferences);

    // Verify installation
    await this.verifyInstallation();

    console.log(
      chalk.green.bold("\n✅ CodeCognition Framework installed successfully!"),
    );
    console.log(chalk.yellow("\n📖 Next steps:"));
    console.log("  1. Start Claude Code: " + chalk.cyan("claude"));
    console.log(
      "  2. Test framework: " + chalk.cyan('"Is CodeCognition active?"'),
    );
    console.log("  3. Read docs: " + chalk.cyan("codecognition docs"));
  }

  async checkPrerequisites() {
    const spinner = ora("Checking prerequisites...").start();

    try {
      // Check Claude Code installation
      const { execSync } = require("child_process");
      const claudeVersion = execSync("claude --version", {
        encoding: "utf8",
      }).trim();

      // Extract version number
      const versionMatch = claudeVersion.match(/(\d+\.\d+\.\d+)/);
      if (!versionMatch) {
        throw new Error("Could not determine Claude Code version");
      }

      const version = versionMatch[1];
      const [major, minor, patch] = version.split(".").map(Number);

      if (major < 1 || (major === 1 && minor === 0 && patch < 60)) {
        throw new Error(
          `Claude Code version ${version} found. Version 1.0.60+ required for subagents support.`,
        );
      }

      spinner.succeed(`Claude Code ${version} found ✓`);

      // Check Python
      try {
        const pythonVersion = execSync("python3 --version", {
          encoding: "utf8",
        }).trim();
        spinner.succeed(`${pythonVersion} found ✓`);
      } catch (error) {
        spinner.warn("Python 3 not found - hook scripts may not work");
      }
    } catch (error) {
      spinner.fail("Prerequisites check failed");
      console.error(chalk.red("\n❌ Error: " + error.message));
      console.error(
        chalk.yellow(
          "Please install Claude Code 1.0.60+ first: npm install -g @anthropic-ai/claude-code",
        ),
      );
      process.exit(1);
    }
  }

  async getInstallationPreferences(cliPreferences) {
    // If CLI preferences provided, use those
    if (cliPreferences) {
      return cliPreferences;
    }

    const questions = [
      {
        type: "list",
        name: "scope",
        message: "Installation scope:",
        choices: [
          {
            name: "User-global (recommended) - Apply to all Claude Code projects",
            value: "global",
          },
          {
            name: "Project-specific - Apply only to current project",
            value: "project",
          },
        ],
        default: "global",
      },
      {
        type: "confirm",
        name: "skipPermissions",
        message:
          "Skip permission prompts for seamless operation? (recommended)",
        default: true,
      },
      {
        type: "confirm",
        name: "enableHooks",
        message: "Enable intelligent hooks for automation?",
        default: true,
      },
      {
        type: "confirm",
        name: "enableMemory",
        message: "Enable persistent memory across sessions?",
        default: true,
      },
      {
        type: "confirm",
        name: "enableCommunication",
        message: "Enable inter-agent communication logging?",
        default: true,
      },
    ];

    return await inquirer.prompt(questions);
  }

  async installFramework(preferences) {
    const spinner = ora("Installing CodeCognition framework...").start();

    try {
      // Create directories
      await fs.ensureDir(this.frameworkDir);
      await fs.ensureDir(this.agentsDir);

      // Copy framework files
      await fs.copy(this.sourceDir, this.frameworkDir, {
        filter: (src) => {
          const relativePath = path.relative(this.sourceDir, src);
          return (
            !relativePath.startsWith("node_modules") &&
            !relativePath.startsWith(".git") &&
            !relativePath.includes("package-lock.json")
          );
        },
      });

      // Make hook scripts executable
      const hooksDir = path.join(this.frameworkDir, "hooks", "scripts");
      if (await fs.pathExists(hooksDir)) {
        const scripts = await fs.readdir(hooksDir);
        for (const script of scripts.filter((f) => f.endsWith(".py"))) {
          await fs.chmod(path.join(hooksDir, script), 0o755);
        }
      }

      spinner.succeed("Framework files installed ✓");
    } catch (error) {
      spinner.fail("Framework installation failed");
      throw error;
    }
  }

  async setupAgents() {
    const spinner = ora("Registering subagents...").start();

    try {
      const agentSourceDir = path.join(this.frameworkDir, "agents");
      const agentFiles = await fs.readdir(agentSourceDir);

      for (const agentFile of agentFiles.filter((f) => f.endsWith(".md"))) {
        const sourcePath = path.join(agentSourceDir, agentFile);
        const targetPath = path.join(this.agentsDir, agentFile);

        // Remove existing symlink if it exists
        if (await fs.pathExists(targetPath)) {
          await fs.remove(targetPath);
        }

        // Create symlink
        await fs.ensureSymlink(sourcePath, targetPath);
      }

      spinner.succeed(
        `${agentFiles.filter((f) => f.endsWith(".md")).length} agents registered ✓`,
      );
    } catch (error) {
      spinner.fail("Agent registration failed");
      throw error;
    }
  }

  async configureSettings(preferences) {
    const spinner = ora("Configuring Claude Code settings...").start();

    try {
      const settingsTemplate = path.join(
        this.frameworkDir,
        "hooks",
        "settings-template.json",
      );
      const settingsContent = await fs.readJson(settingsTemplate);

      // Apply user preferences
      if (preferences.skipPermissions) {
        settingsContent.allowedTools = ["*"];
        settingsContent.dangerouslySkipPermissions = true;
      }

      settingsContent.codecognition = {
        framework_enabled: true,
        agent_coordination: true,
        memory_persistence: preferences.enableMemory,
        quality_gates: true,
        performance_monitoring: true,
        communication_logging: preferences.enableCommunication,
      };

      // Determine settings path
      let settingsPath;
      if (preferences.scope === "global") {
        settingsPath = path.join(this.claudeDir, "settings.json");
      } else {
        await fs.ensureDir(".claude");
        settingsPath = path.join(process.cwd(), ".claude", "settings.json");
      }

      // Merge with existing settings if they exist
      let finalSettings = settingsContent;
      if (await fs.pathExists(settingsPath)) {
        const existingSettings = await fs.readJson(settingsPath);
        finalSettings = { ...existingSettings, ...settingsContent };
      }

      await fs.writeJson(settingsPath, finalSettings, { spaces: 2 });

      spinner.succeed(`Settings configured (${preferences.scope}) ✓`);
    } catch (error) {
      spinner.fail("Settings configuration failed");
      throw error;
    }
  }

  async verifyInstallation() {
    const spinner = ora("Verifying installation...").start();

    try {
      // Check framework directory
      if (!(await fs.pathExists(this.frameworkDir))) {
        throw new Error("Framework directory not found");
      }

      // Check agents
      const agentFiles = await fs.readdir(this.agentsDir);
      const codecognitionAgents = agentFiles.filter(
        (f) =>
          f.endsWith(".md") &&
          [
            "architect",
            "implementation-engineer",
            "quality-guardian",
            "devops-orchestrator",
            "documentation-specialist",
            "research-analyst",
            "problem-solver",
            "integration-manager",
          ].some((agent) => f.includes(agent)),
      );

      if (codecognitionAgents.length < 8) {
        throw new Error(`Only ${codecognitionAgents.length}/8 agents found`);
      }

      // Check hook scripts
      const hooksDir = path.join(this.frameworkDir, "hooks", "scripts");
      const hookScripts = await fs.readdir(hooksDir);
      const requiredScripts = [
        "session-initializer.py",
        "prompt-context-enhancer.py",
      ];

      for (const script of requiredScripts) {
        if (!hookScripts.includes(script)) {
          throw new Error(`Required hook script ${script} not found`);
        }
      }

      spinner.succeed("Installation verified ✓");
    } catch (error) {
      spinner.fail("Installation verification failed");
      throw error;
    }
  }
}

// Run installer
if (require.main === module) {
  const installer = new CodeCognitionInstaller();
  installer.install().catch((error) => {
    console.error(chalk.red("\n❌ Installation failed:"), error.message);
    process.exit(1);
  });
}

module.exports = CodeCognitionInstaller;
