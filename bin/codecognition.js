#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const CodeCognitionInstaller = require("../scripts/install.js");

program
  .name("codecognition")
  .description(
    "CodeCognition Framework CLI - Advanced multi-agent coordination for Claude Code",
  )
  .version("1.0.0");

program
  .command("install")
  .description("Install CodeCognition framework")
  .option("--global", "Install globally (default)")
  .option("--project", "Install for current project only")
  .option("--skip-permissions", "Skip permission prompts (recommended)")
  .option("--no-hooks", "Disable intelligent hooks")
  .option("--no-memory", "Disable persistent memory")
  .option("--no-communication", "Disable communication logging")
  .action(async (options) => {
    const installer = new CodeCognitionInstaller();

    // Override preferences with CLI options
    const preferences = {
      scope: options.project ? "project" : "global",
      enableHooks: options.hooks !== false,
      enableMemory: options.memory !== false,
      enableCommunication: options.communication !== false,
      skipPermissions: options.skipPermissions || true,
    };

    try {
      await installer.install(preferences);
    } catch (error) {
      console.error(chalk.red("Installation failed:"), error.message);
      process.exit(1);
    }
  });

program
  .command("uninstall")
  .description("Uninstall CodeCognition framework")
  .option("--keep-settings", "Keep Claude Code settings")
  .option("--keep-memory", "Keep agent memory and communication logs")
  .action(async (options) => {
    const homeDir = os.homedir();
    const claudeDir = path.join(homeDir, ".claude");
    const frameworkDir = path.join(claudeDir, "CodeCognition");
    const agentsDir = path.join(claudeDir, "agents");

    console.log(chalk.yellow("🗑️  Uninstalling CodeCognition framework..."));

    try {
      // Remove agents
      if (await fs.pathExists(agentsDir)) {
        const agents = [
          "architect",
          "implementation-engineer",
          "quality-guardian",
          "devops-orchestrator",
          "documentation-specialist",
          "research-analyst",
          "problem-solver",
          "integration-manager",
        ];

        for (const agent of agents) {
          const agentFile = path.join(agentsDir, `${agent}.md`);
          if (await fs.pathExists(agentFile)) {
            await fs.remove(agentFile);
          }
        }
      }

      // Remove framework directory (with options)
      if (await fs.pathExists(frameworkDir)) {
        if (options.keepMemory) {
          // Remove everything except memory
          const items = await fs.readdir(frameworkDir);
          for (const item of items) {
            if (item !== "memory" && item !== "communication") {
              await fs.remove(path.join(frameworkDir, item));
            }
          }
        } else {
          await fs.remove(frameworkDir);
        }
      }

      // Clean settings (optional)
      if (!options.keepSettings) {
        const settingsPath = path.join(claudeDir, "settings.json");
        if (await fs.pathExists(settingsPath)) {
          let settings = await fs.readJson(settingsPath);

          // Remove CodeCognition-specific settings
          delete settings.codecognition;

          // Remove hooks if they're CodeCognition hooks
          if (settings.hooks) {
            for (const hookType in settings.hooks) {
              settings.hooks[hookType] = settings.hooks[hookType].filter(
                (hook) =>
                  !hook.hooks?.some((h) =>
                    h.command?.includes("CodeCognition"),
                  ),
              );
              if (settings.hooks[hookType].length === 0) {
                delete settings.hooks[hookType];
              }
            }
            if (Object.keys(settings.hooks).length === 0) {
              delete settings.hooks;
            }
          }

          await fs.writeJson(settingsPath, settings, { spaces: 2 });
        }
      }

      console.log(
        chalk.green("✅ CodeCognition framework uninstalled successfully"),
      );
    } catch (error) {
      console.error(chalk.red("Uninstallation failed:"), error.message);
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Show CodeCognition framework status")
  .action(async () => {
    const homeDir = os.homedir();
    const frameworkDir = path.join(homeDir, ".claude", "CodeCognition");
    const agentsDir = path.join(homeDir, ".claude", "agents");
    const settingsPath = path.join(homeDir, ".claude", "settings.json");

    console.log(chalk.blue.bold("📊 CodeCognition Framework Status\n"));

    // Check installation
    const installed = await fs.pathExists(frameworkDir);
    console.log(
      `Installation: ${installed ? chalk.green("✅ Installed") : chalk.red("❌ Not installed")}`,
    );

    if (!installed) {
      console.log(chalk.yellow("\nRun: codecognition install"));
      return;
    }

    // Check agents
    if (await fs.pathExists(agentsDir)) {
      const agentFiles = await fs.readdir(agentsDir);
      const codecognitionAgents = agentFiles.filter((f) =>
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
      console.log(
        `Agents: ${chalk.cyan(codecognitionAgents.length + "/8")} registered`,
      );
    }

    // Check settings
    if (await fs.pathExists(settingsPath)) {
      const settings = await fs.readJson(settingsPath);
      const codecognitionConfig = settings.codecognition || {};

      console.log("\nConfiguration:");
      console.log(
        `  Framework: ${codecognitionConfig.framework_enabled ? chalk.green("✅ Enabled") : chalk.red("❌ Disabled")}`,
      );
      console.log(
        `  Agent Coordination: ${codecognitionConfig.agent_coordination ? chalk.green("✅ Enabled") : chalk.red("❌ Disabled")}`,
      );
      console.log(
        `  Memory: ${codecognitionConfig.memory_persistence ? chalk.green("✅ Enabled") : chalk.red("❌ Disabled")}`,
      );
      console.log(
        `  Quality Gates: ${codecognitionConfig.quality_gates ? chalk.green("✅ Enabled") : chalk.red("❌ Disabled")}`,
      );
      console.log(
        `  Skip Permissions: ${settings.dangerouslySkipPermissions ? chalk.green("✅ Enabled") : chalk.red("❌ Disabled")}`,
      );

      const hooks = settings.hooks || {};
      const hookCount = Object.values(hooks).flat().length;
      console.log(`  Hooks: ${chalk.cyan(hookCount)} configured`);
    }

    // Check memory usage
    const memoryDir = path.join(frameworkDir, "memory");
    if (await fs.pathExists(memoryDir)) {
      const agentMemoryDir = path.join(memoryDir, "agents");
      if (await fs.pathExists(agentMemoryDir)) {
        const memoryFiles = await fs.readdir(agentMemoryDir);
        console.log(
          `\nMemory: ${chalk.cyan(memoryFiles.length)} agent memory files`,
        );
      }
    }

    // Check communication logs
    const commDir = path.join(frameworkDir, "communication");
    if (await fs.pathExists(commDir)) {
      const messagesDir = path.join(commDir, "messages");
      if (await fs.pathExists(messagesDir)) {
        const logFiles = await fs.readdir(messagesDir);
        console.log(
          `Communication Logs: ${chalk.cyan(logFiles.length)} session logs`,
        );
      }
    }
  });

program
  .command("docs")
  .description("Open CodeCognition documentation")
  .action(() => {
    const homeDir = os.homedir();
    const docsDir = path.join(homeDir, ".claude", "CodeCognition", "docs");

    console.log(chalk.blue.bold("📖 CodeCognition Documentation\n"));
    console.log("Available documentation:");
    console.log(
      `  Quick Start: ${chalk.cyan("file://" + path.join(docsDir, "quick-start-guide.md"))}`,
    );
    console.log(
      `  Framework Guide: ${chalk.cyan("file://" + path.join(docsDir, "framework-guide.md"))}`,
    );
    console.log(
      `  Installation: ${chalk.cyan("file://" + path.join(docsDir, "../INSTALLATION.md"))}`,
    );
    console.log("\nAgent Documentation:");
    console.log(
      `  Agent Specs: ${chalk.cyan("file://" + path.join(docsDir, "../agents/"))}`,
    );
    console.log(
      `  Workflows: ${chalk.cyan("file://" + path.join(docsDir, "../workflows/"))}`,
    );
  });

program
  .command("agents")
  .description("List available agents and their status")
  .action(async () => {
    const homeDir = os.homedir();
    const agentsDir = path.join(homeDir, ".claude", "agents");
    const frameworkAgentsDir = path.join(
      homeDir,
      ".claude",
      "CodeCognition",
      "agents",
    );

    console.log(chalk.blue.bold("🤖 CodeCognition Agents\n"));

    const agentList = [
      {
        name: "architect",
        description: "System design and architecture specialist",
      },
      {
        name: "implementation-engineer",
        description: "Code development and implementation expert",
      },
      {
        name: "quality-guardian",
        description: "Security, testing, and quality assurance",
      },
      {
        name: "devops-orchestrator",
        description: "Infrastructure and operations specialist",
      },
      {
        name: "documentation-specialist",
        description: "Technical writing and knowledge management",
      },
      {
        name: "research-analyst",
        description: "Technology research and impact analysis",
      },
      {
        name: "problem-solver",
        description: "Debugging and troubleshooting expert",
      },
      {
        name: "integration-manager",
        description: "Workflow orchestration and coordination",
      },
    ];

    for (const agent of agentList) {
      const agentFile = path.join(agentsDir, `${agent.name}.md`);
      const frameworkFile = path.join(frameworkAgentsDir, `${agent.name}.md`);

      const registered = await fs.pathExists(agentFile);
      const available = await fs.pathExists(frameworkFile);

      const status = registered
        ? chalk.green("✅ Active")
        : available
          ? chalk.yellow("⚠️  Available")
          : chalk.red("❌ Missing");

      console.log(`${status} ${chalk.cyan("@" + agent.name)}`);
      console.log(`     ${chalk.gray(agent.description)}\n`);
    }

    if (!(await fs.pathExists(agentsDir))) {
      console.log(chalk.yellow("Run: codecognition install"));
    }
  });

program
  .command("clean")
  .description("Clean up old logs and temporary files")
  .option("--days <days>", "Keep files newer than N days", "7")
  .action(async (options) => {
    const homeDir = os.homedir();
    const frameworkDir = path.join(homeDir, ".claude", "CodeCognition");
    const days = parseInt(options.days);
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

    console.log(chalk.yellow(`🧹 Cleaning files older than ${days} days...\n`));

    let cleanedCount = 0;

    // Clean communication logs
    const messagesDir = path.join(frameworkDir, "communication", "messages");
    if (await fs.pathExists(messagesDir)) {
      const files = await fs.readdir(messagesDir);
      for (const file of files) {
        const filePath = path.join(messagesDir, file);
        const stats = await fs.stat(filePath);
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.remove(filePath);
          cleanedCount++;
        }
      }
    }

    // Clean context logs
    const contextDir = path.join(frameworkDir, "communication", "context");
    if (await fs.pathExists(contextDir)) {
      const files = await fs.readdir(contextDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(contextDir, file);
          const stats = await fs.stat(filePath);
          if (stats.mtime.getTime() < cutoffTime) {
            await fs.remove(filePath);
            cleanedCount++;
          }
        }
      }
    }

    console.log(chalk.green(`✅ Cleaned ${cleanedCount} old files`));
  });

// Handle unknown commands
program.on("command:*", () => {
  console.error(chalk.red("Invalid command: %s"), program.args.join(" "));
  console.log(chalk.yellow("See --help for available commands"));
  process.exit(1);
});

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse();
