import re
from typing import Optional, Tuple

def extract_mermaid_code(text: str) -> str:
    """Extract mermaid code from LLM response"""
    text = text.strip()
    
    # Remove XXXmermaidXXX wrapper if present (заменить XXX на тройные обратные кавычки)
    mermaid_pattern = r'```mermaid\s*(.*?)\s*```'
    match = re.search(mermaid_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    
    # Remove XXX wrapper if present (заменить XXX на тройные обратные кавычки)  
    code_pattern = r'```\s*(.*?)\s*```'
    match = re.search(code_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    
    return text

def validate_mermaid_syntax(code: str, diagram_type: str) -> Tuple[bool, Optional[str]]:
    """Basic validation of mermaid syntax"""
    if not code or not code.strip():
        return False, "Empty code"
    
    code = code.strip()
    
    # Check for diagram type keywords
    type_keywords = {
        "flowchart": ["flowchart"],
        "sequence": ["sequenceDiagram"],
        "class": ["classDiagram"],
        "er": ["erDiagram"],
        "gantt": ["gantt"]
    }
    
    expected_keywords = type_keywords.get(diagram_type, [])
    if expected_keywords:
        has_keyword = any(keyword in code for keyword in expected_keywords)
        if not has_keyword:
            return False, f"Missing {diagram_type} keyword"
    
    # Basic syntax checks
    lines = code.split('\n')
    non_empty_lines = [line.strip() for line in lines if line.strip()]
    
    if len(non_empty_lines) < 2:
        return False, "Too few lines for a valid diagram"
    
    return True, None

def clean_mermaid_code(code: str) -> str:
    """Clean and format mermaid code"""
    code = extract_mermaid_code(code)
    
    # Remove extra whitespace
    lines = []
    for line in code.split('\n'):
        cleaned_line = line.rstrip()
        if cleaned_line or (lines and lines[-1]):
            lines.append(cleaned_line)
    
    # Remove trailing empty lines
    while lines and not lines[-1]:
        lines.pop()
    
    return '\n'.join(lines)
