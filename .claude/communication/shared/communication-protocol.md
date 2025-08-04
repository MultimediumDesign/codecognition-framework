# Agent Communication Protocol

## Message Types

### 1. HANDOFF
When an agent needs another specialist to take over:
```
TO: target-agent
FROM: current-agent
TYPE: HANDOFF
CONTEXT: Brief description
ARTIFACTS: List of files/outputs
NEXT_STEPS: What the receiving agent should do
```

### 2. COLLABORATION
When agents need to work together:
```
TO: collaborating-agents
FROM: initiating-agent
TYPE: COLLABORATION
GOAL: Shared objective
ROLES: Who does what
TIMELINE: Expected completion
```

### 3. KNOWLEDGE_SHARE
When an agent discovers important patterns:
```
TO: ALL
FROM: discovering-agent
TYPE: KNOWLEDGE_SHARE
PATTERN: What was learned
CONTEXT: When this applies
IMPACT: Why it matters
```

### 4. BLOCKER
When an agent is stuck and needs help:
```
TO: relevant-agents
FROM: blocked-agent
TYPE: BLOCKER
ISSUE: What's preventing progress
ATTEMPTED: What has been tried
NEEDED: Specific help required
```

## Communication Channels

- **Inbox**: `.claude/communication/inbox/{agent}-inbox.md`
- **Shared Context**: `.claude/communication/shared/shared-context.json`
- **Handoff Queue**: `.claude/communication/shared/handoff-queue.md`
- **Knowledge Base**: `.claude/communication/shared/collective-knowledge.md`

## Usage

Agents automatically check these channels and update them during hook execution.
Users can also manually review and coordinate agent activities.
