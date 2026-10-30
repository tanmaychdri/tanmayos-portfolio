# TanmayOS - Portfolio

Welcome to my portfolio, designed as a custom, Linux styled Operating System!  
This project showcases my skills and projects through a nostalgic, old-school operating system interface built entirely from scratch.

## 🚀 Features

- **Linux Styled Desktop Environment:** Complete with a taskbar, start menu, system tray, and draggable desktop icons.
- **Window Management System:** Fully functional window system supporting drag-and-drop, resizing, maximizing, minimizing, and z-index stacking.
- **Terminal App:** A working command-line interface. Try running `help`, `about`, `skills`, `projects`, `clear`, or even `neofetch`!
- **File Explorer:** Navigate through a mock file system to explore my projects, resume, and contact information.
- **Settings App:** Customize your experience! Change the wallpaper, toggle a CRT scanline effect, or apply a grayscale filter for that ultimate retro vibe.
- **Browser & Notepad:** Additional mini-apps to explore web projects or note down temporary notes.

## 🛠️ Built With

This project is built using pure, vanilla web technologies to ensure maximum performance and minimal dependencies:
- **HTML5** for semantic structure
- **CSS3** (no frameworks) for styling, flexbox/grid layouts.
- **JavaScript** (ES6+) for DOM manipulation, state management, and application logic

## 💻 Running Locally

To run this project locally, you just need a basic web server. You can use any static server of your choice:

1. Clone the repository:
   ```bash
   git clone https://github.com/tanmaychdri/TanmayOS-Portfolio.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TanmayOS-Portfolio
   ```
3. Start a local server (e.g., using npx):
   ```bash
   npx serve .
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## 📁 Directory Structure

- `index.html` — The main entry point and desktop layout.
- `styles/`
  - `main.css` — Core styles, design tokens, and layout.
  - `animations.css` — Keyframe animations for boot sequences and UI interactions.
- `js/`
  - `boot.js` — Handles the boot-up loading screen.
  - `data.js` — Contains all portfolio content (skills, bio, projects) in one easy-to-edit place.
  - `desktop.js` — Manages desktop icons, context menus, and wallpaper.
  - `taskbar.js` — Controls the start menu, clock, and active window indicators.
  - `windowManager.js` — The core engine for rendering and manipulating app windows.
  - `apps/` — Individual logic for each application (Terminal, Explorer, Settings, etc.).

## 🤝 Contact

Feel free to reach out or check out my other work:
- **GitHub:** [tanmaychdri](https://github.com/tanmaychdri)
- **LinkedIn:** [tanmaychdri](https://linkedin.com/in/tanmaychdri)
- **Email:** tanmaychdri@gmail.com

---
