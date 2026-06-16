import os
import json
from pathlib import Path
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_portfolio_html(resume_data: dict, portfolio_style: str, portfolio_plan: dict) -> str:
    prompt_path = Path(__file__).parent.parent / "prompts" / "generator_prompt.txt"
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()
    
    prompt = prompt_template.replace("{portfolio_style}", portfolio_style)
    prompt = prompt.replace("{portfolio_plan}", json.dumps(portfolio_plan, indent=2))
    prompt = prompt.replace("{resume_data}", json.dumps(resume_data, indent=2))
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        if not response.text:
            return "NO_HTML_GENERATED"
            
        html = response.text.strip()
        html = html.replace("```html", "")
        html = html.replace("```", "")
        return html
    except Exception as e:
        print(f"Error generating HTML: {e}")
        raise e