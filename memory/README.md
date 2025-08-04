# CodeCognition Memory System

Persistent knowledge management across agents and sessions.

## 🧠 Memory Architecture

```
memory/
├── shared/              # Cross-agent knowledge base
├── agents/              # Agent-specific memories
├── projects/            # Project-specific context
├── patterns/            # Learned patterns and templates
└── decisions/           # Decision history and rationale
```

## 📚 Memory Types

### 1. Shared Knowledge Base (`shared/`)
- **Codebase insights** discovered by any agent
- **Best practices** learned through experience  
- **Common patterns** identified across projects
- **Technology preferences** and architectural decisions

### 2. Agent-Specific Memory (`agents/`)
- **Specialized knowledge** unique to each agent
- **Learning history** and capability evolution
- **Success patterns** for that agent's domain
- **Failure analysis** and lessons learned

### 3. Project Context (`projects/`)
- **Project-specific insights** and constraints
- **Team preferences** and coding standards
- **Historical decisions** and their outcomes
- **Stakeholder requirements** and feedback

### 4. Pattern Library (`patterns/`)
- **Workflow templates** that work well
- **Code patterns** frequently used
- **Problem-solution mappings** for common issues
- **Integration patterns** between tools/services

## 🔄 Memory Operations

### Writing Memory
```json
{
  "memory_type": "shared_knowledge",
  "category": "architecture_patterns",
  "key": "microservices_communication",
  "content": {
    "pattern": "Event-driven architecture with message queues",
    "rationale": "Decouples services and improves scalability",
    "learned_from": "project_alpha",
    "success_metrics": "99.9% uptime, 2x throughput improvement"
  },
  "confidence": 0.9,
  "source_agent": "architect",
  "timestamp": "2025-01-04T10:30:00Z"
}
```

### Reading Memory
- Agents query memory before starting major tasks
- Context automatically loaded based on project/task type
- Similar patterns suggested during implementation
- Previous solutions referenced during problem-solving

## 🎯 Usage Patterns

1. **Project Startup** - Load relevant historical context
2. **Architecture Decisions** - Reference past successes/failures
3. **Code Patterns** - Suggest proven implementations
4. **Problem Resolution** - Find similar past issues
5. **Knowledge Transfer** - Share expertise between agents