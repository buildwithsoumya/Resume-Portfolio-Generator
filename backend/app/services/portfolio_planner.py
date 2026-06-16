import os
import json
from pathlib import Path
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_portfolio_plan(resume_data: dict) -> dict:
    prompt_path = Path(__file__).parent.parent / "prompts" / "planner_prompt.txt"
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
        return {
            "portfolio_type": "Unknown",
            "primary_focus": "General",
            "sections": ["hero", "about", "projects", "experience", "education", "contact"]
        }
