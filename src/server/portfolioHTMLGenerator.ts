/**
 * Generate beautiful portfolio HTML matching Prateek's design
 */

interface PortfolioData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location?: string;
    achievements: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    year?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string[];
  }>;
  linkedin?: string;
  github?: string;
}

export function generatePortfolioHTML(data: PortfolioData): string {
  const skillsHTML = data.skills
    .map(
      (skillGroup) => `
    <div class="skill-group">
      <h4>${skillGroup.category}</h4>
      <div class="skill-tags">
        ${skillGroup.items.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
      </div>
    </div>
  `
    )
    .join("");

  const experienceHTML = data.experience
    .map(
      (exp) => `
    <div class="experience-item">
      <div class="exp-header">
        <h3>${exp.role}</h3>
        <span class="exp-dates">${exp.startDate} - ${exp.endDate}</span>
      </div>
      <p class="exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ""}</p>
      <ul class="exp-achievements">
        ${exp.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");

  const educationHTML = data.education
    .map(
      (edu) => `
    <div class="education-item">
      <h4>${edu.degree}</h4>
      <p>${edu.school}${edu.year ? ` • ${edu.year}` : ""}</p>
    </div>
  `
    )
    .join("");

  const projectsHTML = data.projects
    ? data.projects
        .map(
          (project) => `
    <div class="project-item">
      <h4>${project.title}</h4>
      <p>${project.description}</p>
      ${
        project.technologies
          ? `<div class="tech-tags">${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}</div>`
          : ""
      }
    </div>
  `
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - ${data.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f5f5f5;
      color: #333;
    }

    .container {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(135deg, #1a3a52 0%, #0f5f7f 100%);
      color: white;
      padding: 40px 20px;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .profile-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      border: 3px solid #00d9a3;
    }

    .profile-name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .profile-title {
      font-size: 13px;
      color: #00d9a3;
      margin-bottom: 10px;
    }

    .profile-location {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 20px;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 40px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 13px;
      transition: background 0.3s;
      border: 2px dashed #00d9a3;
    }

    .nav-links a:hover {
      background: rgba(0, 217, 163, 0.2);
    }

    .social-links {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 40px;
    }

    .social-links a {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #00d9a3;
      color: #1a3a52;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s;
    }

    .social-links a:hover {
      transform: scale(1.1);
    }

    .main-content {
      margin-left: 280px;
      flex: 1;
      padding: 60px 40px;
    }

    .hero-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 60px;
      align-items: center;
    }

    .hero-text h1 {
      font-size: 48px;
      margin-bottom: 10px;
      color: #1a3a52;
    }

    .hero-text .highlight {
      color: #00d9a3;
    }

    .hero-text .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .hero-image {
      width: 100%;
      height: 400px;
      background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
    }

    .cta-buttons {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s;
      border: 2px solid;
    }

    .btn-primary {
      background: #1a3a52;
      color: white;
      border-color: #1a3a52;
    }

    .btn-primary:hover {
      background: white;
      color: #1a3a52;
    }

    .btn-secondary {
      background: transparent;
      color: #00d9a3;
      border-color: #00d9a3;
    }

    .btn-secondary:hover {
      background: #00d9a3;
      color: #1a3a52;
    }

    .section {
      margin-bottom: 60px;
    }

    .section-title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 30px;
      color: #1a3a52;
      border-bottom: 3px solid #00d9a3;
      padding-bottom: 10px;
    }

    .experience-item {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid #eee;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .exp-header h3 {
      font-size: 18px;
      color: #1a3a52;
    }

    .exp-dates {
      font-size: 13px;
      color: #999;
    }

    .exp-company {
      font-size: 14px;
      color: #00d9a3;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .exp-achievements {
      list-style: none;
      margin-left: 0;
    }

    .exp-achievements li {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }

    .exp-achievements li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #00d9a3;
      font-weight: bold;
    }

    .skill-group {
      margin-bottom: 25px;
    }

    .skill-group h4 {
      font-size: 14px;
      color: #1a3a52;
      margin-bottom: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .skill-tag {
      background: #f0f0f0;
      color: #1a3a52;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid #e0e0e0;
    }

    .education-item {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .education-item h4 {
      font-size: 16px;
      color: #1a3a52;
      margin-bottom: 5px;
    }

    .education-item p {
      font-size: 14px;
      color: #666;
    }

    .project-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #00d9a3;
    }

    .project-item h4 {
      font-size: 16px;
      color: #1a3a52;
      margin-bottom: 10px;
    }

    .project-item p {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      line-height: 1.6;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-tags span {
      background: #f0f0f0;
      color: #666;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 12px;
    }

    .contact-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1a3a52;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: inherit;
      font-size: 14px;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #00d9a3;
      box-shadow: 0 0 0 3px rgba(0, 217, 163, 0.1);
    }

    .footer {
      text-align: center;
      padding: 20px 0;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #eee;
      margin-top: 60px;
    }

    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        height: auto;
        position: static;
        padding: 30px 20px;
      }

      .main-content {
        margin-left: 0;
        padding: 30px 20px;
      }

      .hero-section {
        grid-template-columns: 1fr;
      }

      .hero-text h1 {
        font-size: 32px;
      }

      .hero-image {
        height: 300px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <div class="profile-section">
        <div class="profile-image">👤</div>
        <div class="profile-name">${data.name}</div>
        <div class="profile-title">${data.title}</div>
        ${data.location ? `<div class="profile-location">${data.location}</div>` : ""}
      </div>

      <div class="nav-links">
        <a href="#home">Home</a>
        <a href="#experience">Experience</a>
        <a href="#skills">Skills</a>
        ${data.projects && data.projects.length > 0 ? '<a href="#projects">Projects</a>' : ""}
        ${data.education && data.education.length > 0 ? '<a href="#education">Education</a>' : ""}
        <a href="#contact">Contact</a>
      </div>

      <div class="social-links">
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" title="LinkedIn">in</a>` : ""}
        ${data.email ? `<a href="mailto:${data.email}" title="Email">✉</a>` : ""}
      </div>
    </div>

    <div class="main-content">
      <section id="home" class="hero-section">
        <div class="hero-text">
          <h1>Hey, I'm <span class="highlight">${data.name.split(" ")[0]}</span></h1>
          <p class="subtitle">${data.title}</p>
          <p class="subtitle">${data.summary || "Dedicated professional committed to delivering excellence."}</p>
          <div class="cta-buttons">
            ${data.linkedin ? `<a href="${data.linkedin}" class="btn btn-primary" target="_blank">Connect on LinkedIn</a>` : ""}
            ${data.email ? `<a href="mailto:${data.email}" class="btn btn-secondary">Email Me</a>` : ""}
          </div>
        </div>
        <div class="hero-image">Professional Photo</div>
      </section>

      ${
        data.experience && data.experience.length > 0
          ? `
      <section id="experience" class="section">
        <h2 class="section-title">Experience</h2>
        ${experienceHTML}
      </section>
      `
          : ""
      }

      ${
        data.skills && data.skills.length > 0
          ? `
      <section id="skills" class="section">
        <h2 class="section-title">Skills & Expertise</h2>
        ${skillsHTML}
      </section>
      `
          : ""
      }

      ${
        data.projects && data.projects.length > 0
          ? `
      <section id="projects" class="section">
        <h2 class="section-title">Featured Projects</h2>
        ${projectsHTML}
      </section>
      `
          : ""
      }

      ${
        data.education && data.education.length > 0
          ? `
      <section id="education" class="section">
        <h2 class="section-title">Education</h2>
        ${educationHTML}
      </section>
      `
          : ""
      }

      <section id="contact" class="section">
        <h2 class="section-title">Get In Touch</h2>
        <div class="contact-form">
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" placeholder="Your Name">
          </div>
          <div class="form-group">
            <label>Your Email</label>
            <input type="email" placeholder="Your Email">
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea placeholder="Your Message"></textarea>
          </div>
          <button class="btn btn-primary" style="width: 100%;">Send Message</button>
        </div>
      </section>

      <div class="footer">
        <p>Made with Manus</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
