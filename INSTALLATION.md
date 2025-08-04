# CodeCognition Installation Guide

Complete installation and setup instructions for the CodeCognition framework.

## 📋 Prerequisites

- **Claude Code** version 1.0.60+ (subagents support required)
- **Python 3.8+** for hook scripts
- **Unix-like environment** (macOS, Linux, WSL on Windows)

## 🚀 Installation Methods

### Method 1: Quick Install (Recommended)

```bash
# 1. Clone or download CodeCognition framework
git clone https://github.com/your-repo/CodeCognition.git
cd CodeCognition

# 2. Run the installation script
./install.sh

# 3. Verify installation
claude --version
ls ~/.claude/agents/
```

### Method 2: Manual Installation

#### Step 1: Copy Framework Files

```bash
# Create Claude configuration directory if it doesn't exist
mkdir -p ~/.claude

# Copy CodeCognition framework
cp -r CodeCognition ~/.claude/

# Make hook scripts executable
chmod +x ~/.claude/CodeCognition/hooks/scripts/*.py
```

#### Step 2: Install Python Dependencies

```bash
# Install required Python packages
pip3 install --user json pathlib datetime

# Verify Python environment
python3 --version
python3 -c "import json, pathlib, datetime; print('Dependencies OK')"
```

#### Step 3: Configure Claude Code Settings

Choose your configuration scope:

**Option A: User-Global Configuration**
```bash
# Apply to all Claude Code projects
cp ~/.claude/CodeCognition/hooks/settings-template.json ~/.claude/settings.json
```

**Option B: Project-Specific Configuration**
```bash
# Apply only to current project
mkdir -p .claude
cp ~/.claude/CodeCognition/hooks/settings-template.json .claude/settings.json
```

#### Step 4: Register Subagents

```bash
# Create agents directory if it doesn't exist
mkdir -p ~/.claude/agents

# Link CodeCognition agents to Claude Code
ln -sf ~/.claude/CodeCognition/agents/*.md ~/.claude/agents/

# Verify agent registration
ls -la ~/.claude/agents/
```

#### Step 5: Initialize Framework Directories

```bash
# Create required directories
mkdir -p ~/.claude/CodeCognition/{communication/{messages,context,decisions},memory/{shared,agents,projects,patterns,decisions}}

# Set proper permissions
chmod -R 755 ~/.claude/CodeCognition/
```

## 🔧 Configuration

### Basic Configuration

Edit your Claude settings file to customize framework behavior:

```json
{
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "UserPromptSubmit": [...],
    "SessionStart": [...],
    "Stop": [...]
  },
  "codecognition": {
    "framework_enabled": true,
    "agent_coordination": true,
    "memory_persistence": true,
    "quality_gates": true,
    "performance_monitoring": true,
    "communication_logging": true
  }
}
```

### Advanced Configuration

#### Hook Script Customization

Modify hook behavior by editing scripts in `~/.claude/CodeCognition/hooks/scripts/`:

- `session-initializer.py` - Framework startup behavior
- `prompt-context-enhancer.py` - Prompt analysis and agent suggestion
- `pre-write-validator.py` - Code write validation
- `post-write-processor.py` - Code formatting and quality checks
- `bash-command-validator.py` - Command safety validation

#### Agent Customization

Customize individual agents by editing their configuration files in `~/.claude/CodeCognition/agents/`:

```markdown
---
name: custom-agent
description: Your custom agent description
tools: Read, Write, Bash, WebSearch
specialization: your_domain
communication_priority: medium
memory_access: limited
---

Your custom system prompt here...
```

#### Memory System Configuration

Configure memory persistence in `~/.claude/CodeCognition/framework-config.json`:

```json
{
  "memory": {
    "retention_days": 30,
    "max_entries_per_category": 1000,
    "compression_enabled": true,
    "backup_enabled": true
  }
}
```

## ✅ Verification

### Test Framework Activation

