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

  if (parts.length === 3) {
    return `${parts[1]}/${parts[0]}`;
  }

  return String(value);
}

function formatMultiline(text = "") {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => `\\item ${esc(line)}`)
    .join("\n");
}

/*
=========================================================
SECTION SPACING
=========================================================

Space before next section:
    -0.16cm

Heading -> line:
    -0.25cm

Line -> content:
    0.15cm
=========================================================
*/

function section(title, body) {
  return `
\\vspace{-0.16cm}
\\section*{${esc(title)}}
\\vspace{-0.25cm}
\\hrule
\\vspace{0.15cm}

${body}
`;
}

function atsTemplate(data = {}) {
  const form = data.formData || {};

  // =========================================================
  // DATA
  // =========================================================

  const education = Array.isArray(data.education)
    ? data.education.filter(Boolean)
    : [];

  const experience = Array.isArray(data.experience)
    ? data.experience.filter(Boolean)
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects.filter(Boolean)
    : [];

  const technicalSkills = Array.isArray(data.technicalSkills)
    ? data.technicalSkills.filter(Boolean)
    : Array.isArray(data.skills)
      ? data.skills.filter(Boolean)
      : [];

  const languages = Array.isArray(data.languages)
    ? data.languages.filter(Boolean)
    : [];

  const certifications = Array.isArray(data.certifications)
    ? data.certifications.filter(Boolean)
    : [];

  const achievements = Array.isArray(data.achievements)
    ? data.achievements.filter(Boolean)
    : [];

  const softSkills = Array.isArray(data.softSkills)
    ? data.softSkills.filter(Boolean)
    : [];

  const customSections = Array.isArray(data.customSections)
    ? data.customSections.filter(
        (item) =>
          item &&
          (filled(item.heading) || filled(item.content))
      )
    : [];

  // =========================================================
  // HEADER DATA
  // =========================================================

  const email = String(
    form.email || ""
  ).trim();

  const alternateEmail = String(
    form.alternateEmail || ""
  ).trim();

  const phone = String(
    form.phone || ""
  ).trim();

  const alternatePhone = String(
    form.alternatePhone || ""
  ).trim();

  const github = String(
    form.github || ""
  ).trim();

  const linkedin = String(
    form.linkedin || ""
  ).trim();

  // =========================================================
  // GITHUB USERNAME
  // =========================================================

  const githubUsername = github
    .replace(
      /^https?:\/\/(www\.)?github\.com\//i,
      ""
    )
    .replace(/\/$/, "");

  // =========================================================
  // LINKEDIN USERNAME
  // =========================================================

  const linkedinUsername = linkedin
    .replace(
      /^https?:\/\/(www\.)?linkedin\.com\/in\//i,
      ""
    )
    .replace(/\/$/, "");

  // =========================================================
  // HEADER CONTACT INFORMATION
  // =========================================================

  let headerContact = "";

  if (filled(phone)) {
    headerContact +=
      `\\faPhone\\ ${esc(phone)}`;
  }

  if (filled(alternatePhone)) {
    headerContact +=
      `\\quad\\quad \\faPhone\\ ${esc(
        alternatePhone
      )}`;
  }

  if (filled(email)) {
    headerContact +=
      `\\quad\\quad ` +
      `\\faEnvelope\\ ` +
      `\\href{mailto:${url(email)}}` +
      `{${esc(email)}}`;
  }

  if (filled(alternateEmail)) {
    headerContact +=
      `\\quad\\quad ` +
      `\\faEnvelope\\ ` +
      `\\href{mailto:${url(alternateEmail)}}` +
      `{${esc(alternateEmail)}}`;
  }

  if (filled(linkedin)) {
    headerContact +=
      `\\quad\\quad ` +
      `\\faLinkedin\\ ` +
      `\\href{${url(linkedin)}}` +
      `{${esc(
        linkedinUsername || "LinkedIn"
      )}}`;
  }

  if (filled(github)) {
    headerContact +=
      `\\quad\\quad ` +
      `\\faGithub\\ ` +
      `\\href{${url(github)}}` +
      `{${esc(
        githubUsername || "GitHub"
      )}}`;
  }

  // =========================================================
  // BODY
  // =========================================================

  let body = "";

  // =========================================================
  // CAREER OBJECTIVE
  // =========================================================

  if (filled(form.summary)) {
    body += section(
      "Career Objective",
      `{\\fontsize{9.5}{11.5}\\selectfont ${esc(
        form.summary
      )}}\\par`
    );
  }

  // =========================================================
  // EDUCATION
  // =========================================================

  if (education.length) {

    let educationBody = "";

    education.forEach((edu, index) => {

      // Institute + Year
      educationBody += `
\\textbf{${esc(
        edu.college || ""
      )}}
\\hfill
${esc(
        edu.year || ""
      )}
\\vspace{-0.08cm}

`;

      // Degree
      if (filled(edu.degree)) {
        educationBody +=
          `{\\fontsize{9.5}{11.5}\\selectfont ${esc(
            edu.degree
          )}}`;
      }

      // CGPA / Percentage / Score
      if (filled(edu.cgpa)) {

        if (
          edu.scoreType === "Percentage"
        ) {

          educationBody +=
            ` - Percentage: ${esc(
              edu.cgpa
            )}\\%`;

        } else if (
          edu.scoreType === "Score"
        ) {

          educationBody +=
            ` - Score: ${esc(
              edu.cgpa
            )}`;

        } else {

          educationBody +=
            ` - CGPA: ${esc(
              edu.cgpa
            )}`;
        }
      }

      // Location
      educationBody += `
\\hfill
${esc(
        edu.location || ""
      )}
`;

      // Space between education entries
      if (
        index <
        education.length - 1
      ) {

        educationBody += `
\\vspace{0.20cm}
`;
      }
    });

    body += section(
      "Education",
      educationBody
    );
  }

  // =========================================================
  // EXPERIENCE
  // =========================================================

  const hasExperience =
    experience.some(
      (exp) =>
        filled(exp.company) ||
        filled(exp.role) ||
        filled(exp.description)
    );

  if (hasExperience) {

    let experienceBody = "";

    experience.forEach(
      (exp, index) => {

        const startDate =
          dateText(
            exp.startDate || ""
          );

        const endDate =
          dateText(
            exp.endDate || ""
          );

        let dates = "";

        if (
          startDate ||
          endDate
        ) {

          dates =
            `${startDate}` +
            ` -- ` +
            `${endDate}`;
        }

        // Role + Date
        experienceBody += `
\\textbf{${esc(
          exp.role || ""
        )}}
\\hfill
${esc(dates)}
`;

        // Company + Location
        experienceBody += `
${esc(
          exp.company || ""
        )}
\\hfill
${esc(
          exp.location || ""
        )}
`;

        // Description
        if (
          filled(
            exp.description
          )
        ) {

          experienceBody += `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]

${formatMultiline(
            exp.description
          )}

\\end{itemize}
`;
        }

        // Space between experiences
        if (
          index <
          experience.length - 1
        ) {

          experienceBody += `
\\vspace{0.20cm}
`;
        }
      }
    );

    body += section(
      "Experience",
      experienceBody
    );
  }

  // =========================================================
  // PROJECTS
  // =========================================================

  const hasProjects =
    projects.some(
      (project) =>
        filled(project.title) ||
        filled(project.tech) ||
        filled(project.description)
    );

  if (hasProjects) {

    let projectsBody = "";

    projects.forEach(
      (project, index) => {

        const startDate =
          dateText(
            project.startDate || ""
          );

        const endDate =
          dateText(
            project.endDate || ""
          );

        let projectDates = "";

        if (
          startDate ||
          endDate
        ) {

          projectDates =
            `${startDate}` +
            ` -- ` +
            `${endDate}`;
        }

        // Project Title
        projectsBody += `
\\textbf{${esc(
          project.title || ""
        )}}
`;

        // Technology
        if (
          filled(project.tech)
        ) {

          projectsBody +=
            `\\quad | \\quad ` +
            `{\\itshape ${esc(
              project.tech
            )}}`;
        }

        // Date
        projectsBody += `
\\hfill
${esc(
          projectDates
        )}
`;

        // Description
        if (
          filled(
            project.description
          )
        ) {

          projectsBody += `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]

${formatMultiline(
            project.description
          )}

\\end{itemize}
`;
        }

        // GitHub
        if (
          filled(
            project.githubLink
          )
        ) {

          projectsBody += `
GitHub:
\\href{${url(
            project.githubLink
          )}}{
${esc(
            project.githubLink
          )}
}
`;
        }

        // Live Demo
        if (
          filled(
            project.liveLink
          )
        ) {

          projectsBody += `
Live Demo:
\\href{${url(
            project.liveLink
          )}}{
${esc(
            project.liveLink
          )}
}
`;
        }

        // Space between projects
        if (
          index <
          projects.length - 1
        ) {

          projectsBody += `
\\vspace{0.20cm}
`;
        }
      }
    );

    body += section(
      "Projects",
      projectsBody
    );
  }

  // =========================================================
  // TECHNICAL SKILLS
  // =========================================================

  if (technicalSkills.length) {

  let skillsBody = `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]
`;

  technicalSkills.forEach((skill) => {

    const skillText =
      typeof skill === "object"
        ? esc(skill.name || "")
        : esc(skill);

    if (skillText) {
      skillsBody += `\\item ${skillText}\n`;
    }

  });

  skillsBody += `
\\end{itemize}
`;

  body += section(
    "Technical Skills",
    `{\\fontsize{9.5}{11.5}\\selectfont ${skillsBody}}`
  );
}

  // =========================================================
  // LANGUAGES
  // =========================================================

  if (
    languages.length
  ) {

    const languageText =
      languages
        .map((lang) => {

          if (
            typeof lang ===
            "object"
          ) {

            return esc(
              lang.name || ""
            );
          }

          return esc(lang);
        })
        .filter(Boolean)
        .join(", ");

    if (languageText) {

      body += section(
        "Languages",
        `{\\fontsize{9.5}{11.5}\\selectfont ${languageText}}\\par`
      );
    }
  }

  // =========================================================
  // SOFT SKILLS
  // =========================================================

  if (softSkills.length) {

  let softSkillsBody = `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]
`;

  softSkills.forEach((skill) => {

    const skillText =
      typeof skill === "object"
        ? esc(skill.name || "")
        : esc(skill);

    if (skillText) {
      softSkillsBody += `\\item ${skillText}\n`;
    }

  });

  softSkillsBody += `
\\end{itemize}
`;

  body += section(
    "Soft Skills",
    `{\\fontsize{9.5}{11.5}\\selectfont ${softSkillsBody}}`
  );
}

  // =========================================================
  // CERTIFICATIONS
  // =========================================================

  const hasCertifications =
    certifications.some(
      (cert) =>
        typeof cert ===
        "object"
          ? filled(cert.name)
          : filled(cert)
    );

  if (
    hasCertifications
  ) {

    let certificationBody = `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]
`;

    certifications.forEach(
      (cert) => {

        if (
          typeof cert ===
          "object"
        ) {

          if (
            filled(cert.name)
          ) {

            certificationBody +=
              `\\item ${esc(
                cert.name
              )}`;

            if (
              filled(cert.date)
            ) {

              certificationBody +=
                ` (${esc(
                  cert.date
                )})`;
            }

            certificationBody +=
              "\n";
          }

        } else if (
          filled(cert)
        ) {

          certificationBody +=
            `\\item ${esc(
              cert
            )}\n`;
        }
      }
    );

    certificationBody += `
\\end{itemize}
`;

    body += section(
      "Certifications",
      certificationBody
    );
  }

  // =========================================================
  // ACHIEVEMENTS
  // =========================================================

  const hasAchievements =
    achievements.some(
      (item) =>
        filled(item)
    );

  if (
    hasAchievements
  ) {

    let achievementBody = `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]
`;

    achievements.forEach(
      (item) => {

        if (
          filled(item)
        ) {

          achievementBody +=
            `\\item ${esc(
              item
            )}\n`;
        }
      }
    );

    achievementBody += `
\\end{itemize}
`;

    body += section(
      "Achievements",
      achievementBody
    );
  }

  // =========================================================
  // CUSTOM SECTIONS
  // =========================================================

  customSections.forEach(
    (custom) => {

      let customBody = "";

      if (
        filled(
          custom.content
        )
      ) {

        customBody = `
\\begin{itemize}[
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
]

${formatMultiline(
          custom.content
        )}

\\end{itemize}
`;
      }

      body += section(
        custom.heading ||
          "Additional Information",
        customBody
      );
    }
  );

  // =========================================================
  // FINAL LATEX DOCUMENT
  // =========================================================

  return `
\\documentclass[10pt]{article}

\\usepackage[
  a4paper,
  top=0.30in,
  bottom=0.50in,
  left=0.55in,
  right=0.55in
]{geometry}

\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}

\\pagestyle{empty}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

% =========================================================
% BULLET SETTINGS
% =========================================================

\\setlist[itemize]{
  leftmargin=*,
  itemsep=0pt,
  topsep=0.8pt,
  parsep=0pt,
  partopsep=0pt
}

% =========================================================
% DOCUMENT
% =========================================================

\\begin{document}

% =========================================================
% HEADER
% =========================================================

\\begin{center}

{\\Huge \\textbf{${esc(
    form.name || ""
  )}}}

\\vspace{0.10cm}

${
  filled(form.address)
    ? `\\faMapMarker*\\ ${esc(
        form.address
      )}`
    : ""
}

\\vspace{-0.04cm}

${headerContact}

\\end{center}

\\hrule

\\vspace{0.10cm}

% =========================================================
% RESUME CONTENT
% =========================================================

${body}

\\end{document}

`;
}

module.exports = atsTemplate;