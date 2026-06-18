import os
import json
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
)

def get_style_guidance(style: str) -> str:
    style = style.lower()
    if style == "developer":
        return "- GitHub inspired\n- Technical\n- Project focused"
    elif style == "corporate":
        return "- Executive\n- Experience focused"
    elif style == "creative":
        return "- Modern\n- Visual\n- Portfolio focused"
    elif style == "student":
        return "- Education first\n- Project heavy"
    return "- Professional layout"

def generate_portfolio_html(resume_data: dict, portfolio_style: str, portfolio_plan: dict) -> str:
    prompt_path = Path(__file__).parent.parent / "prompts" / "portfolio_generator_prompt.txt"
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()
    
    prompt = prompt_template.replace("{portfolio_style}", portfolio_style)
    prompt = prompt.replace("{style_guidance}", get_style_guidance(portfolio_style))
    prompt = prompt.replace("{portfolio_plan}", json.dumps(portfolio_plan, indent=2))
    prompt = prompt.replace("{resume_data}", json.dumps(resume_data, indent=2))
    
    model = os.getenv("PORTFOLIO_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4096,
        )
        
        content = response.choices[0].message.content
        if not content:
            return "NO_HTML_GENERATED"
            
        html = content.strip()
        html = html.replace("```html", "")
        html = html.replace("```", "")
        return html
    except Exception as e:
        print(f"OpenRouter API Error: {e}")
        raise e
