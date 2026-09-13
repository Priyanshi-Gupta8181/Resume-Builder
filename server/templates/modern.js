function esc(value = "") {
  return String(value)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function url(value = "") {
  return String(value)
    .trim()
    .replace(/\\/g, "")
    .replace(/([_%#&{}])/g, "\\$1");
}

function filled(value) {
  return (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  );
}

function dateText(value = "") {
  if (!value) return "";

  const parts = String(value).split("-");

  return parts.length === 3
    ? `${parts[1]}/${parts[0]}`
    : String(value);
}

function bulletItems(value = "") {
  return String(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `\\item ${esc(item)}`)
    .join("\n");
}

function section(title, body) {
  return `\\sectionheading{${esc(title)}}\n${body}`;
}

module.exports = function modernTemplate(data = {}) {
  const form = data.formData || {};

  // =========================================================
  // DATA
  // =========================================================

  const experience = Array.isArray(data.experience)
    ? data.experience.filter(Boolean)
    : [];

  const education = Array.isArray(data.education)
    ? data.education.filter(Boolean)
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects.filter(Boolean)
    : [];

  const certifications = Array.isArray(data.certifications)
    ? data.certifications.filter(Boolean)
    : [];

  const technicalSkills = Array.isArray(
    data.technicalSkills || data.skills
  )
    ? (data.technicalSkills || data.skills).filter(Boolean)
    : [];

  const softSkills = Array.isArray(data.softSkills)
    ? data.softSkills.filter(Boolean)
    : [];

  const achievements = Array.isArray(data.achievements)
    ? data.achievements.filter(Boolean)
    : [];

  const customSections = Array.isArray(data.customSections)
    ? data.customSections.filter(
        (item) =>
          item &&
          (filled(item.heading) || filled(item.content))
      )
    : [];

  // =========================================================
  // PROFILE PHOTO
  // =========================================================

  const photo = data.photoFile
    ? String(data.photoFile).trim()
    : "";

  // =========================================================
  // HEADER CONTACT DETAILS
  // =========================================================

  const addressLine = form.address
    ? `\\faMapMarker*\\ ${esc(form.address)}`
    : "";

  const phoneLine = [
    form.phone &&
      `\\faPhone\\ ${esc(form.phone)}`,

    form.alternatePhone &&
      `\\faPhone\\ ${esc(form.alternatePhone)}`
  ]
    .filter(Boolean)
    .join("\\hspace{0.28cm}");

  const emailLine = [
    form.email &&
      `\\faEnvelope\\ \\href{mailto:${url(
        form.email
      )}}{${esc(form.email)}}`,

    form.alternateEmail &&
      `\\faEnvelope\\ \\href{mailto:${url(
        form.alternateEmail
      )}}{${esc(form.alternateEmail)}}`
  ]
    .filter(Boolean)
    .join("\\hspace{0.28cm}");

  const linkedin = String(
    form.linkedin || ""
  ).trim();

  const linkedinLabel = linkedin
    .replace(
      /^https?:\/\/(www\.)?linkedin\.com\/in\//i,
      ""
    )
    .replace(/\/$/, "");

  const linkedinLine = linkedin
    ? `\\faLinkedin\\ \\href{${url(
        linkedin
      )}}{${esc(linkedinLabel || "LinkedIn")}}`
    : "";

  const github = String(
    form.github || ""
  ).trim();

  const githubLabel = github
    .replace(
      /^https?:\/\/(www\.)?github\.com\//i,
      ""
    )
    .replace(/\/$/, "");

  const githubLine = github
    ? `\\faGithub\\ \\href{${url(
        github
      )}}{${esc(githubLabel || "GitHub")}}`
    : "";

  // =========================================================
  // RESUME BODY
  // =========================================================

  let body = "";

  // =========================================================
  // 1. CAREER OBJECTIVE
  // =========================================================

  if (filled(form.summary)) {
    body += section(
      "Career Objective",
      `{\\fontsize{9.4}{11.8}\\selectfont ${esc(
        form.summary
      )}}\\par\n`
    );
  }

  // =========================================================
  // 2. WORK EXPERIENCE
  // =========================================================

  if (experience.length) {
    const entries = experience
      .map((item) => {
        const dates =
          `${dateText(item.startDate)}` +
          `${
            filled(item.startDate) ||
            filled(item.endDate)
              ? " -- "
              : ""
          }` +
          `${dateText(item.endDate)}`;

        let entry =
          `\\Needspace{5\\baselineskip}\n`;

        // ROLE + DATE
        entry +=
          `\\begin{tabularx}{\\textwidth}{@{}X r@{}}\n`;

        entry +=
          `{\\fontsize{10.3}{12.2}\\selectfont` +
          `\\bfseries ${esc(item.role || "")}}`;

        if (dates.trim()) {
          entry +=
            ` & {\\fontsize{8.4}{10}\\selectfont ` +
            `${esc(dates)}}`;
        } else {
          entry += " & ";
        }

        entry +=
          `\\end{tabularx}\\par\n`;

        // COMPANY + LOCATION
        if (
          filled(item.company) ||
          filled(item.location)
        ) {
          entry +=
            `{\\fontsize{9}{11}\\selectfont` +
            `\\bfseries\\color{muted} ` +
            `${esc(item.company || "")}`;

          if (filled(item.location)) {
            entry +=
              `\\hfill ` +
              `{\\fontsize{8.3}{10}\\selectfont` +
              `\\color{muted} ${esc(item.location)}}`;
          }

          entry += `}\\vspace{-0.05cm}\\par\n`;
        }

        // DESCRIPTION
        if (filled(item.description)) {
          entry +=
            `\\begin{itemize}\n` +
            `${bulletItems(item.description)}\n` +
            `\\end{itemize}\n`;
        }

        return entry;
      })
      .join("\\vspace{.12cm}\n");

    body += section(
      "Work Experience",
      entries
    );
  }

  // =========================================================
  // 3. EDUCATION
  // =========================================================

  if (education.length) {
    const entries = education
      .map((item) => {
        let entry =
          `\\Needspace{4.5\\baselineskip}\n`;

        // INSTITUTE + PASSING YEAR
        entry +=
          `\\begin{tabularx}{\\textwidth}{@{}X r@{}}\n`;

        entry +=
          `{\\fontsize{10.3}{12.2}\\selectfont` +
          `\\bfseries ${esc(item.college || "")}}`;

        if (filled(item.year)) {
          entry +=
            ` & {\\fontsize{8.4}{10}\\selectfont ` +
            `${esc(item.year)}}`;
        } else {
          entry += " & ";
        }

        entry +=
  `\\end{tabularx}\\vspace{-0.05cm}\\par\n`;

        // DEGREE + CGPA + ADDRESS
        let leftText = "";

        if (filled(item.degree)) {
          leftText = esc(item.degree);
        }

        if (filled(item.cgpa)) {
          let scoreLabel = "CGPA";

          if (item.scoreType === "Percentage") {
            scoreLabel = "Percentage";
          }

          if (item.scoreType === "Score") {
            scoreLabel = "Score";
          }

          if (leftText) {
            leftText += " - ";
          }

          leftText +=
            `${scoreLabel}: ${esc(item.cgpa)}`;

          if (item.scoreType === "Percentage") {
            leftText += "\\%";
          }
        }

        if (
          filled(leftText) ||
          filled(item.location)
        ) {
          entry +=
            `\\begin{tabularx}{\\textwidth}{@{}X r@{}}\n`;

          entry +=
            `{\\fontsize{9.2}{11}\\selectfont ` +
            `${leftText}}`;

          if (filled(item.location)) {
            entry +=
              ` & {\\fontsize{8.5}{10.5}\\selectfont ` +
              `${esc(item.location)}}`;
          } else {
            entry += " & ";
          }

          entry +=
            `\\end{tabularx}\\par\n`;
        }

        return entry;
      })
      .join("\\vspace{.12cm}\n");

    body += section(
      "Education",
      entries
    );
  }

  // =========================================================
  // 4. PROJECTS
  // =========================================================

  if (projects.length) {
    const entries = projects
      .map((item) => {
        let entry =
          `\\Needspace{5.5\\baselineskip}\n`;

        // PROJECT NAME + TECHNOLOGY + DATE
        entry +=
          `\\begin{tabularx}{\\textwidth}{@{}X r@{}}\n`;

        let projectTitle =
          `{\\fontsize{10.3}{12.2}\\selectfont` +
          `\\bfseries ${esc(item.title || "")}`;

        if (filled(item.tech)) {
          projectTitle +=
            `\\hspace{0.22cm}` +
            `{\\fontsize{9.2}{11}\\selectfont` +
            `\\color{muted}\\textbar\\hspace{0.22cm}` +
            `\\itshape ${esc(item.tech)}}`;
        }

        projectTitle += "}";

        entry += projectTitle;

        if (
          filled(item.startDate) ||
          filled(item.endDate)
        ) {
          const dates =
            `${dateText(item.startDate)}` +
            `${
              filled(item.startDate) ||
              filled(item.endDate)
                ? " -- "
                : ""
            }` +
            `${dateText(item.endDate)}`;

          entry +=
            ` & {\\fontsize{8.4}{10}\\selectfont ` +
            `${esc(dates)}}`;
        } else {
          entry += " & ";
        }

        entry +=
  `\\end{tabularx}\\vspace{-0.05cm}\\par\n`;

        // PROJECT DESCRIPTION
        if (filled(item.description)) {
          entry +=
            `\\begin{itemize}\n` +
            `${bulletItems(item.description)}\n` +
            `\\end{itemize}\n`;
        }

        // GITHUB
        if (filled(item.githubLink)) {
          entry +=
            `{\\fontsize{8}{10}\\selectfont ` +
            `GitHub: \\href{${url(
              item.githubLink
            )}}{${esc(item.githubLink)}}}\\par\n`;
        }

        // LIVE DEMO
        if (filled(item.liveLink)) {
          entry +=
            `{\\fontsize{8}{10}\\selectfont ` +
            `Live Demo: \\href{${url(
              item.liveLink
            )}}{${esc(item.liveLink)}}}\\par\n`;
        }

        return entry;
      })
      .join("\\vspace{.12cm}\n");

    body += section(
      "Projects",
      entries
    );
  }

  // =========================================================
  // 5. CERTIFICATIONS
  // =========================================================

  if (certifications.length) {
    const entries = certifications
      .map((item) => {
        const name =
          typeof item === "object"
            ? item.name || ""
            : item;

        return `\\item ${esc(name)}`;
      })
      .join("\n");

    body += section(
      "Certifications",
      `\\begin{itemize}\n` +
        `${entries}\n` +
        `\\end{itemize}\n`
    );
  }

  // =========================================================
  // 6. TECHNICAL SKILLS
  // =========================================================

  if (technicalSkills.length) {

  const entries = technicalSkills
    .map((skill) => {
      const skillText =
        typeof skill === "object"
          ? skill.name || ""
          : skill;

      return skillText
        ? `\\item ${esc(skillText)}`
        : "";
    })
    .filter(Boolean)
    .join("\n");

  body += section(
    "Technical Skills",
    `\\begin{itemize}\n` +
      `${entries}\n` +
      `\\end{itemize}\n`
  );
}

  // =========================================================
  // 7. SOFT SKILLS
  // =========================================================

  if (softSkills.length) {

  const entries = softSkills
    .map((skill) => {
      const skillText =
        typeof skill === "object"
          ? skill.name || ""
          : skill;

      return skillText
        ? `\\item ${esc(skillText)}`
        : "";
    })
    .filter(Boolean)
    .join("\n");

  body += section(
    "Soft Skills",
    `\\begin{itemize}\n` +
      `${entries}\n` +
      `\\end{itemize}\n`
  );
}

  // =========================================================
  // 8. ACHIEVEMENTS
  // =========================================================

  if (achievements.length) {
    const entries = achievements
      .map(
        (item) =>
          `\\item ${esc(item)}`
      )
      .join("\n");

    body += section(
      "Achievements",
      `\\begin{itemize}\n` +
        `${entries}\n` +
        `\\end{itemize}\n`
    );
  }

  // =========================================================
  // 9. CUSTOM SECTIONS
  // =========================================================

  for (const item of customSections) {

  if (!filled(item.content)) {
    continue;
  }

  const entries = String(item.content)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `\\item ${esc(line)}`)
    .join("\n");

  body += section(
    item.heading || "Additional Information",
    `\\begin{itemize}\n` +
      `${entries}\n` +
      `\\end{itemize}\n`
  );
}

  // =========================================================
  // LATEX DOCUMENT
  // =========================================================

  return `\\documentclass[10pt]{article}

\\usepackage[
  a4paper,
  top=.38in,
  bottom=.48in,
  left=.52in,
  right=.52in
]{geometry}

\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{array}
\\usepackage{tabularx}
\\usepackage{needspace}
\\usepackage{fontawesome5}

\\pagestyle{empty}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\setlength{\\tabcolsep}{0pt}

% =========================================================
% COLORS
% =========================================================

\\definecolor{muted}{HTML}{667085}
\\definecolor{blacktext}{HTML}{111827}
\\definecolor{photoborder}{HTML}{CBD5E1}

% =========================================================
% BULLET SETTINGS
% =========================================================

% Compact description points
\\setlist[itemize]{leftmargin=1.25em,itemsep=-0.5pt,topsep=1pt,parsep=0pt,partopsep=0pt}

% =========================================================
% SECTION HEADING
% =========================================================

\\newcommand{\\sectionheading}[1]{%
  % More space ABOVE section heading
  \\Needspace{4\\baselineskip}%
  \\vspace{.28cm}%
  %
  % Heading
  {\\fontsize{12.2}{14}\\selectfont\\bfseries\\color{blacktext}\\MakeUppercase{#1}}\\par
  %
  % Very small gap between heading and line
  \\vspace{.035cm}%
  %
  % Horizontal line
  \\hrule height 1.05pt
  %
  % Very small gap between line and content
  \\vspace{.12cm}%
}

% =========================================================
% DOCUMENT
% =========================================================

\\begin{document}

\\noindent

% =========================================================
% HEADER
% =========================================================

\\begin{tabularx}{\\textwidth}{
  @{}
  >{\\raggedright\\arraybackslash}X
  @{}
  >{\\raggedleft\\arraybackslash}p{1.25in}
  @{}
}

% =========================================================
% LEFT HEADER
% =========================================================

\\begin{minipage}[t]{\\linewidth}

\\vspace{0pt}

% NAME
{\\fontsize{27}{30}\\selectfont\\bfseries\\color{blacktext} ${esc(
    form.name || ""
  )}}\\par

\\vspace{.06cm}

% ADDRESS
${
  addressLine
    ? `{\\fontsize{8.5}{10.5}\\selectfont\\color{muted} ${addressLine}}\\par`
    : ""
}

% PHONE + ALTERNATE PHONE
${
  phoneLine
    ? `{\\fontsize{8.5}{10.5}\\selectfont\\color{muted} ${phoneLine}}\\par`
    : ""
}

% EMAIL + ALTERNATE EMAIL
${
  emailLine
    ? `{\\fontsize{8.5}{10.5}\\selectfont\\color{muted} ${emailLine}}\\par`
    : ""
}

% LINKEDIN
${
  linkedinLine
    ? `{\\fontsize{8.5}{10.5}\\selectfont\\color{muted} ${linkedinLine}}\\par`
    : ""
}

% GITHUB
${
  githubLine
    ? `{\\fontsize{8.5}{10.5}\\selectfont\\color{muted} ${githubLine}}\\par`
    : ""
}

\\end{minipage}

&

% =========================================================
% PROFILE PHOTO
% =========================================================

\\begin{minipage}[t]{1.25in}

\\vspace{0pt}

${
  photo
    ? `\\IfFileExists{${photo}}{%
  \\fcolorbox{photoborder}{white}{%
    \\includegraphics[
      width=1.08in,
      height=1.30in
    ]{${photo}}%
  }%
}{}`
    : ""
}

\\end{minipage}

\\end{tabularx}

\\vspace{.05cm}

\\hrule height 1.05pt

% =========================================================
% RESUME CONTENT
% =========================================================

${body}

\\end{document}
`;
};