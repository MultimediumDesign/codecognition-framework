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

// Worktree management commands
const worktreeCommand = program
  .command("worktree")
  .description("Manage git worktrees with CodeCognition agent teams");

worktreeCommand
  .command("create <name>")
  .description("Create a new worktree with assigned agent team")
  .option("-b, --branch <branch>", "Create new branch for worktree")
  .option("-a, --agents <agents>", "Comma-separated list of agents to assign")
  .option("-p, --preset <preset>", "Use predefined agent team preset")
  .option("--path <path>", "Custom path for worktree (default: ../<name>)")
  .action(async (name, options) => {
    const { execSync } = require("child_process");

    console.log(
      chalk.blue.bold(`🌳 Creating CodeCognition Worktree: ${name}\n`),
    );

    // Validate we're in a git repository
    try {
      execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    } catch (error) {
      console.error(chalk.red("❌ Not in a git repository"));
      return;
    }

    // Define agent team presets
    const presets = {
      frontend: [
        "implementation-engineer",
        "documentation-specialist",
        "quality-guardian",
      ],
      backend: ["architect", "implementation-engineer", "devops-orchestrator"],
      fullstack: [
        "architect",
        "implementation-engineer",
        "quality-guardian",
        "devops-orchestrator",
      ],
      emergency: ["problem-solver", "quality-guardian", "devops-orchestrator"],
      research: ["research-analyst", "architect", "documentation-specialist"],
      deployment: [
        "devops-orchestrator",
        "quality-guardian",
        "integration-manager",
      ],
    };

    // Determine agent assignment
    let selectedAgents = [];
    if (options.preset && presets[options.preset]) {
      selectedAgents = presets[options.preset];
      console.log(chalk.cyan(`📋 Using preset: ${options.preset}`));
    } else if (options.agents) {
      selectedAgents = options.agents.split(",").map((a) => a.trim());
    } else {
      selectedAgents = ["implementation-engineer", "quality-guardian"]; // default
    }

    // Create worktree path
    const worktreePath = options.path || `../${name}`;

    try {
      // Create git worktree
      const branchFlag = options.branch ? `-b ${options.branch}` : "";
      const command = `git worktree add ${worktreePath} ${branchFlag}`.trim();

      console.log(chalk.gray(`Running: ${command}`));
      execSync(command, { stdio: "inherit" });

      // Copy CodeCognition to new worktree
      const homeDir = os.homedir();
      const sourceCognition = path.join(homeDir, ".claude", "CodeCognition");
      const targetCognition = path.join(
        worktreePath,
        ".claude",
        "CodeCognition",
      );

      if (await fs.pathExists(sourceCognition)) {
        await fs.ensureDir(path.join(worktreePath, ".claude"));
        await fs.copy(sourceCognition, targetCognition);
        console.log(
          chalk.green("✅ CodeCognition framework copied to worktree"),
        );
      }

      // Create agent assignment file
      const assignmentFile = path.join(targetCognition, "worktree-config.json");
      const config = {
        name: name,
        created: new Date().toISOString(),
        assigned_agents: selectedAgents,
        preset: options.preset || "custom",
        parent_worktree: process.cwd(),
      };

      await fs.writeJson(assignmentFile, config, { spaces: 2 });

      console.log(chalk.green.bold("\n🎉 Worktree created successfully!"));
      console.log(chalk.cyan(`📁 Path: ${worktreePath}`));
      console.log(
        chalk.cyan(
          `🤖 Assigned agents: ${selectedAgents.map((a) => "@" + a).join(", ")}`,
        ),
      );
      console.log(chalk.yellow(`\n💡 Next steps:`));
      console.log(`   cd ${worktreePath}`);
      console.log(`   claude`);
      console.log(
        `   "Let ${selectedAgents.map((a) => "@" + a).join(" and ")} work on this feature"`,
      );
    } catch (error) {
      console.error(
        chalk.red(`❌ Failed to create worktree: ${error.message}`),
      );
    }
  });

