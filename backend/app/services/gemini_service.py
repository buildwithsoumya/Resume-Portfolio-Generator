import os
import json
from google import genai
from dotenv import load_dotenv
load_dotenv()
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
def extract_resume_structure(
    resume_text: str
):
    prompt = f"""
You are an expert resume parser.
Extract the resume into this JSON format.
Return ONLY valid JSON.
{{
  "name":"",
  "title":"",
  "summary":"",
  "skills":[],
  "education":[
    {{
      "degree":"",
      "institution":""
    }}
  ],
  "projects":[
    {{
      "name":"",
      "description":""
    }}
  ],
  "experience":[],
  "links":[]
}}
Resume:
{resume_text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    json_text = response.text.strip()
    json_text = json_text.replace(
        "```json",
        ""
    )
    json_text = json_text.replace(
        "```",
        ""
    )
    return json.loads(json_text)