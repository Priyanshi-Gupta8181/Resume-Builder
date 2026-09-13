import { useState } from "react";
import axios from "axios";
import "./App.css";

const emptyExperience = () => ({
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

const emptyEducation = () => ({
  college: "",
  degree: "",
  cgpa: "",
  scoreType: "CGPA",
  location: "",
  year: "",
});

const emptyProject = () => ({
  title: "",
  tech: "",
  description: "",
  startDate: "",
  endDate: "",
  githubLink: "",
  liveLink: "",
});

const emptyCustomSection = () => ({ heading: "", content: "" });

function Section({ title, children }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Input(props) {
  return <input {...props} />;
}

function ObjectField({ value, name, placeholder, type = "text", onChange }) {
  return (
    <Input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default function App() {
  const [template, setTemplate] = useState("modern");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    title: "",
    phone: "",
    alternatePhone: "",
    email: "",
    alternateEmail: "",
    linkedin: "",
    github: "",
    address: "",
    summary: "",
  });

  const [experience, setExperience] = useState([emptyExperience()]);
  const [education, setEducation] = useState([emptyEducation()]);
  const [projects, setProjects] = useState([emptyProject()]);
  const [certifications, setCertifications] = useState([""]);
  const [technicalSkills, setTechnicalSkills] = useState([""]);
  const [softSkills, setSoftSkills] = useState([""]);
  const [achievements, setAchievements] = useState([""]);
  const [customSections, setCustomSections] = useState([emptyCustomSection()]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateObject(setter, index, event) {
    const { name, value } = event.target;
    setter((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: value } : item
      )
    );
  }

  function updateList(setter, index, value) {
    setter((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function generateResume() {
    setLoading(true);

    try {
      const photoData = photo ? await readAsDataURL(photo) : "";

      const payload = {
        template,
        formData: form,
        photoData,
        experience: experience.filter((item) =>
          Object.values(item).some((value) => String(value).trim())
        ),
        education: education.filter((item) =>
          Object.values(item).some((value) => String(value).trim())
        ),
        projects: projects.filter((item) =>
          Object.values(item).some((value) => String(value).trim())
        ),
        certifications: certifications.filter((item) => item.trim()),
        technicalSkills: technicalSkills.filter((item) => item.trim()),
        skills: technicalSkills.filter((item) => item.trim()),
        softSkills: softSkills.filter((item) => item.trim()),
        achievements: achievements.filter((item) => item.trim()),
        customSections: customSections.filter(
          (item) => item.heading.trim() || item.content.trim()
        ),
      };

      const response = await axios.post(
        "http://localhost:5000/generate-resume",
        payload
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "PDF generation failed.");
      }

      window.location.href = "http://localhost:5000/download-resume";
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "PDF generation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <main className="container">
        <header>
          <h1>✨ Resume Builder</h1>
          <p>Create a professional resume with profile photo and modern formatting.</p>
        </header>

        <Section title="🎨 Resume Template">
          <select
            className="template"
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
          >
            <option value="modern">Modern + Profile Photo</option>
            <option value="ats">ATS Friendly</option>
          </select>
        </Section>

        <Section title="👤 Personal Details">
          <div className="grid">
            <Input name="name" placeholder="Full Name" value={form.name} onChange={updateForm} />
            <Input name="title" placeholder="Professional Title" value={form.title} onChange={updateForm} />
            <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={updateForm} />
            <Input name="alternatePhone" placeholder="Additional Phone (Optional)" value={form.alternatePhone} onChange={updateForm} />
            <Input name="email" placeholder="Email" value={form.email} onChange={updateForm} />
            <Input name="alternateEmail" placeholder="Additional Email (Optional)" value={form.alternateEmail} onChange={updateForm} />
            <Input name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={updateForm} />
            <Input name="github" placeholder="GitHub URL" value={form.github} onChange={updateForm} />
            <Input name="address" placeholder="City / Location" value={form.address} onChange={updateForm} />
          </div>

          <div className="photo">
            <b>📷 Profile Photo</b>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            />
            {photo && (
              <div className="preview">
                <img src={URL.createObjectURL(photo)} alt="Profile preview" />
                <span>{photo.name}</span>
              </div>
            )}
          </div>
        </Section>

        <Section title="🎯 Career Objective">
          <textarea
            name="summary"
            placeholder="Write your career objective..."
            value={form.summary}
            onChange={updateForm}
          />
        </Section>

        <Section title="💼 Work Experience">
          {experience.map((item, index) => (
            <div className="card" key={index}>
              <div className="grid">
                <ObjectField value={item.role} name="role" placeholder="Job Role / Position" onChange={(event) => updateObject(setExperience, index, event)} />
                <ObjectField value={item.company} name="company" placeholder="Company / Organization" onChange={(event) => updateObject(setExperience, index, event)} />
                <ObjectField value={item.location} name="location" placeholder="Location" onChange={(event) => updateObject(setExperience, index, event)} />
                <ObjectField value={item.startDate} name="startDate" type="date" onChange={(event) => updateObject(setExperience, index, event)} />
                <ObjectField value={item.endDate} name="endDate" type="date" onChange={(event) => updateObject(setExperience, index, event)} />
              </div>
              <textarea name="description" placeholder="Responsibilities / achievements. One point per line." value={item.description} onChange={(event) => updateObject(setExperience, index, event)} />
            </div>
          ))}
          <button className="add" onClick={() => setExperience((current) => [...current, emptyExperience()])}>＋ Add Work Experience</button>
        </Section>

        <Section title="🎓 Education">
          {education.map((item, index) => (
            <div className="card" key={index}>
              <div className="grid">
                <ObjectField value={item.degree} name="degree" placeholder="Degree / Qualification" onChange={(event) => updateObject(setEducation, index, event)} />
                <ObjectField value={item.college} name="college" placeholder="School / College / University" onChange={(event) => updateObject(setEducation, index, event)} />
                <ObjectField value={item.location} name="location" placeholder="Location" onChange={(event) => updateObject(setEducation, index, event)} />
                <ObjectField value={item.year} name="year" placeholder="Passing Year" onChange={(event) => updateObject(setEducation, index, event)} />
                <select name="scoreType" value={item.scoreType} onChange={(event) => updateObject(setEducation, index, event)}>
                  <option value="CGPA">CGPA</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Score">Score</option>
                </select>
                <ObjectField value={item.cgpa} name="cgpa" placeholder="CGPA / Percentage / Score" onChange={(event) => updateObject(setEducation, index, event)} />
              </div>
            </div>
          ))}
          <button className="add" onClick={() => setEducation((current) => [...current, emptyEducation()])}>＋ Add Education</button>
        </Section>

        <Section title="🚀 Projects">
          {projects.map((item, index) => (
            <div className="card" key={index}>
              <div className="grid">
                <ObjectField value={item.title} name="title" placeholder="Project Title" onChange={(event) => updateObject(setProjects, index, event)} />
                <ObjectField value={item.tech} name="tech" placeholder="Technologies Used" onChange={(event) => updateObject(setProjects, index, event)} />
                <ObjectField value={item.startDate} name="startDate" type="date" onChange={(event) => updateObject(setProjects, index, event)} />
                <ObjectField value={item.endDate} name="endDate" type="date" onChange={(event) => updateObject(setProjects, index, event)} />
                <ObjectField value={item.githubLink} name="githubLink" placeholder="GitHub Link (Optional)" onChange={(event) => updateObject(setProjects, index, event)} />
                <ObjectField value={item.liveLink} name="liveLink" placeholder="Live Demo Link (Optional)" onChange={(event) => updateObject(setProjects, index, event)} />
              </div>
              <textarea name="description" placeholder="Project description. One point per line." value={item.description} onChange={(event) => updateObject(setProjects, index, event)} />
            </div>
          ))}
          <button className="add" onClick={() => setProjects((current) => [...current, emptyProject()])}>＋ Add Project</button>
        </Section>

        <Section title="📜 Certifications">
          {certifications.map((item, index) => (
            <div className="card" key={index}>
              <Input placeholder="Certification Name" value={item} onChange={(event) => updateList(setCertifications, index, event.target.value)} />
            </div>
          ))}
          <button className="add" onClick={() => setCertifications((current) => [...current, ""])}>＋ Add Certification</button>
        </Section>

        <Section title="🛠️ Technical Skills">
          {technicalSkills.map((item, index) => (
            <div className="card" key={index}>
              <Input placeholder="Example: Java, Python, SQL, React" value={item} onChange={(event) => updateList(setTechnicalSkills, index, event.target.value)} />
            </div>
          ))}
          <button className="add" onClick={() => setTechnicalSkills((current) => [...current, ""])}>＋ Add Technical Skill</button>
        </Section>

        <Section title="🤝 Soft Skills">
          {softSkills.map((item, index) => (
            <div className="card" key={index}>
              <Input placeholder="Example: Leadership, Communication, Teamwork" value={item} onChange={(event) => updateList(setSoftSkills, index, event.target.value)} />
            </div>
          ))}
          <button className="add" onClick={() => setSoftSkills((current) => [...current, ""])}>＋ Add Soft Skill</button>
        </Section>

        <Section title="🏆 Achievements">
          {achievements.map((item, index) => (
            <div className="card" key={index}>
              <Input placeholder="Achievement / Award / Competition" value={item} onChange={(event) => updateList(setAchievements, index, event.target.value)} />
            </div>
          ))}
          <button className="add" onClick={() => setAchievements((current) => [...current, ""])}>＋ Add Achievement</button>
        </Section>

        <Section title="✨ Custom Sections">
          <p className="hint">Languages, Internships, Publications, Positions of Responsibility, Extracurricular Activities, Interests, etc.</p>
          {customSections.map((item, index) => (
            <div className="card" key={index}>
              <Input name="heading" placeholder="Custom Section Heading" value={item.heading} onChange={(event) => updateObject(setCustomSections, index, event)} />
              <textarea name="content" placeholder="Section content. One point per line." value={item.content} onChange={(event) => updateObject(setCustomSections, index, event)} />
            </div>
          ))}
          <button className="add" onClick={() => setCustomSections((current) => [...current, emptyCustomSection()])}>＋ Add Custom Section</button>
        </Section>

        <button className="generate" disabled={loading} onClick={generateResume}>
          {loading ? "⏳ Generating..." : "🚀 Generate Resume"}
        </button>
      </main>
    </div>
  );
}
