import fitz
def extract_text_from_pdf(pdf_path: str) -> str:
    document = fitz.open(pdf_path)
    extracted_text = []
    for page in document:
        extracted_text.append(page.get_text())
    document.close()
    text = "\n".join(extracted_text).strip()
    if not text:
        raise ValueError(
            "No text could be extracted"
        )
    return text