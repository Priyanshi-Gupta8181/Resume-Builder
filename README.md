# Resume Builder - Corrected Complete Version

A React/Vite resume builder with a Node/Express backend and MiKTeX `pdflatex` PDF generation.

## Features

- Modern resume template with profile photo at the top-right.
- Fixed-size profile photo box with a light border.
- Career Objective.
- Work Experience.
- Education.
- Projects.
- Certifications.
- Technical Skills.
- Soft Skills.
- Achievements.
- Custom Sections.
- JPG/JPEG/PNG profile photo upload.
- Functional React state updates so text input does not lose focus after every character.
- Detailed LaTeX error output in the backend terminal.

## Required Software

- Node.js
- MiKTeX with `pdflatex`

## Run the backend

Open Terminal 1:

```bash
cd server
npm install
node server.js
```

You should see:

```text
Server running on http://localhost:5000
```

## Run the frontend

Open Terminal 2:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## Important PDF Fix

The generated LaTeX uses a single-line `enumitem` configuration:

```latex
\\setlist[itemize]{leftmargin=1.25em,itemsep=1.2pt,topsep=2.5pt,parsep=0pt,partopsep=0pt}
```

Do not insert blank lines inside the `\\setlist[itemize]{...}` argument. Blank lines there cause:

```text
Paragraph ended before \\enit@setlist@i was complete.
```

## Profile Photo

The backend saves the uploaded image as `profile_photo.jpg` or `profile_photo.png` inside `server/templates` before generating `resume.tex`. The Modern template then places it in a fixed 1.08in × 1.30in bordered box.

## Project Order

1. Career Objective
2. Work Experience
3. Education
4. Projects
5. Certifications
6. Technical Skills
7. Soft Skills
8. Achievements
9. Custom Sections
