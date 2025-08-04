# Communication Protocols

## 🔄 Agent Communication Standards

### Message Types

| Type | Purpose | Priority | Auto-Response |
|------|---------|----------|---------------|
| `context_share` | Share findings between agents | medium | Optional |
| `coordination_request` | Request help from specific agent | high | Required |
| `decision_broadcast` | Announce critical decisions | high | Acknowledge |
| `status_update` | Report task completion | low | None |
| `emergency_alert` | Critical issues requiring immediate attention | critical | Required |

### Communication Patterns

#### 1. Parallel Discovery Pattern
- Multiple agents explore different aspects simultaneously
- Regular context sharing every 5-10 significant findings
- Coordinator agent aggregates and synthesizes findings

#### 2. Sequential Handoff Pattern  
- Agent completes specialized task
- Broadcasts completion with context
- Next agent in chain acknowledges and begins

#### 3. Emergency Response Pattern
- Any agent can broadcast emergency alert
- All available agents respond with capabilities
- Integration Manager coordinates response

#### 4. Quality Gate Pattern
- Implementation agent completes work
- Quality Guardian receives notification
- Review results broadcasted to all agents

### Context Propagation Rules

1. **Critical Decisions** - Must be shared with all agents
2. **Security Findings** - Immediate broadcast to Quality Guardian
3. **Architecture Changes** - Share with Architect and Implementation Engineer
4. **Performance Issues** - Alert DevOps Orchestrator and Problem Solver
5. **Documentation Needs** - Notify Documentation Specialist

### Message Persistence

- **High Priority** messages retained for 30 days
- **Medium Priority** messages retained for 7 days  
- **Low Priority** messages retained for 1 day
- **Emergency** messages archived permanently

### Agent Initialization Protocol

```json
{
  "message_type": "agent_init",
  "from_agent": "agent_name",
  "timestamp": "ISO-8601",
  "capabilities": ["list", "of", "capabilities"],
  "tools_available": ["tool1", "tool2"],
  "specialization_areas": ["area1", "area2"]
}
```