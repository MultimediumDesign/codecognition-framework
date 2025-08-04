# Inter-Agent Communication System

This directory manages communication between CodeCognition subagents.

## 📁 Structure

```
communication/
├── messages/           # Agent-to-agent messages
├── context/           # Shared context files  
├── decisions/         # Decision audit trail
├── templates/         # Message templates
└── protocols.md      # Communication protocols
```

## 🔄 Message Flow

1. **Agent Initialization** - Register with communication system
2. **Context Sharing** - Broadcast relevant findings
3. **Decision Broadcasting** - Share critical decisions
4. **Coordination Requests** - Request help from other agents
5. **Status Updates** - Report task completion

## 📝 Message Format

```json
{
  "timestamp": "2025-01-04T10:30:00Z",
  "from_agent": "architect",
  "to_agent": "implementation-engineer",
  "message_type": "context_share",
  "priority": "high",
  "content": {
    "findings": "...",
    "recommendations": "...",
    "next_actions": "..."
  }
}
```

## 🎯 Usage

Agents automatically use this system when:
- Discovering important architectural patterns
- Identifying security concerns
- Finding performance bottlenecks
- Coordinating complex tasks
- Sharing specialized knowledge