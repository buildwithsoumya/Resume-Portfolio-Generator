# FolioSnap 

Transform any resume into a modern portfolio website using AI.

FolioSnap is a full-stack application that allows users to upload their resume, extract key information using AI, and instantly generate a professional portfolio website with a live preview and downloadable HTML file.

---

##  Features

###  User Authentication & Dashboard
* Secure JWT-based user authentication (First Name & Last Name integration)
* Personal dashboard to manage, preview, edit, and delete generated portfolios
* Portfolio history is safely stored and easily accessible

###  Modern UI & UX
* **Dark Mode & Light Mode** toggle support with persistent local storage
* Premium **animated gradient background** integrated across the entire application

###  Resume Upload & Analysis
* Upload resumes in PDF format with automatic text extraction via PyMuPDF
* Advanced parsing of resume content using Google's Gemini AI to accurately identify:
  * Personal Information
  * Skills
  * Education
  * Projects
  * Experience
  * Contact Details

###  AI Portfolio Generation
* Powered entirely by **Google Gemini 2.5 Flash** with resilient rate-limit handling and exponential backoff retry logic.
* Multiple portfolio styles:
  * Developer (Technical, clean)
  * Corporate (Professional, grid)
  * Creative (Bold, artistic)
  * Modern Startup (Fresh, dynamic)

###  Live Preview & Editor
* Instant portfolio preview inside the application
* **Live HTML Editor:** Modify the generated content, adjust styling, and refine AI outputs directly from the browser before downloading

###  Download Portfolio
* Download the finalized, customized portfolio as a standalone HTML file ready to be hosted anywhere

---

##  System Architecture

```text
Resume PDF
    │
    ▼
PyMuPDF Text Extraction
    │
    ▼
Gemini Resume Parsing
    │
    ▼
Structured Resume JSON
    │
    ▼
Gemini (2.5 Flash) Generation
    │
    ▼
HTML Portfolio (Saved to SQLite DB)
    │
    ▼
Live Preview + In-browser Live Editor + Download
```

---

##  Tech Stack

### Frontend
* React
* Vite
* React Router DOM (Navigation)
* Tailwind CSS v4 (Clean, minimal, responsive styling)
* Context API (State management)

### Backend
* FastAPI
* Python
* SQLite + SQLAlchemy (Database & ORM)
* PyMuPDF (PDF parsing)
* Pydantic
* Tenacity (Resilient API retries)

### AI
* **Google Gemini API** (Gemini 2.5 Flash)

---

##  Installation

### Clone Repository

```bash
git clone https://github.com/buildwithsoumya/Resume-Portfolio-Generator.git
cd Resume-Portfolio-Generator
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secure_jwt_secret_key_here
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
Swagger Documentation: `http://localhost:8000/docs`

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

Run Frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

##  Usage

1. Create an account or sign in.
2. Upload your resume PDF and select a portfolio style.
3. Click **Generate Portfolio** and wait for the AI to process it.
4. Preview the generated website in the live viewer.
5. Use the **Edit** feature to refine the text, tags, or links.
6. Download the final HTML portfolio and share it with the world!

---

##  Contributing

Contributions, suggestions, and feedback are welcome. Feel free to open issues and submit pull requests.
