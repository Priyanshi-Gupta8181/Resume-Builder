# Resume Builder

A full-stack **Resume Builder web application** that allows users to create professional resumes using **Modern** and **ATS-friendly** templates and download them as PDF files.

---

## 🚀 Live Demo

**Live Website:**  
https://resumebuilder-ten-alpha.vercel.app/

**GitHub Repository:**  
https://github.com/Priyanshi-Gupta8181/Resume-Builder

---

## ✨ Features

- Modern and ATS-friendly resume templates
- Profile photo support in the Modern template
- Dynamic resume form
- Add and remove multiple entries dynamically
- Work Experience section
- Education section
- Projects section
- Certifications section
- Technical Skills section
- Soft Skills section
- Achievements section
- Custom Sections
- Professional PDF generation
- LaTeX-based resume generation
- Responsive design for desktop, tablet, and mobile
- Separate frontend and backend architecture
- GitHub-based deployment
- Vercel frontend deployment
- Render backend deployment
- Docker support for backend and LaTeX environment

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- CORS

### PDF Generation

- LaTeX
- pdflatex
- MiKTeX / TeX Live
- Font Awesome

### Deployment

- GitHub
- Vercel
- Render
- Docker

---

## 📁 Project Structure

```text
Resume-Builder/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
├── server/
│   ├── templates/
│   │   ├── modern.tex
│   │   └── ats.tex
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 💻 How to Run Project in VS Code

To run the project locally in **Visual Studio Code**, start the **Frontend** and **Backend** in two separate terminals.

## 🔹 Frontend

Open a terminal in VS Code and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open this URL in your browser.

---

## 🔹 Backend

Open a **second terminal** in VS Code and run:

```bash
cd server
npm install
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

Keep this terminal running.

---

## ⚡ Quick Run Commands

### Frontend Terminal

```bash
cd client
npm install
npm run dev
```

### Backend Terminal

```bash
cd server
npm install
node server.js
```

### Run Order

```text
1. Open VS Code
2. Open the Resume-Builder project
3. Open Terminal 1 → Start Frontend
4. Open Terminal 2 → Start Backend
5. Open http://localhost:5173 in the browser
```

Both terminals should remain open while using the application.

---

# 🔄 Application Workflow

```text
User enters resume details
        ↓
React Frontend
        ↓
Axios sends resume data
        ↓
Node.js / Express Backend
        ↓
Backend creates LaTeX resume
        ↓
pdflatex compiles the LaTeX file
        ↓
PDF Resume is generated
        ↓
User downloads the resume
```

---

# 📄 Resume Templates

## Modern Template

The Modern template provides a professional visual layout and supports a profile photo.

It includes:

- Personal Information
- Profile Photo
- Career Objective
- Work Experience
- Education
- Projects
- Certifications
- Technical Skills
- Soft Skills
- Achievements
- Custom Sections

## ATS Template

The ATS template provides a clean and structured resume format designed for easy readability and ATS compatibility.

It includes:

- Personal Information
- Career Objective
- Work Experience
- Education
- Projects
- Certifications
- Technical Skills
- Soft Skills
- Achievements
- Custom Sections

---

# 📱 Responsive Design

The application is responsive and works on:

- Desktop
- Laptop
- Tablet
- Mobile Phone

The layout automatically adjusts according to the screen size.

---

# 🐳 Run Backend Using Docker

The backend can also be run using Docker.

Go to the server folder:

```bash
cd server
```

Build the Docker image:

```bash
docker build -t resume-builder-server .
```

Run the Docker container:

```bash
docker run -p 5000:5000 resume-builder-server
```

The backend will be available at:

```text
http://localhost:5000
```

---

# ☁️ Deployment

The project uses the following deployment architecture:

```text
GitHub
   │
   ├── Vercel
   │      ↓
   │   React Frontend
   │
   └── Render
          ↓
      Node.js Backend
          ↓
      Docker + LaTeX
          ↓
      PDF Generation
```

## Frontend

Hosted on Vercel:

https://resumebuilder-ten-alpha.vercel.app/

## Backend

Hosted on Render:

https://resume-builder-f0et.onrender.com

---

# 🔗 API Endpoints

## Generate Resume

```http
POST /generate-resume
```

This endpoint receives resume information from the frontend and generates the resume PDF.

## Download Resume

```http
GET /download-resume
```

This endpoint is used to download the generated PDF resume.

---

# ⚙️ Requirements

Before running the project locally, make sure the following are installed:

- Node.js
- npm
- Git
- Visual Studio Code

For Docker-based backend execution:

- Docker Desktop

For local LaTeX PDF generation:

- MiKTeX or TeX Live

---

# 🚀 Clone the Repository

Clone the repository:

```bash
git clone https://github.com/Priyanshi-Gupta8181/Resume-Builder.git
```

Move into the project folder:

```bash
cd Resume-Builder
```

Open the project in VS Code:

```bash
code .
```

Then follow the **How to Run Project in VS Code** section above.

---

# 🐞 Common Issues

## Backend is not starting

Make sure you are inside the `server` folder:

```bash
cd server
```

Then run:

```bash
npm install
node server.js
```

## Frontend is not starting

Make sure you are inside the `client` folder:

```bash
cd client
```

Then run:

```bash
npm install
npm run dev
```

## Resume PDF is not generating

Make sure:

- Backend terminal is running
- Frontend terminal is running
- Backend is running on port `5000`
- Frontend is running on port `5173`
- Both terminals are kept open

---

# 📌 Future Improvements

- More resume templates
- Resume preview before PDF generation
- User authentication
- Save resumes online
- Resume editing after generation
- More customization options
- Additional PDF styling options
- Resume data persistence

---

# 👩‍💻 Author

**Priyanshi Gupta**