worktreeCommand
  .command("list")
  .description("List all worktrees with their CodeCognition configurations")
  .action(async () => {
    const { execSync } = require("child_process");

    console.log(chalk.blue.bold("🌳 CodeCognition Worktrees\n"));

    try {
      const output = execSync("git worktree list --porcelain", {
        encoding: "utf8",
      });
      const worktrees = [];

      let current = {};
      for (const line of output.split("\n")) {
        if (line.startsWith("worktree ")) {
          if (current.path) worktrees.push(current);
          current = { path: line.replace("worktree ", "") };
        } else if (line.startsWith("branch ")) {
          current.branch = line.replace("branch refs/heads/", "");
        }
      }
      if (current.path) worktrees.push(current);

      for (const worktree of worktrees) {
        const configFile = path.join(
          worktree.path,
          ".claude",
          "CodeCognition",
          "worktree-config.json",
        );
        let config = null;

        if (await fs.pathExists(configFile)) {
          config = await fs.readJson(configFile);
        }

        const isMain = worktree.path.endsWith("CodeCognition");
        const status = isMain
          ? chalk.green("📍 Main")
          : chalk.cyan("🌿 Worktree");

        console.log(`${status} ${chalk.bold(path.basename(worktree.path))}`);
        console.log(`   📁 ${chalk.gray(worktree.path)}`);
        if (worktree.branch) {
          console.log(`   🌱 ${chalk.yellow(worktree.branch)}`);
        }

        if (config) {
          console.log(
            `   🤖 ${chalk.cyan(config.assigned_agents.map((a) => "@" + a).join(", "))}`,
          );
          if (config.preset !== "custom") {
            console.log(`   📋 ${chalk.magenta(config.preset + " preset")}`);
          }
        }
        console.log();
      }
    } catch (error) {
      console.error(chalk.red("❌ Failed to list worktrees:", error.message));
    }
  });

worktreeCommand
  .command("remove <name>")
  .description("Remove a worktree and clean up CodeCognition data")
  .option("--force", "Force remove even with uncommitted changes")
  .action(async (name, options) => {
    const { execSync } = require("child_process");

    console.log(chalk.yellow.bold(`🗑️  Removing Worktree: ${name}\n`));

    try {
      const forceFlag = options.force ? "--force" : "";
      const command = `git worktree remove ${name} ${forceFlag}`.trim();

      console.log(chalk.gray(`Running: ${command}`));
      execSync(command, { stdio: "inherit" });

      console.log(chalk.green("✅ Worktree removed successfully"));
    } catch (error) {
      console.error(
        chalk.red(`❌ Failed to remove worktree: ${error.message}`),
      );
      if (!options.force) {
        console.log(chalk.yellow("💡 Try with --force to remove anyway"));
      }
    }
  });

worktreeCommand
  .command("sync")
  .description("Sync agent insights across all worktrees")
  .action(async () => {
    const { execSync } = require("child_process");

    console.log(chalk.blue.bold("🔄 Syncing CodeCognition Across Worktrees\n"));

    try {
      const output = execSync("git worktree list --porcelain", {
        encoding: "utf8",
      });
      const worktrees = [];

      let current = {};
      for (const line of output.split("\n")) {
        if (line.startsWith("worktree ")) {
          if (current.path) worktrees.push(current);
          current = { path: line.replace("worktree ", "") };
        }
      }
      if (current.path) worktrees.push(current);

      console.log(chalk.cyan(`Found ${worktrees.length} worktrees`));

      // Collect insights from all worktrees
      const insights = [];
      for (const worktree of worktrees) {
        const memoryDir = path.join(
          worktree.path,
          ".claude",
          "CodeCognition",
          "memory",
          "agents",
        );
        if (await fs.pathExists(memoryDir)) {
          const files = await fs.readdir(memoryDir);
          for (const file of files) {
            const filePath = path.join(memoryDir, file);
            const content = await fs.readFile(filePath, "utf8");
            insights.push({
              worktree: path.basename(worktree.path),
              agent: file.replace(".md", ""),
              content: content.slice(-500), // Last 500 chars for recent insights
            });
          }
        }
      }

      // Create sync report
      const homeDir = os.homedir();
      const syncReport = path.join(
        homeDir,
        ".claude",
        "CodeCognition",
        "communication",
        "worktree-sync.json",
      );
      await fs.writeJson(
        syncReport,
        {
          timestamp: new Date().toISOString(),
          worktrees: worktrees.length,
          insights: insights.length,
          data: insights,
        },
        { spaces: 2 },
      );

      console.log(chalk.green(`✅ Synced ${insights.length} agent insights`));
      console.log(chalk.gray(`📄 Report saved: ${syncReport}`));
    } catch (error) {
      console.error(chalk.red("❌ Sync failed:", error.message));
    }
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
