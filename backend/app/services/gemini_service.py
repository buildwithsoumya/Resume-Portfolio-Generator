import os
import json
from pathlib import Path
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_resume_structure(resume_text: str) -> dict:
    prompt_path = Path(__file__).parent.parent / "prompts" / "parser_prompt.txt"
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()
        
    prompt = prompt_template.replace("{resume_text}", resume_text)
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    json_text = response.text.strip().replace("```json", "").replace("```", "")
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        return {}

def enhance_resume_content(resume_data: dict) -> dict:
    prompt_path = Path(__file__).parent.parent / "prompts" / "enhancer_prompt.txt"
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()
        
    prompt = prompt_template.replace("{resume_data}", json.dumps(resume_data, indent=2))
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    json_text = response.text.strip().replace("```json", "").replace("```", "")
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        return resume_data