# src\backend\app\services\llm_service.py

import asyncio
import httpx
from typing import Optional
from app.core.config import settings
from app.utils.prompt_templates import get_prompt_template
from app.utils.mermaid_validator import validate_mermaid_syntax, clean_mermaid_code

class LLMService:
    
    def __init__(self):
        self.base_url = settings.llm_api_url
        self.model = "openai/gpt-oss-20b"
        self.semaphore = asyncio.Semaphore(2)  # Максимум 2 параллельных запроса к LLM
        self.request_queue = asyncio.Queue(maxsize=50)
    
    async def test_connection(self) -> bool:
        """Test connection to LM Studio"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/v1/models", timeout=10)
                print(f"LM Studio connection test: {response.status_code}")
                return response.status_code == 200
        except Exception as e:
            print(f"LM Studio connection failed: {e}")
            return False
    
    async def generate_diagram(self, user_input: str, diagram_type: str, max_retries: int = 2) -> Optional[str]:
        """Generate diagram with queue and retry logic"""
        
        async with self.semaphore:  # Ограничиваем параллельность
            for attempt in range(max_retries + 1):
                try:
                    print(f"LLM request attempt {attempt + 1}/{max_retries + 1}")
                    
                    prompt = get_prompt_template(diagram_type, user_input)
                    
                    payload = {
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are an expert at creating Mermaid diagrams. Always follow the exact format requirements and return only the mermaid code."},
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": 1000,  # Уменьшили для ускорения
                        "temperature": 0.1,  # Понизили для более предсказуемых результатов
                        "stream": False
                    }
                    
                    timeout = httpx.Timeout(45.0)  # Увеличили timeout
                    
                    async with httpx.AsyncClient(timeout=timeout) as client:
                        response = await client.post(
                            f"{self.base_url}/v1/chat/completions",
                            json=payload
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            raw_content = data["choices"][0]["message"]["content"]
                            
                            # Clean and validate the generated code
                            cleaned_code = clean_mermaid_code(raw_content)
                            is_valid, error = validate_mermaid_syntax(cleaned_code, diagram_type)
                            
                            if is_valid or attempt == max_retries:  # Возвращаем результат на последней попытке
                                print(f"Generated {diagram_type} diagram: valid={is_valid}, length={len(cleaned_code)}")
                                return cleaned_code
                            else:
                                print(f"Invalid result on attempt {attempt + 1}, retrying...")
                                await asyncio.sleep(1)  # Пауза перед повтором
                                continue
                        else:
                            print(f"LLM API error on attempt {attempt + 1}: {response.status_code}")
                            if attempt < max_retries:
                                await asyncio.sleep(2 ** attempt)  # Exponential backoff
                                continue
                            else:
                                return None
                                
                except asyncio.TimeoutError:
                    print(f"Timeout on attempt {attempt + 1}")
                    if attempt < max_retries:
                        await asyncio.sleep(5)  # Пауза при таймауте
                        continue
                    else:
                        return None
                except Exception as e:
                    print(f"LLM request failed on attempt {attempt + 1}: {e}")
                    if attempt < max_retries:
                        await asyncio.sleep(2)
                        continue
                    else:
                        return None
            
            return None

llm_service = LLMService()
