# Git Worktrees + CodeCognition Integration

> **Transform parallel development with specialized agent teams in isolated workspaces**

## 🌳 What are Git Worktrees?

Git worktrees allow you to have multiple working directories from the same repository, each with independent file states while sharing Git history. Perfect for parallel development with different CodeCognition agent teams.

## 🚀 CodeCognition Worktree Commands

### Create Worktrees with Agent Teams

```bash
# Create with preset agent teams
codecognition worktree create feature-auth --preset frontend
codecognition worktree create api-optimization --preset backend  
codecognition worktree create emergency-fix --preset emergency

# Create with custom agent assignment
codecognition worktree create dashboard --agents "architect,implementation-engineer,documentation-specialist"

# Create with new branch
codecognition worktree create user-system -b feature/user-management --preset fullstack
```

### Agent Team Presets

| Preset | Agents | Best For |
|--------|--------|----------|
| **frontend** | @implementation-engineer, @documentation-specialist, @quality-guardian | UI/UX development, component libraries |
| **backend** | @architect, @implementation-engineer, @devops-orchestrator | API development, database design |
| **fullstack** | @architect, @implementation-engineer, @quality-guardian, @devops-orchestrator | Complete feature development |
| **emergency** | @problem-solver, @quality-guardian, @devops-orchestrator | Hotfixes, critical issues |
| **research** | @research-analyst, @architect, @documentation-specialist | Proof of concepts, analysis |
| **deployment** | @devops-orchestrator, @quality-guardian, @integration-manager | Release preparation, CI/CD |

### Manage Worktrees

```bash
# List all worktrees with agent assignments
codecognition worktree list

# Sync agent insights across all worktrees  
codecognition worktree sync

# Remove completed worktrees
codecognition worktree remove feature-auth
codecognition worktree remove emergency-fix --force
```

## 🎯 Practical Workflows

### Parallel Feature Development

```bash
# Main repository - Architecture planning
cd ~/project
codecognition worktree create auth-system --preset backend
codecognition worktree create user-dashboard --preset frontend
codecognition worktree create payment-integration --preset fullstack

# Work in parallel
# Terminal 1: Backend team
cd ../auth-system && claude
# "Let @architect and @implementation-engineer design secure authentication"

# Terminal 2: Frontend team  
cd ../user-dashboard && claude
# "Have @implementation-engineer and @documentation-specialist build the dashboard UI"

# Terminal 3: Full-stack team
cd ../payment-integration && claude
# "Get the full team to integrate payment processing end-to-end"
```

### Emergency Response

```bash
# Critical bug in production
codecognition worktree create hotfix-security --preset emergency -b hotfix/security-patch

cd ../hotfix-security && claude
# "@problem-solver investigate the security vulnerability immediately"
# "@quality-guardian ensure the fix doesn't break anything"
# "@devops-orchestrator prepare emergency deployment"
```

### Research and Prototyping

```bash
# Evaluate new technology
codecognition worktree create ai-integration-research --preset research

cd ../ai-integration-research && claude  
# "@research-analyst evaluate AI integration options"
# "@architect design the integration architecture"
# "@documentation-specialist document findings and recommendations"
```

## ✨ Advanced Features

### Cross-Worktree Communication

The `sync` command collects insights from all worktree agents:

```bash
codecognition worktree sync
```

This creates a comprehensive report at `~/.claude/CodeCognition/communication/worktree-sync.json` with:
- Agent insights from all worktrees
- Recent discoveries and solutions
- Cross-team coordination opportunities

### Worktree Configuration

Each worktree gets a configuration file at `.claude/CodeCognition/worktree-config.json`:

```json
{
  "name": "auth-system",
  "created": "2025-08-04T15:30:00.000Z",
  "assigned_agents": ["architect", "implementation-engineer", "devops-orchestrator"],
  "preset": "backend",
  "parent_worktree": "/home/user/project"
}
```

### Memory Isolation

Each worktree maintains:
- ✅ **Independent agent memory** - No cross-contamination between features
- ✅ **Isolated communication logs** - Clear context per development stream  
- ✅ **Specialized focus** - Agents optimized for specific tasks
- ✅ **Shared framework** - Same CodeCognition capabilities everywhere

## 🎯 Best Practices

### Team Assignment Strategy

**Small Features**: 2-3 agents maximum
```bash
codecognition worktree create small-fix --agents "implementation-engineer,quality-guardian"
```

**Medium Features**: Use presets
```bash  
codecognition worktree create api-endpoint --preset backend
```

**Complex Features**: Full team coordination
```bash
codecognition worktree create major-feature --preset fullstack
```

### Cleanup Strategy

Regular cleanup prevents worktree clutter:
```bash
# After feature completion and merge
codecognition worktree remove feature-auth
git branch -d feature/auth-system

# Force remove if uncommitted changes exist
codecognition worktree remove experimental-feature --force
```

### Sync Strategy

Sync insights before major decisions:
```bash
# Before architectural decisions
codecognition worktree sync

# Before feature integration
codecognition worktree sync

# Before releases
codecognition worktree sync
```

## 🚀 Integration Benefits

### Development Velocity
- **8 agents × N worktrees** = Massive parallel processing
- **Specialized focus** per development stream
- **No context switching** between different features

### Code Quality
- **Isolated testing** environments
- **Feature-specific validation**
- **Independent quality gates**

### Team Coordination
- **Clear responsibility** per worktree
- **Reduced merge conflicts**
- **Better feature tracking**

## 🔧 Troubleshooting

### Common Issues

**Worktree creation fails**:
```bash
# Ensure you're in a git repository
git status

# Check available branches
git branch -a
```

**CodeCognition not copying**:
```bash
# Verify framework installation
codecognition status

# Reinstall if needed
codecognition install
```

**Agent assignments not working**:
```bash
# Check available agents
codecognition agents

# Verify agent names match exactly
codecognition worktree create test --agents "architect,implementation-engineer"
```

---

**Ready to supercharge parallel development?** 

Start with: `codecognition worktree create my-feature --preset frontend`