#!/usr/bin/env python3
"""
CodeCognition Prompt Context Enhancer Hook
==========================================
Enhances user prompts with CodeCognition framework context and agent coordination.
Analyzes prompts for agent assignment opportunities and adds relevant context.
"""

import json
import os
import sys
import re
from datetime import datetime
from pathlib import Path

def load_framework_status():
    """Load current framework status."""
    try:
        status_file = Path.home() / ".claude" / "CodeCognition" / "framework-status.json"
        if status_file.exists():
            with open(status_file) as f:
                return json.load(f)
    except Exception:
        pass
    return {"framework_active": False}

def analyze_prompt_for_agents(prompt_text):
    """Analyze prompt to suggest appropriate agent coordination."""
    agent_suggestions = []
    
    # Architecture keywords
    if re.search(r'\b(architect|design|structure|pattern|system|integration)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "architect",
            "reason": "Architecture/design analysis needed",
            "confidence": 0.8
        })
    
    # Implementation keywords  
    if re.search(r'\b(implement|code|develop|build|create|feature)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "implementation-engineer", 
            "reason": "Implementation work required",
            "confidence": 0.9
        })
    
    # Quality keywords
    if re.search(r'\b(test|security|review|quality|bug|validate)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "quality-guardian",
            "reason": "Quality assurance needed",
            "confidence": 0.8
        })
    
    # DevOps keywords
    if re.search(r'\b(deploy|infrastructure|monitor|performance|scale)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "devops-orchestrator",
            "reason": "Operations/deployment focus",
            "confidence": 0.7
        })
    
    # Documentation keywords
    if re.search(r'\b(document|explain|guide|readme|api)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "documentation-specialist",
            "reason": "Documentation work needed",
            "confidence": 0.8
        })
    
    # Research keywords
    if re.search(r'\b(research|analyze|evaluate|compare|investigate)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "research-analyst",
            "reason": "Research and analysis required",
            "confidence": 0.7
        })
    
    # Problem-solving keywords
    if re.search(r'\b(debug|fix|error|issue|problem|troubleshoot)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "problem-solver",
            "reason": "Debugging/troubleshooting needed",
            "confidence": 0.9
        })
    
    # Coordination keywords
    if re.search(r'\b(coordinate|manage|workflow|process|multiple)\b', prompt_text, re.IGNORECASE):
        agent_suggestions.append({
            "agent": "integration-manager",
            "reason": "Workflow coordination needed",
            "confidence": 0.6
        })
    
    return agent_suggestions

def load_relevant_memory(prompt_text):
    """Load relevant memory based on prompt content."""
    memory_dir = Path.home() / ".claude" / "CodeCognition" / "memory"
    relevant_memory = []
    
    try:
        # Check shared memory for relevant patterns
        shared_dir = memory_dir / "shared"
        if shared_dir.exists():
            for memory_file in shared_dir.glob("*.json"):
                try:
                    with open(memory_file) as f:
                        memory_data = json.load(f)
                        # Simple keyword matching for memory relevance
                        if any(keyword in prompt_text.lower() for keyword in memory_data.get("keywords", [])):
                            relevant_memory.append({
                                "source": memory_file.stem,
                                "content": memory_data.get("summary", ""),
                                "relevance": "shared_knowledge"
                            })
                except Exception:
                    continue
    except Exception:
        pass
    
    return relevant_memory

def create_context_enhancement(prompt_text, agent_suggestions, relevant_memory):
    """Create context enhancement for the prompt."""
    enhancement = {
        "codecognition_context": {
            "framework_active": True,
            "prompt_analysis": {
                "agent_suggestions": agent_suggestions,
                "coordination_recommended": len(agent_suggestions) > 1,
                "parallel_processing_opportunity": len(agent_suggestions) >= 3
            },
            "relevant_memory": relevant_memory,
            "framework_recommendations": []
        }
    }
    
    # Add framework recommendations
    if len(agent_suggestions) > 1:
        enhancement["codecognition_context"]["framework_recommendations"].append(
            "Consider using the Integration Manager to coordinate multiple agents"
        )
    
    if len(agent_suggestions) >= 3:
        enhancement["codecognition_context"]["framework_recommendations"].append(
            "Opportunity for parallel agent execution to maximize efficiency"
        )
    
    return enhancement

def main():
    try:
        # Get hook input
        input_data = json.load(sys.stdin)
        
        # Check if framework is active
        framework_status = load_framework_status()
        if not framework_status.get("framework_active", False):
            sys.exit(0)  # Framework not active, no enhancement needed
        
        # Get prompt text
        prompt_text = input_data.get("user_prompt", "")
        if not prompt_text:
            sys.exit(0)
        
        # Analyze prompt for agent opportunities
        agent_suggestions = analyze_prompt_for_agents(prompt_text)
        
        # Load relevant memory
        relevant_memory = load_relevant_memory(prompt_text)
        
        # Create context enhancement
        if agent_suggestions or relevant_memory:
            enhancement = create_context_enhancement(prompt_text, agent_suggestions, relevant_memory)
            
            # Output enhancement as additional context
            enhancement_json = json.dumps(enhancement, indent=2)
            
            # Log the enhancement for debugging
            log_dir = Path.home() / ".claude" / "CodeCognition" / "communication" / "context"
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            with open(log_dir / f"prompt_enhancement_{timestamp}.json", "w") as f:
                json.dump({
                    "original_prompt": prompt_text,
                    "enhancement": enhancement,
                    "timestamp": datetime.now().isoformat()
                }, f, indent=2)
            
            # Output to hook system
            print(f"CodeCognition Context: {enhancement_json}")

    except Exception as e:
        # Don't fail the prompt on enhancement errors
        print(f"Context enhancement error: {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == "__main__":
    main()