```bash
# Start Claude Code
claude

# Test framework initialization
# You should see: "🚀 CodeCognition Framework Active"
```

### Test Agent Availability

In Claude Code, verify agents are available:

```
You: List available subagents
```

Expected response should include all 8 CodeCognition agents.

### Test Agent Communication

```
You: @architect analyze system architecture
```

Should invoke the Architect agent with proper context.

### Test Workflow Coordination

```
You: Coordinate a comprehensive code review using multiple agents
```

Should engage Integration Manager to orchestrate multiple agents.

## 🐛 Troubleshooting

### Common Issues

#### Framework Not Initializing

**Symptoms**: No initialization message when starting Claude Code

**Solutions**:
1. Check hook script permissions:
   ```bash
   ls -la ~/.claude/CodeCognition/hooks/scripts/
   chmod +x ~/.claude/CodeCognition/hooks/scripts/*.py
   ```

2. Verify settings.json syntax:
   ```bash
   python3 -m json.tool ~/.claude/settings.json
   ```

3. Check Python environment:
   ```bash
   python3 ~/.claude/CodeCognition/hooks/scripts/session-initializer.py
   ```

#### Agents Not Available

**Symptoms**: Subagents not found when using `@agent-name` syntax

**Solutions**:
1. Verify agent symlinks:
   ```bash
   ls -la ~/.claude/agents/
   ```

2. Re-create agent links:
   ```bash
   rm ~/.claude/agents/*.md
   ln -sf ~/.claude/CodeCognition/agents/*.md ~/.claude/agents/
   ```

3. Check agent file syntax:
   ```bash
   head -10 ~/.claude/CodeCognition/agents/architect.md
   ```

#### Hook Scripts Failing

**Symptoms**: Error messages about hook execution failures

**Solutions**:
1. Check Python dependencies:
   ```bash
   python3 -c "import json, pathlib, datetime"
   ```

2. Test hook scripts individually:
   ```bash
   echo '{}' | python3 ~/.claude/CodeCognition/hooks/scripts/session-initializer.py
   ```

3. Review hook logs:
   ```bash
   ls ~/.claude/CodeCognition/communication/context/
   ```

#### Performance Issues

**Symptoms**: Slow response times or high token usage

**Solutions**:
1. Monitor agent coordination:
   ```bash
   tail -f ~/.claude/CodeCognition/communication/messages/*.json
   ```

2. Disable features temporarily:
   ```json
   {
     "codecognition": {
       "performance_monitoring": false,
       "communication_logging": false
     }
   }
   ```

3. Optimize parallel execution:
   - Reduce number of agents for simple tasks
   - Use specific agent invocation instead of full coordination

### Getting Help

1. **Check Documentation**: Review [Framework Guide](docs/framework-guide.md) and [Quick Start Guide](docs/quick-start-guide.md)

2. **Review Logs**: Check framework logs in `~/.claude/CodeCognition/communication/`

3. **Validate Configuration**: Use provided validation scripts to check setup

4. **Community Support**: Join the CodeCognition community for assistance

## 🔄 Updates and Maintenance

### Updating the Framework

```bash
# Backup existing configuration
cp -r ~/.claude/CodeCognition ~/.claude/CodeCognition.backup

# Update framework files
git pull origin main
cp -r CodeCognition/* ~/.claude/CodeCognition/

# Preserve custom configurations
# Review and merge any custom changes
```

### Maintenance Tasks

#### Weekly Maintenance

```bash
# Clean old communication logs
find ~/.claude/CodeCognition/communication/messages/ -name "*.json" -mtime +7 -delete

# Backup agent memory
tar -czf codecognition-memory-$(date +%Y%m%d).tar.gz ~/.claude/CodeCognition/memory/
```

#### Monthly Maintenance

```bash
# Review and update agent configurations based on usage patterns
# Analyze memory effectiveness and optimize retention policies
# Update hook scripts based on new Claude Code features
```

---

*Complete installation enables the full power of coordinated AI development with CodeCognition.*