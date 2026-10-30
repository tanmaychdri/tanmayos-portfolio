

const TerminalApp = (() => {
  let commandHistory = [];
  let historyIndex = -1;
  let currentPath = "~";
  let windowId = null;

  const NEOFETCH_ASCII = `       _____
      /     \\
     / () () \\
    |  __^__  |
    |_/     \\_|
   /    T    \\
  /   A   N   \\
 /  M   A   Y  \\
/_______________\\
\\               /
 \\_____________/`;

  const COMMANDS = {
    help: () => {
      return `
<span class="terminal-highlight terminal-bold">Available Commands:</span>

  <span class="terminal-highlight">about</span>         Display info about me
  <span class="terminal-highlight">skills</span>        Show my technical skills
  <span class="terminal-highlight">projects</span>      List my projects
  <span class="terminal-highlight">education</span>     Show education background
  <span class="terminal-highlight">contact</span>       Display contact information
  <span class="terminal-highlight">social</span>        Show social media links

  <span class="terminal-highlight">ls</span> <span class="terminal-dim">[path]</span>     List directory contents
  <span class="terminal-highlight">cd</span> <span class="terminal-dim">&lt;dir&gt;</span>     Change directory
  <span class="terminal-highlight">cat</span> <span class="terminal-dim">&lt;file&gt;</span>   Display file contents
  <span class="terminal-highlight">pwd</span>           Print working directory
  <span class="terminal-highlight">whoami</span>        Display current user
  <span class="terminal-highlight">clear</span>         Clear the terminal
  <span class="terminal-highlight">echo</span> <span class="terminal-dim">&lt;text&gt;</span>  Echo text back
  <span class="terminal-highlight">date</span>          Show current date/time
  <span class="terminal-highlight">uname</span> <span class="terminal-dim">[-a]</span>   Show system information
  <span class="terminal-highlight">neofetch</span>      Show system info with ASCII art
  <span class="terminal-highlight">history</span>       Show command history

  <span class="terminal-dim">Type a command to get started!</span>`;
    },

    about: () => {
      const d = PORTFOLIO_DATA.personal;
      return `
<span class="terminal-highlight terminal-bold">┌──────────────────────────────────────────┐</span>
<span class="terminal-highlight terminal-bold">│             A B O U T   M E              │</span>
<span class="terminal-highlight terminal-bold">└──────────────────────────────────────────┘</span>

  <span class="terminal-bold">${d.fullName}</span>
  <span class="terminal-dim">${d.title}</span>

  ${d.bio}

  <span class="terminal-highlight">Location:</span>  ${d.location}
  <span class="terminal-highlight">Email:</span>     ${d.email}
  <span class="terminal-highlight">Website:</span>   <span class="terminal-link" onclick="window.open('${d.website}')">${d.website}</span>`;
    },

    skills: () => {
      let output = `
<span class="terminal-highlight terminal-bold">┌──────────────────────────────────────────┐</span>
<span class="terminal-highlight terminal-bold">│           T E C H   S K I L L S          │</span>
<span class="terminal-highlight terminal-bold">└──────────────────────────────────────────┘</span>
`;
      Object.entries(PORTFOLIO_DATA.skills).forEach(([category, skills]) => {
        const bar = skills
          .map(
            (s) =>
              `<span class="terminal-success">▮</span> ${s}`
          )
          .join("  ");
        output += `\n  <span class="terminal-highlight terminal-bold">${category}:</span>\n  ${bar}\n`;
      });
      return output;
    },

    projects: () => {
      let output = `
<span class="terminal-highlight terminal-bold">┌──────────────────────────────────────────┐</span>
<span class="terminal-highlight terminal-bold">│           P R O J E C T S                │</span>
<span class="terminal-highlight terminal-bold">└──────────────────────────────────────────┘</span>
`;
      PORTFOLIO_DATA.projects.forEach((p, i) => {
        output += `
  <span class="terminal-highlight terminal-bold">${i + 1}. ${p.name}</span>
     ${p.description}
     <span class="terminal-dim">Tech:</span> ${p.tech.map((t) => `<span class="terminal-warning">${t}</span>`).join(", ")}
     <span class="terminal-dim">URL:</span>  <span class="terminal-link" onclick="window.open('${p.url}')">${p.url}</span>
`;
      });
      return output;
    },

    education: () => {
      let output = `
<span class="terminal-highlight terminal-bold">┌──────────────────────────────────────────┐</span>
<span class="terminal-highlight terminal-bold">│         E D U C A T I O N                │</span>
<span class="terminal-highlight terminal-bold">└──────────────────────────────────────────┘</span>
`;
      PORTFOLIO_DATA.education.forEach((e) => {
        output += `
  <span class="terminal-highlight terminal-bold">${e.degree}</span>
  <span class="terminal-warning">${e.institution}</span> <span class="terminal-dim">│ ${e.period}</span>
  ${e.description}
`;
      });
      return output;
    },

    contact: () => {
      const d = PORTFOLIO_DATA.personal;
      const s = PORTFOLIO_DATA.social;
      return `
<span class="terminal-highlight terminal-bold">┌──────────────────────────────────────────┐</span>
<span class="terminal-highlight terminal-bold">│           C O N T A C T                  │</span>
<span class="terminal-highlight terminal-bold">└──────────────────────────────────────────┘</span>

  <span class="terminal-highlight">📧 Email:</span>    <span class="terminal-link" onclick="window.open('mailto:${d.email}')">${d.email}</span>
  <span class="terminal-highlight">🌐 Website:</span>  <span class="terminal-link" onclick="window.open('${d.website}')">${d.website}</span>
  <span class="terminal-highlight">🐙 GitHub:</span>   <span class="terminal-link" onclick="window.open('${s.github}')">${s.github}</span>
  <span class="terminal-highlight">💼 LinkedIn:</span> <span class="terminal-link" onclick="window.open('${s.linkedin}')">${s.linkedin}</span>
  <span class="terminal-highlight">🐦 Twitter:</span>  <span class="terminal-link" onclick="window.open('${s.twitter}')">${s.twitter}</span>`;
    },

    social: () => {
      const s = PORTFOLIO_DATA.social;
      return `
<span class="terminal-highlight terminal-bold">Social Links:</span>

  <span class="terminal-link" onclick="window.open('${s.github}')">GitHub    → ${s.github}</span>
  <span class="terminal-link" onclick="window.open('${s.linkedin}')">LinkedIn  → ${s.linkedin}</span>
  <span class="terminal-link" onclick="window.open('${s.twitter}')">Twitter   → ${s.twitter}</span>`;
    },

    whoami: () => {
      return `<span class="terminal-highlight">${PORTFOLIO_DATA.personal.name.toLowerCase()}</span>`;
    },

    pwd: () => {
      const fullPath = currentPath === "~" ? "/home/tanmay" : currentPath.replace("~", "/home/tanmay");
      return `<span class="terminal-output-text">${fullPath}</span>`;
    },

    date: () => {
      return `<span class="terminal-output-text">${new Date().toString()}</span>`;
    },

    clear: () => {
      return "__CLEAR__";
    },

    echo: (args) => {
      return `<span class="terminal-output-text">${args.join(" ")}</span>`;
    },

    uname: (args) => {
      if (args.includes("-a")) {
        return `<span class="terminal-output-text">TanmayOS 6.4.2-tanmay x86_64 GNU/Linux</span>`;
      }
      return `<span class="terminal-output-text">TanmayOS</span>`;
    },

    ls: (args) => {
      const targetPath = args[0] || currentPath;
      const dir = resolvePath(targetPath);
      if (!dir || dir.type !== "dir") {
        return `<span class="terminal-error">ls: cannot access '${targetPath}': No such file or directory</span>`;
      }

      const entries = Object.entries(dir.children);
      if (entries.length === 0) {
        return `<span class="terminal-dim">(empty directory)</span>`;
      }

      return entries
        .map(([name, entry]) => {
          if (entry.type === "dir") {
            return `<span class="terminal-highlight terminal-bold">${name}/</span>`;
          }

          if (name.endsWith(".js")) return `<span class="terminal-warning">${name}</span>`;
          if (name.endsWith(".md")) return `<span style="color:#b44aff">${name}</span>`;
          if (name.endsWith(".json")) return `<span class="terminal-success">${name}</span>`;
          if (name.endsWith(".pdf")) return `<span class="terminal-error">${name}</span>`;
          if (name.startsWith(".")) return `<span class="terminal-dim">${name}</span>`;
          return `<span class="terminal-output-text">${name}</span>`;
        })
        .join("   ");
    },

    cd: (args) => {
      if (!args[0] || args[0] === "~") {
        currentPath = "~";
        return "";
      }

      if (args[0] === "..") {
        if (currentPath === "~") return "";
        const parts = currentPath.split("/");
        parts.pop();
        currentPath = parts.join("/") || "~";
        return "";
      }

      const newPath =
        args[0].startsWith("~") || args[0].startsWith("/")
          ? args[0].replace("/home/tanmay", "~")
          : currentPath + "/" + args[0];

      const dir = resolvePath(newPath);
      if (!dir || dir.type !== "dir") {
        return `<span class="terminal-error">cd: no such file or directory: ${args[0]}</span>`;
      }

      currentPath = newPath;
      return "";
    },

    cat: (args) => {
      if (!args[0]) {
        return `<span class="terminal-error">cat: missing operand</span>`;
      }

      const filePath =
        args[0].startsWith("~") || args[0].startsWith("/")
          ? args[0].replace("/home/tanmay", "~")
          : currentPath + "/" + args[0];

      const file = resolvePath(filePath);
      if (!file) {
        return `<span class="terminal-error">cat: ${args[0]}: No such file or directory</span>`;
      }
      if (file.type === "dir") {
        return `<span class="terminal-error">cat: ${args[0]}: Is a directory</span>`;
      }

      return `<span class="terminal-output-text">${escapeHtml(file.content)}</span>`;
    },

    history: () => {
      if (commandHistory.length === 0) {
        return `<span class="terminal-dim">(no history)</span>`;
      }
      return commandHistory
        .map(
          (cmd, i) =>
            `<span class="terminal-dim">${String(i + 1).padStart(4)}</span>  ${cmd}`
        )
        .join("\n");
    },

    neofetch: () => {
      const si = PORTFOLIO_DATA.systemInfo;
      const uptime = getUptime();
      const infoLines = [
        `<span class="neofetch-label">${PORTFOLIO_DATA.personal.name.toLowerCase()}@portfolio</span>`,
        `<span class="terminal-dim">────────────────────</span>`,
        `<span class="neofetch-label">OS:</span> <span class="neofetch-value">${si.os}</span>`,
        `<span class="neofetch-label">Kernel:</span> <span class="neofetch-value">${si.kernel}</span>`,
        `<span class="neofetch-label">Uptime:</span> <span class="neofetch-value">${uptime}</span>`,
        `<span class="neofetch-label">Shell:</span> <span class="neofetch-value">${si.shell}</span>`,
        `<span class="neofetch-label">Resolution:</span> <span class="neofetch-value">${window.innerWidth}x${window.innerHeight}</span>`,
        `<span class="neofetch-label">DE:</span> <span class="neofetch-value">${si.de}</span>`,
        `<span class="neofetch-label">WM:</span> <span class="neofetch-value">${si.wm}</span>`,
        `<span class="neofetch-label">Theme:</span> <span class="neofetch-value">${si.theme}</span>`,
        `<span class="neofetch-label">Terminal:</span> <span class="neofetch-value">${si.terminal}</span>`,
        `<span class="neofetch-label">CPU:</span> <span class="neofetch-value">${si.cpu}</span>`,
        ``,
        `<span style="background:#ff5f57;color:#ff5f57">██</span><span style="background:#ffbd2e;color:#ffbd2e">██</span><span style="background:#28c840;color:#28c840">██</span><span style="background:#00ffd5;color:#00ffd5">██</span><span style="background:#b44aff;color:#b44aff">██</span><span style="background:#ff6b6b;color:#ff6b6b">██</span><span style="background:#ffd93d;color:#ffd93d">██</span><span style="background:#6bff8a;color:#6bff8a">██</span>`,
      ];

      const asciiLines = NEOFETCH_ASCII.split("\n");
      const maxAsciiWidth = Math.max(...asciiLines.map((l) => l.length));

      let output = `<div class="neofetch-container"><div class="neofetch-ascii">`;
      const maxLines = Math.max(asciiLines.length, infoLines.length);

      for (let i = 0; i < maxLines; i++) {
        const asciiLine = (asciiLines[i] || "").padEnd(maxAsciiWidth);
        const infoLine = infoLines[i] || "";
        output += `<span class="terminal-highlight">${asciiLine}</span>   ${infoLine}\n`;
      }

      output += `</div></div>`;
      return output;
    },

    sudo: () => {
      return `<span class="terminal-error">Nice try! 😏 But you don't have root privileges here.</span>
<span class="terminal-dim">This incident will be reported... just kidding.</span>`;
    },

    rm: (args) => {
      if (args.join(" ").includes("-rf /") || args.join(" ").includes("-rf ~")) {
        return `<span class="terminal-error">🚨 ABORT ABORT ABORT!</span>
<span class="terminal-warning">Nice try, but I'm not destroying my own portfolio.</span>
<span class="terminal-dim">rm: permission denied (and also, why would you do that?)</span>`;
      }
      return `<span class="terminal-error">rm: permission denied</span>`;
    },

    exit: () => {
      if (windowId) {
        setTimeout(() => WindowManager.closeWindow(windowId), 200);
      }
      return `<span class="terminal-dim">Goodbye! 👋</span>`;
    },

    man: (args) => {
      if (!args[0]) {
        return `<span class="terminal-error">What manual page do you want?\nFor example, try 'man help'</span>`;
      }
      return `<span class="terminal-dim">No manual entry for '${args[0]}'.\nThis is TanmayOS, not a real Linux distro 😄\nTry 'help' for available commands.</span>`;
    },

    wget: () => {
      return `<span class="terminal-dim">wget: This is a portfolio, not a server. But I appreciate the enthusiasm! 🎯</span>`;
    },

    git: (args) => {
      if (args[0] === "status") {
        return `<span class="terminal-success">On branch main
Your portfolio is up to date with 'origin/main'.

nothing to commit, working tree clean ✨</span>`;
      }
      return `<span class="terminal-dim">git: Try 'git status' for something fun.</span>`;
    },

    ping: (args) => {
      const target = args[0] || "localhost";
      return `<span class="terminal-output-text">PING ${target}: 64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.042ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.038ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.041ms

--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
</span>`;
    },

    cowsay: (args) => {
      const message = args.join(" ") || "Moo! Welcome to TanmayOS!";
      const border = "_".repeat(message.length + 2);
      return `<span class="terminal-output-text"> ${border}
&lt; ${message} &gt;
 ${"-".repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||</span>`;
    },
  };

  function resolvePath(path) {
    let normalizedPath = path;
    if (normalizedPath.startsWith("/home/tanmay")) {
      normalizedPath = "~" + normalizedPath.slice(12);
    }

    if (
      !normalizedPath.startsWith("~") &&
      !normalizedPath.startsWith("/")
    ) {
      normalizedPath = currentPath + "/" + normalizedPath;
    }

    const parts = normalizedPath.split("/").filter(Boolean);
    let current = PORTFOLIO_DATA.filesystem["~"];

    if (parts[0] === "~") {
      parts.shift();
    }

    for (const part of parts) {
      if (part === "..") continue;
      if (!current || !current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }

    return current;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getUptime() {
    if (!window._tanmayos_start) window._tanmayos_start = Date.now();
    const diff = Date.now() - window._tanmayos_start;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  function executeCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return "";

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === "sudo") {
      if (args.length === 0) {
        return `<span class="terminal-error">usage: sudo command</span>`;
      }
      return COMMANDS.sudo();
    }

    if (COMMANDS[cmd]) {
      return COMMANDS[cmd](args);
    }

    return `<span class="terminal-error">Command not found: ${escapeHtml(cmd)}</span>
<span class="terminal-dim">Type 'help' for available commands.</span>`;
  }

  function getPromptHtml() {
    const pathDisplay = currentPath === "~" ? "~" : currentPath.replace("~/", "");
    return `<span class="terminal-prompt-prefix">${PORTFOLIO_DATA.personal.name.toLowerCase()}@portfolio</span><span class="terminal-prompt-symbol">:</span><span class="terminal-prompt-path">${pathDisplay}</span><span class="terminal-prompt-symbol">$ </span>`;
  }

  function open() {
    const contentHtml = `
      <div class="terminal-container" id="terminal-app">
        <div class="terminal-output" id="terminal-output">
          <div class="terminal-line">
            <span class="terminal-highlight terminal-bold">Welcome to TanmayOS Terminal v1.0</span>
          </div>
          <div class="terminal-line">
            <span class="terminal-dim">Type '<span class="terminal-highlight">help</span>' for available commands.</span>
          </div>
          <div class="terminal-line">&nbsp;</div>
        </div>
        <div class="terminal-input-line">
          ${getPromptHtml()}
          <input type="text" id="terminal-input" autofocus spellcheck="false" autocomplete="off" />
        </div>
      </div>
    `;

    windowId = WindowManager.createWindow("terminal", "Terminal", contentHtml, {
      width: 720,
      height: 480,
      icon: Desktop.ICONS.terminal,
      singleInstance: true,
      onFocus: () => {
        const input = document.getElementById("terminal-input");
        if (input) setTimeout(() => input.focus(), 50);
      },
      onClose: () => {
        windowId = null;
      },
    });

    setTimeout(() => {
      const input = document.getElementById("terminal-input");
      const output = document.getElementById("terminal-output");

      if (!input || !output) return;

      input.focus();

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const value = input.value;
          const promptHtml = getPromptHtml();

          const cmdLine = document.createElement("div");
          cmdLine.className = "terminal-line";
          cmdLine.innerHTML = `${promptHtml}<span class="terminal-command">${escapeHtml(value)}</span>`;
          output.appendChild(cmdLine);

          const result = executeCommand(value);

          if (result === "__CLEAR__") {
            output.innerHTML = "";
          } else if (result) {
            const resultLine = document.createElement("div");
            resultLine.className = "terminal-line";
            resultLine.innerHTML = result;
            output.appendChild(resultLine);

            const spacer = document.createElement("div");
            spacer.className = "terminal-line";
            spacer.innerHTML = "&nbsp;";
            output.appendChild(spacer);
          }

          const promptContainer = input.closest(".terminal-input-line");
          if (promptContainer) {

            const prefix = promptContainer.querySelector(".terminal-prompt-prefix");
            const path = promptContainer.querySelector(".terminal-prompt-path");
            if (path) {
              path.textContent = currentPath === "~" ? "~" : currentPath.replace("~/", "");
            }
          }

          input.value = "";
          output.scrollTop = output.scrollHeight;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
          } else {
            historyIndex = commandHistory.length;
            input.value = "";
          }
        } else if (e.key === "Tab") {
          e.preventDefault();

          const partial = input.value.trim().toLowerCase();
          const matches = Object.keys(COMMANDS).filter((cmd) =>
            cmd.startsWith(partial)
          );
          if (matches.length === 1) {
            input.value = matches[0] + " ";
          }
        } else if (e.key === "l" && e.ctrlKey) {
          e.preventDefault();
          output.innerHTML = "";
        }
      });

      const container = document.getElementById("terminal-app");
      if (container) {
        container.addEventListener("click", () => input.focus());
      }
    }, 100);
  }

  return { open };
})();
