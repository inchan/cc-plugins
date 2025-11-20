#!/usr/bin/env python3
"""
Intent analyzer for Claude Code tool type recommendation.

Analyzes user request and recommends the optimal tool type
(Command, Skill, Subagent, or Hook) based on keywords and patterns.

Usage:
    python analyze_intent.py "user request description"

Example:
    python analyze_intent.py "I want to automate code formatting after edits"
    # Output: Recommended tool type: Hook (PostToolUse)
"""

import sys
import re
from typing import Tuple, List, Dict

# Intent patterns for each tool type
PATTERNS: Dict[str, Dict[str, List[str]]] = {
    "command": {
        "keywords": [
            "shortcut", "command", "slash command", "workflow",
            "prompt", "template", "abbreviate", "frequently",
            "repeatedly", "type", "invoke", "quick"
        ],
        "intent_patterns": [
            r"(create|make|add).*?(shortcut|command)",
            r"(shortcut|command).*?for",
            r"type.*?(frequently|repeatedly|often)",
            r"abbreviate.*?prompt",
            r"workflow.*?(shortcut|command)"
        ]
    },
    "skill": {
        "keywords": [
            "knowledge", "expertise", "domain", "specialized",
            "schema", "documentation", "references", "scripts",
            "assets", "bundle", "package", "onboard", "understand"
        ],
        "intent_patterns": [
            r"(understand|know|learn).*?(database|schema|API|domain)",
            r"(add|provide).*?(knowledge|expertise)",
            r"(bundle|package).*?(scripts|references|assets)",
            r"(specialized|domain).*?(knowledge|expertise)"
        ]
    },
    "subagent": {
        "keywords": [
            "agent", "reviewer", "scanner", "analyzer", "checker",
            "focused", "parallel", "restricted", "permissions",
            "isolated", "specialized agent"
        ],
        "intent_patterns": [
            r"(create|make).*?(agent|reviewer|scanner|checker)",
            r"(parallel|multiple).*?(review|analysis|check)",
            r"(focused|specialized).*?agent",
            r"(restrict|limit).*?permissions",
            r"review.*?(code|security|performance)"
        ]
    },
    "hook": {
        "keywords": [
            "automate", "automatic", "event", "trigger",
            "after edit", "before commit", "on stop", "validate",
            "lint", "format", "protect", "block", "enforce"
        ],
        "intent_patterns": [
            r"(automate|automatic).*?(after|before|on)",
            r"(after|before|on).*?(edit|write|stop|commit)",
            r"(validate|check|lint|format).*?(automatic|every)",
            r"(protect|block|prevent).*?(file|edit)",
            r"event.*?(driven|trigger)"
        ]
    }
}

# Event type suggestions for hooks
HOOK_EVENTS = {
    "before": "PreToolUse",
    "pre": "PreToolUse",
    "validate": "PreToolUse",
    "block": "PreToolUse",
    "protect": "PreToolUse",
    "after": "PostToolUse",
    "post": "PostToolUse",
    "format": "PostToolUse",
    "lint": "PostToolUse",
    "stop": "Stop",
    "finish": "Stop",
    "complete": "Stop",
    "test": "Stop",
    "prompt": "UserPromptSubmit",
    "submit": "UserPromptSubmit",
    "session": "SessionStart",
    "start": "SessionStart",
    "init": "SessionStart"
}


def analyze_intent(request: str) -> Tuple[str, float, str]:
    """
    Analyze user request and return recommended tool type.

    Args:
        request: User's description of what they want to create

    Returns:
        Tuple of (tool_type, confidence, explanation)
    """
    request_lower = request.lower()
    scores: Dict[str, float] = {
        "command": 0.0,
        "skill": 0.0,
        "subagent": 0.0,
        "hook": 0.0
    }

    # Score based on keywords
    for tool_type, patterns in PATTERNS.items():
        for keyword in patterns["keywords"]:
            if keyword in request_lower:
                scores[tool_type] += 1.0

        # Score based on intent patterns (weighted higher)
        for pattern in patterns["intent_patterns"]:
            if re.search(pattern, request_lower):
                scores[tool_type] += 2.0

    # Find highest scoring tool type
    max_score = max(scores.values())

    if max_score == 0:
        return ("uncertain", 0.0, "Could not determine tool type. Please provide more details.")

    # Get all tool types with max score
    top_types = [t for t, s in scores.items() if s == max_score]

    # If tie, use priority order
    priority = ["hook", "subagent", "skill", "command"]
    for tool_type in priority:
        if tool_type in top_types:
            recommended = tool_type
            break
    else:
        recommended = top_types[0]

    # Calculate confidence
    total_score = sum(scores.values())
    confidence = max_score / total_score if total_score > 0 else 0

    # Generate explanation
    explanation = generate_explanation(recommended, request_lower)

    return (recommended, confidence, explanation)


def generate_explanation(tool_type: str, request: str) -> str:
    """Generate explanation for recommendation."""

    explanations = {
        "command": (
            "Slash Command recommended.\n"
            "Reason: User-invoked shortcut for prompts or workflows.\n"
            "Use: python3 init_command.py NAME 'DESCRIPTION' --template TEMPLATE"
        ),
        "skill": (
            "Skill recommended.\n"
            "Reason: Domain expertise with bundled resources (scripts, references, assets).\n"
            "Use: python3 init_skill.py NAME --path .claude/skills"
        ),
        "subagent": (
            "Subagent recommended.\n"
            "Reason: Focused AI agent with specific responsibility and restricted permissions.\n"
            "Use: python3 init_subagent.py NAME 'DESCRIPTION' --template TEMPLATE --tools 'TOOLS'"
        ),
        "hook": (
            "Hook recommended.\n"
            "Reason: Event-driven automation triggered by system events.\n"
            "Use: python3 init_hook.py NAME --event EVENT --path .claude/hooks"
        )
    }

    base = explanations.get(tool_type, "Unknown tool type")

    # Add event suggestion for hooks
    if tool_type == "hook":
        event = suggest_hook_event(request)
        if event:
            base += f"\nSuggested event: {event}"

    return base


def suggest_hook_event(request: str) -> str:
    """Suggest appropriate hook event based on request."""
    for keyword, event in HOOK_EVENTS.items():
        if keyword in request:
            return event
    return "PostToolUse"  # Default


def print_analysis(request: str) -> None:
    """Print formatted analysis results."""
    tool_type, confidence, explanation = analyze_intent(request)

    print("\n" + "=" * 60)
    print("TOOL TYPE ANALYSIS")
    print("=" * 60)
    print(f"\nRequest: {request}")
    print(f"\nRecommended: {tool_type.upper()}")
    print(f"Confidence: {confidence:.0%}")
    print(f"\n{explanation}")
    print("\n" + "=" * 60)

    # Print alternative suggestions if confidence is low
    if confidence < 0.5:
        print("\nNote: Low confidence. Consider these questions:")
        print("- Is this triggered by user or event?")
        print("- Does it need bundled resources?")
        print("- Should it have restricted permissions?")
        print("- Does it need Claude's intelligence?")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    request = " ".join(sys.argv[1:])
    print_analysis(request)


if __name__ == "__main__":
    main()
