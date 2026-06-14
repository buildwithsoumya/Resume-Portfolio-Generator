# FolioSnap 

Transform any resume into a modern portfolio website using AI.

FolioSnap is a full-stack application that allows users to upload their resume, extract key information using AI, and instantly generate a professional portfolio website with a live preview and downloadable HTML file.

---

##  Features

###  Resume Upload

* Upload resumes in PDF format
* Drag-and-drop support
* File validation and error handling

###  Resume Analysis

* Extracts text from PDFs using PyMuPDF
* Parses resume content using Google's Gemini AI
* Identifies:

  * Personal Information
  * Skills
  * Education
  * Projects
  * Experience
  * Contact Details

###  Portfolio Generation

* AI-generated portfolio websites
* Multiple portfolio styles

  * Developer
  * Corporate
  * Creative
  * Student
* Responsive design
* Dark/Light mode support

###  Live Preview

* Instant portfolio preview inside the application
* No manual setup required

### ⬇ Download Portfolio

* Download generated portfolio as a standalone HTML file
* Share or host anywhere

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
Gemini Portfolio Generation
    │
    ▼
HTML Portfolio
    │
    ▼
Live Preview + Download
```

---

##  Tech Stack

### Frontend

* React
* Vite
* Axios
* Tailwind CSS
* React Dropzone

### Backend

* FastAPI
* Python
* PyMuPDF
* Pydantic

### AI

* Google Gemini 2.5 Flash

### Development Tools

* Git
* GitHub

---

##  Project Structure

```text
Resume-Portfolio-Generator/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

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
GEMINI_API_KEY=YOUR_API_KEY
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Run Frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

##  Usage

1. Upload your resume PDF.
2. Select a portfolio style.
3. Click **Generate Portfolio**.
4. Wait for AI processing.
5. Preview the generated website.
6. Download the HTML portfolio.

---

##  Future Improvements

* Portfolio editing before download
* Multiple premium portfolio templates
* User authentication
* Portfolio history and storage

---

##  Contributing

Contributions, suggestions, and feedback are welcome.

Feel free to open issues and submit pull requests.

---

