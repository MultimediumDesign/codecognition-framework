# CodeCognition Quick Start Guide

Get up and running with CodeCognition in under 10 minutes.

## 🚀 Installation

### 1. Copy Framework to Claude Directory

```bash
# Copy CodeCognition to your Claude configuration
cp -r CodeCognition ~/.claude/

# Make hook scripts executable
chmod +x ~/.claude/CodeCognition/hooks/scripts/*.py
```

### 2. Configure Claude Code Settings

Create or update your Claude settings file:

```bash
# For project-specific settings
mkdir -p .claude
cp ~/.claude/CodeCognition/hooks/settings-template.json .claude/settings.json

# For user-global settings  
cp ~/.claude/CodeCognition/hooks/settings-template.json ~/.claude/settings.json
```

### 3. Register Subagents

```bash
# Create symlinks to make agents available to Claude Code
ln -sf ~/.claude/CodeCognition/agents/* ~/.claude/agents/
```

## 🎯 First Use

### Launch CodeCognition

Start Claude Code in any project directory:

```bash
claude
```

The framework will automatically initialize when you start a new session.

### Verify Installation

Check that CodeCognition is active:

```
You: Is CodeCognition framework active?
```

You should see a confirmation message with active agents.

### Test Agent Coordination

Try a simple multi-agent task:

```
You: Analyze this codebase architecture and suggest improvements
```

This will automatically engage the **Architect** and **Research Analyst** agents.

## 🤖 Basic Agent Usage

### Invoke Specific Agents

Use the `@agent-name` syntax:

```
You: @architect review the system design
You: @quality-guardian analyze security vulnerabilities  
You: @implementation-engineer implement the user authentication
```

### Multi-Agent Workflows

For complex tasks, let the **Integration Manager** coordinate:

```
You: Launch a comprehensive code review using multiple agents
You: Coordinate a feature development workflow for user profiles
You: Execute emergency response for the database performance issue
```

## 📋 Common Workflows

### Feature Development
```
You: Implement a new user dashboard feature with full quality gates
```
*Engages: Architect → Implementation Engineer → Quality Guardian → Documentation Specialist*

### Bug Investigation  
```
You: Debug the intermittent API timeout errors
```
*Engages: Problem Solver → DevOps Orchestrator → Quality Guardian*

### Security Audit
```
You: Perform a comprehensive security analysis of the authentication system
```
*Engages: Quality Guardian → Architect → Research Analyst*

### Performance Optimization
```
You: Analyze and optimize database query performance
```
*Engages: Problem Solver → DevOps Orchestrator → Implementation Engineer*

## 🔧 Configuration Options

### Enable/Disable Framework Features

Edit your `settings.json`:

```json
{
  "codecognition": {
    "framework_enabled": true,
    "agent_coordination": true,
    "memory_persistence": true,
    "quality_gates": true,
    "performance_monitoring": true,
    "communication_logging": false
  }
}
```

### Customize Hook Behavior

Modify hook scripts in `~/.claude/CodeCognition/hooks/scripts/` to customize:
- Code formatting and validation
- Quality gate enforcement  
- Communication patterns
- Memory persistence strategies

## 📊 Monitor Framework Performance

### Communication Logs
```bash
ls ~/.claude/CodeCognition/communication/messages/
```

### Agent Memory
```bash  
ls ~/.claude/CodeCognition/memory/agents/
```

### Framework Status
```bash
cat ~/.claude/CodeCognition/framework-status.json
```

## 🆘 Troubleshooting

### Framework Not Initializing
1. Check hook script permissions: `ls -la ~/.claude/CodeCognition/hooks/scripts/`
2. Verify settings.json syntax: `python3 -m json.tool ~/.claude/settings.json`
3. Check Claude Code version compatibility

### Agents Not Responding
1. Verify agent files exist: `ls ~/.claude/agents/`
2. Check agent configuration syntax
3. Review communication logs for errors

### Performance Issues
1. Monitor token usage with multiple agents
2. Adjust parallel execution limits
3. Optimize hook script performance

## 🎓 Next Steps

- Read the [Framework Guide](framework-guide.md) for advanced usage
- Review [Agent Specifications](agent-specs.md) for customization
- Explore [Workflow Patterns](workflow-patterns.md) for complex scenarios
- Check [Hooks Configuration](hooks-guide.md) for automation setup

---

*Ready to transform your development workflow with AI agent coordination!*