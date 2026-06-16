def check_portfolio_quality(html: str, resume_data: dict) -> dict:
    """
    Checks if generated HTML meets quality standards.
    Verify: name exists, at least one project shown, skills rendered, contact section present
    """
    score = 100
    missing = []
    
    html_lower = html.lower()
    
    # Check name exists (very loose check)
    name = resume_data.get("name", "")
    if name and name.lower() not in html_lower:
        score -= 20
        missing.append("name")
        
    # Check projects rendered
    if 'data-list="projects"' not in html_lower and "project" not in html_lower:
        score -= 20
        missing.append("projects")
        
    # Check skills rendered
    if 'data-list="skills"' not in html_lower and "skill" not in html_lower:
        score -= 10
        missing.append("skills")
        
    # Check contact section present
    if 'data-editable="contact"' not in html_lower and "contact" not in html_lower and "@" not in html_lower:
        score -= 10
        missing.append("contact")

    return {
        "quality_score": score,
        "is_acceptable": score >= 70,
        "missing_elements": missing
    }
