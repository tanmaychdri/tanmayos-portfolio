

const PORTFOLIO_DATA = {
  personal: {
    name: "Tanmay",
    fullName: "Tanmay Chaudhari",
    title: "Full-Stack Developer",
    bio: "Passionate developer who loves building things that live on the internet. I craft clean, elegant solutions with modern technologies. When I'm not coding, you'll find me experimenting with Linux distros or exploring open-source projects.",
    avatar: null,
    location: "India",
    email: "tanmaychdri@gmail.com",
    website: "https://tanmay.dev",
  },

  social: {
    github: "https://github.com/tanmaynesty",
    linkedin: "https://linkedin.com/in/tanmaynesty",
    twitter: "https://twitter.com/tanmaynesty",
  },

  skills: {
    "Languages": ["JavaScript", "Python", "C++", "HTML/CSS"],
    "Frontend": ["React", "Next.js"],
    "Backend": ["Node.js", "Express", "Django"],
    "DevOps & Tools": ["Git", "Linux"],
    "Databases": ["PostgreSQL", "MongoDB", "Firebase"],
  },

  projects: [
    {
      name: "CodeAlpha_CYGNUS",
      description: "A full-stack e-commerce web application built as part of the CodeAlpha Full Stack Development Internship.",
      tech: ["HTML", "CSS", "JavaScript", "Django", "SQLite"],
      url: "https://github.com/tanmaynesty/CodeAlpha_CYGNUS",
      type: "folder",
    },
    {
      name: "CodeAlpha_ZENITH",
      description: "A sleek, minimalistic, real-time Project Management Platform with a monochromatic aesthetic built using Django and Vanilla JS.",
      tech: ["HTML", "CSS", "JavaScript", "Django", "SQLite"],
      url: "https://github.com/tanmaynesty/CodeAlpha_ZENITH",
      type: "folder",
    },
    {
      name: "Calculator",
      description: "A sleek, modern, and frameless calculator built entirely in Python using tkinter. This Calculator features a custom dark-mode user interface, rounded corners, a slide-out history panel, and a built-in memory system.",
      tech: ["Python", "Tkinter"],
      url: "https://github.com/tanmaynesty/Calculator",
      type: "folder",
    }
  ],

  experience: [
    {
      role: "Junior Developer",
      company: "CodeWorks",
      period: "2019 - 2021",
      description: "Full-stack development using MERN stack. Contributed to open-source projects and internal tooling.",
    }
  ],

  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Nagpur University",
      period: "2025 - 2029",
      description: "Specialized in algorithms, data structures, and systems programming.",
    },
  ],

  filesystem: {
    "~": {
      type: "dir",
      children: {
        "Documents": {
          type: "dir",
          children: {
            "resume.txt": { type: "file", content: "RESUME_CONTENT" },
            "about.txt": { type: "file", content: "ABOUT_CONTENT" },
            "contact.txt": { type: "file", content: "CONTACT_CONTENT" },
          },
        },
        "Projects": {
          type: "dir",
          children: {},
        },
        "Downloads": {
          type: "dir",
          children: {
            "resume.pdf": { type: "file", content: "[Binary file - resume.pdf]" },
          },
        },
        ".config": {
          type: "dir",
          children: {
            "settings.json": { type: "file", content: "SETTINGS_CONTENT" },
          },
        },
        ".bashrc": { type: "file", content: "# TanmayOS Shell Config\nexport PS1='tanmay@portfolio:~$ '\nalias ll='ls -la'\nalias cls='clear'" },
        "README.md": { type: "file", content: "README_CONTENT" },
      },
    },
  },

  systemInfo: {
    os: "TanmayOS v1.2.2",
    kernel: "Web 6.4.2-tanmay",
    shell: "tsh 1.0",
    resolution: "dynamic",
    de: "TanmayDE",
    wm: "TanmayWM",
    theme: "Cyberpunk-Dark [GTK3]",
    icons: "Neon-Icons",
    terminal: "TanmayTerm",
    cpu: "Neural Engine @ ∞ GHz",
    memory: "∞ MB / ∞ MB",
    uptime: "Since you opened this page",
  },
};

PORTFOLIO_DATA.projects.forEach((project) => {
  PORTFOLIO_DATA.filesystem["~"].children["Projects"].children[project.name] = {
    type: "dir",
    children: {
      "README.md": {
        type: "file",
        content: `# ${project.name}\n\n${project.description}\n\nTech Stack: ${project.tech.join(", ")}\nURL: ${project.url}`,
      },
      "package.json": {
        type: "file",
        content: `{\n  "name": "${project.name.toLowerCase()}",\n  "version": "1.0.0",\n  "description": "${project.description}"\n}`,
      },
    },
  };
});

PORTFOLIO_DATA.filesystem["~"].children["Documents"].children["resume.txt"].content =
  `╔══════════════════════════════════════════╗
║             R E S U M E                  ║
╚══════════════════════════════════════════╝

Name:     ${PORTFOLIO_DATA.personal.fullName}
Title:    ${PORTFOLIO_DATA.personal.title}
Location: ${PORTFOLIO_DATA.personal.location}
Email:    ${PORTFOLIO_DATA.personal.email}

─── EXPERIENCE ────────────────────────────
${PORTFOLIO_DATA.experience.map((e) => `\n  ${e.role} @ ${e.company}\n  ${e.period}\n  ${e.description}`).join("\n")}

─── EDUCATION ─────────────────────────────
${PORTFOLIO_DATA.education.map((e) => `\n  ${e.degree}\n  ${e.institution} (${e.period})\n  ${e.description}`).join("\n")}

─── SKILLS ────────────────────────────────
${Object.entries(PORTFOLIO_DATA.skills).map(([cat, skills]) => `\n  ${cat}: ${skills.join(", ")}`).join("\n")}
`;

PORTFOLIO_DATA.filesystem["~"].children["Documents"].children["about.txt"].content =
  `${PORTFOLIO_DATA.personal.bio}`;

PORTFOLIO_DATA.filesystem["~"].children["Documents"].children["contact.txt"].content =
  `╔══════════════════════════════════════════╗
║            C O N T A C T                 ║
╚══════════════════════════════════════════╝

  Email:    ${PORTFOLIO_DATA.personal.email}
  Website:  ${PORTFOLIO_DATA.personal.website}
  GitHub:   ${PORTFOLIO_DATA.social.github}
  LinkedIn: ${PORTFOLIO_DATA.social.linkedin}
  Twitter:  ${PORTFOLIO_DATA.social.twitter}
`;

PORTFOLIO_DATA.filesystem["~"].children["README.md"].content =
  `# Welcome to TanmayOS 🚀

Hey! I'm ${PORTFOLIO_DATA.personal.fullName}, a ${PORTFOLIO_DATA.personal.title}.

This is my portfolio, designed as an interactive operating system.
Feel free to explore!

## Quick Start
- Open the Terminal and type 'help' for available commands
- Browse my Projects in the File Explorer
- Check Settings to customize the desktop

## Navigation
- Double-click icons to open apps
- Right-click the desktop for more options
- Use the taskbar at the bottom to switch between windows
`;

if (typeof module !== "undefined") {
  module.exports = PORTFOLIO_DATA;
}
