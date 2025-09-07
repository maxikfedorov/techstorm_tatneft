from typing import Dict, Tuple

# Системные промпты для каждого типа диаграммы
SYSTEM_PROMPTS: Dict[str, str] = {
    "flowchart": """You are an expert at creating Mermaid flowchart diagrams. You specialize in:
- Process flows and decision trees
- Clear logical sequences with proper node shapes
- Using [] for processes, {} for decisions, () for events
- Proper arrow connections and labels
Always return ONLY valid Mermaid flowchart code.""",

    "sequence": """You are an expert at creating Mermaid sequence diagrams. You specialize in:
- Actor interactions and message flows
- Proper activation boxes and lifelines
- Clear participant definitions
- Synchronous and asynchronous message patterns
Always return ONLY valid Mermaid sequenceDiagram code.""",

    "class": """You are an expert at creating Mermaid class diagrams. You specialize in:
- Object-oriented design and relationships
- Proper class notation with attributes and methods
- Inheritance, composition, and association relationships
- Access modifiers and data types
Always return ONLY valid Mermaid classDiagram code.""",

    "er": """You are an expert at creating Mermaid Entity-Relationship diagrams. You specialize in:
- Database design and entity modeling
- Proper relationship cardinality notation
- Primary keys, foreign keys, and attributes
- Normalized data structures
Always return ONLY valid Mermaid erDiagram code.""",

    "gantt": """You are an expert at creating Mermaid Gantt charts. You specialize in:
- Project timeline planning and task scheduling
- Proper date formats and dependencies
- Section organization and milestone tracking
- Realistic timeframes and task relationships
Always return ONLY valid Mermaid gantt code."""
}

PROMPT_TEMPLATES: Dict[str, str] = {
    "flowchart": """Create a flowchart diagram in Mermaid format for: {user_input}

Requirements:
- Use flowchart TD (top-down) syntax
- Include start and end nodes
- Use appropriate shapes: [] for processes, {{}} for decisions, () for events
- Keep node IDs short (A, B, C, etc.)
- Make text concise but clear
- Show clear decision paths with Yes/No labels

Generate the diagram:""",

    "sequence": """Create a sequence diagram in Mermaid format for: {user_input}

Requirements:
- Use sequenceDiagram syntax
- Include relevant participants/actors
- Show message flow with arrows (->>, -->>)
- Use proper activation boxes where needed
- Keep participant names short but descriptive
- Include both requests and responses

Generate the diagram:""",

    "class": """Create a class diagram in Mermaid format for: {user_input}

Requirements:
- Use classDiagram syntax
- Include class names, attributes, and methods
- Show relationships between classes (inheritance, association)
- Use proper notation: + public, - private, # protected
- Include data types for attributes and return types for methods
- Keep class names meaningful but concise

Generate the diagram:""",

    "er": """Create an Entity-Relationship diagram in Mermaid format for: {user_input}

Requirements:
- Use erDiagram syntax
- Include entities and their attributes
- Show relationships between entities with proper cardinality
- Mark primary keys (PK) and foreign keys (FK)
- Use appropriate data types
- Keep entity names clear and descriptive

Generate the diagram:""",

    "gantt": """Create a Gantt chart in Mermaid format for: {user_input}

Requirements:
- Use gantt syntax
- Include project title and logical sections
- Show tasks with proper date ranges
- Use realistic timeframes
- Include task dependencies where appropriate
- Keep task names concise but descriptive

Generate the diagram:"""
}

def get_system_prompt(diagram_type: str) -> str:
    """Get system prompt for specific diagram type"""
    return SYSTEM_PROMPTS.get(diagram_type, SYSTEM_PROMPTS["flowchart"])

def get_prompt_template(diagram_type: str, user_input: str) -> str:
    """Get formatted prompt template for diagram type"""
    template = PROMPT_TEMPLATES.get(diagram_type, PROMPT_TEMPLATES["flowchart"])
    return template.format(user_input=user_input)

def get_available_diagram_types() -> list:
    """Get list of available diagram types"""
    return list(PROMPT_TEMPLATES.keys())
