# src/backend/utils/mermaid_cleaner.py
import re
from typing import Tuple

class MermaidCleaner:
    
    MERMAID_TYPES = [
        'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
        'erDiagram', 'gitgraph', 'pie', 'journey', 'gantt'
    ]
    
    GARBAGE_PATTERNS = [
        r'^.*?(?=graph|sequenceDiagram|classDiagram|erDiagram|gitgraph|pie|journey|gantt)',
        r'Need.*?(?=graph|sequenceDiagram|classDiagram)',
        r'Maybe.*?(?=graph|sequenceDiagram|classDiagram)',
        r'Let\'s.*?(?=graph|sequenceDiagram|classDiagram)',
        r'Use.*?(?=graph|sequenceDiagram|classDiagram)',
        r'^[^g|^s|^c|^e|^p|^j]*(?=graph|sequenceDiagram|classDiagram|erDiagram|pie|journey|gantt)'
    ]
    
    @staticmethod
    def clean_streaming_chunk(content: str) -> str:
        """Очищает чанк во время стриминга"""
        if not content.strip():
            return ""
        
        # Фильтруем мусорные слова в реальном времени
        garbage_words = ['need', 'maybe', 'let', 'use', 'showing', 'steps', 'etc']
        content_lower = content.lower()
        
        for word in garbage_words:
            if word in content_lower:
                return ""  # не отправляем этот чанк
        
        return content
    
    @staticmethod
    def extract_clean_diagram(text: str) -> Tuple[str, bool]:
        """Извлекает чистую диаграмму из текста"""
        if not text.strip():
            return "", False
        
        # Ищем начало диаграммы
        for diagram_type in MermaidCleaner.MERMAID_TYPES:
            pattern = rf'({diagram_type}.*)'
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            if match:
                clean_code = match.group(1).strip()
                # Дополнительная очистка
                clean_code = MermaidCleaner._post_clean(clean_code)
                return clean_code, True
        
        return text.strip(), False
    
    @staticmethod
    def _post_clean(code: str) -> str:
        """Дополнительная очистка кода"""
        lines = code.split('\n')
        clean_lines = []
        
        for line in lines:
            line = line.strip()
            if line and not any(garbage in line.lower() for garbage in 
                              ['need', 'maybe', 'let', 'use', 'showing', 'etc']):
                clean_lines.append(line)
        
        return '\n'.join(clean_lines)
    
    @staticmethod
    def validate_diagram(code: str) -> bool:
        """Проверяет валидность диаграммы"""
        if not code.strip():
            return False
        
        # Проверяем начинается ли с типа диаграммы
        first_line = code.strip().split('\n')[0].lower()
        return any(dtype in first_line for dtype in MermaidCleaner.MERMAID_TYPES)
