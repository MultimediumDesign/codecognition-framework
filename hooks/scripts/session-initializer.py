#!/usr/bin/env python3
"""
CodeCognition Session Initializer Hook
=====================================
Initializes the CodeCognition framework at session start.
Loads agent context, initializes communication systems, and sets up memory.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

def ensure_directory(path):
    """Ensure directory exists, create if not."""
    Path(path).mkdir(parents=True, exist_ok=True)

def initialize_communication_system():
    """Initialize the inter-agent communication system."""
    comm_dir = Path.home() / ".claude" / "CodeCognition" / "communication"
    
    # Create communication directories
    ensure_directory(comm_dir / "messages")
    ensure_directory(comm_dir / "context")
    ensure_directory(comm_dir / "decisions")
    
    # Initialize session communication log
    session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    session_log = {
        "session_id": session_id,
        "started_at": datetime.now().isoformat(),
        "agents_initialized": [],
        "framework_version": "1.0.0"
    }
    
    with open(comm_dir / "messages" / f"session_{session_id}.json", "w") as f:
        json.dump(session_log, f, indent=2)
    
    return session_id

def initialize_memory_system():
    """Initialize the persistent memory system."""
    memory_dir = Path.home() / ".claude" / "CodeCognition" / "memory"
    
    # Create memory directories
    ensure_directory(memory_dir / "shared")
    ensure_directory(memory_dir / "agents")
    ensure_directory(memory_dir / "projects")
    ensure_directory(memory_dir / "patterns")
    ensure_directory(memory_dir / "decisions")
    
    # Initialize agent memory files if they don't exist
    agents = [
        "architect", "implementation-engineer", "quality-guardian",
        "devops-orchestrator", "documentation-specialist", "research-analyst",
        "problem-solver", "integration-manager"
    ]
    
    for agent in agents:
        agent_memory_file = memory_dir / "agents" / f"{agent}-memory.json"
        if not agent_memory_file.exists():
            initial_memory = {
                "agent_name": agent,
                "initialized_at": datetime.now().isoformat(),
                "knowledge_areas": [],
                "learned_patterns": [],
                "successful_approaches": [],
                "collaboration_history": []
            }
            with open(agent_memory_file, "w") as f:
                json.dump(initial_memory, f, indent=2)

def load_project_context():
    """Load project-specific context if available."""
    try:
        project_dir = Path(os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd()))
        context_file = project_dir / ".codecognition" / "project-context.json"
        
        if context_file.exists():
            with open(context_file) as f:
                return json.load(f)
    except Exception:
        pass
    
    return {"project_initialized": False}

def create_framework_status():
    """Create framework status for this session."""
    status = {
        "framework_active": True,
        "session_started": datetime.now().isoformat(),
        "agents_available": [
            "architect", "implementation-engineer", "quality-guardian",
            "devops-orchestrator", "documentation-specialist", "research-analyst", 
            "problem-solver", "integration-manager"
        ],
        "communication_enabled": True,
        "memory_system_active": True,
        "hooks_enabled": True
    }
    
    status_file = Path.home() / ".claude" / "CodeCognition" / "framework-status.json"
    with open(status_file, "w") as f:
        json.dump(status, f, indent=2)

def main():
    try:
        # Initialize framework components
        session_id = initialize_communication_system()
        initialize_memory_system()
        project_context = load_project_context()
        create_framework_status()
        
        # Output initialization message
        init_message = {
            "message": "CodeCognition Framework Initialized",
            "session_id": session_id,
            "agents_available": 8,
            "communication_active": True,
            "memory_system_active": True,
            "project_context_loaded": project_context.get("project_initialized", False)
        }
        
        print("🚀 CodeCognition Framework Active")
        print(f"Session: {session_id}")
        print("8 specialized agents ready for coordination")
        
        # Create JSON output for advanced hook processing
        with open("/tmp/codecognition_init.json", "w") as f:
            json.dump(init_message, f, indent=2)
            
    except Exception as e:
        print(f"Error initializing CodeCognition: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()