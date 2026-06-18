import os
from app.services.openrouter_service import generate_portfolio_html as generate_openrouter
from app.services.portfolio_service import generate_portfolio_html as generate_gemini

def generate_portfolio(resume_data: dict, style: str, plan: dict, provider: str = None) -> str:
    if provider is None:
        provider = os.getenv("LLM_PROVIDER", "openrouter").lower()
    
    if provider == "openrouter":
        try:
            html = generate_openrouter(resume_data, style, plan)
            if html and html != "NO_HTML_GENERATED":
                return html
        except Exception as e:
            print(f"OpenRouter generation failed with error: {e}. Falling back to Gemini.")
            
        # Fallback to Gemini
        return generate_gemini(resume_data, style, plan)
    
    elif provider == "gemini":
        return generate_gemini(resume_data, style, plan)
    
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")
