

const Boot = (() => {
  const BOOT_LINES = [
    { text: "TanmayOS BIOS v1.0.0", delay: 0, color: "#ffffffff" },
    { text: "Copyright (C) 2024 TanmayOS Foundation", delay: 80, color: "#ffffffff" },
    { text: "", delay: 120 },
    { text: "Checking memory... 16384 MB OK", delay: 200, color: "#ffffffff" },
    { text: "Detecting CPU... Neural Engine @ ∞ GHz", delay: 300, color: "#ffffffff" },
    { text: "Detecting GPU... Creativity Core v4.2", delay: 380, color: "#ffffffff" },
    { text: "Loading kernel modules...", delay: 460, color: "#888" },
    { text: "  [OK] Loaded module: creativity.ko", delay: 540, color: "#ffffffff" },
    { text: "  [OK] Loaded module: problem-solving.ko", delay: 600, color: "#ffffffff" },
    { text: "  [OK] Loaded module: caffeine-driver.ko", delay: 660, color: "#ffffffff" },
    { text: "  [OK] Loaded module: dark-mode.ko", delay: 720, color: "#ffffffff" },
    { text: "", delay: 780 },
    { text: "Mounting filesystems...", delay: 840, color: "#888" },
    { text: "  /dev/portfolio    mounted on /home/tanmay", delay: 920, color: "#ffffffff" },
    { text: "  /dev/projects     mounted on /home/tanmay/Projects", delay: 980, color: "#ffffffff" },
    { text: "  /dev/skills       mounted on /usr/local/skills", delay: 1040, color: "#ffffffff" },
    { text: "", delay: 1100 },
    { text: "Starting TanmayDE desktop environment...", delay: 1160, color: "#00ffd5" },
    { text: "Initializing window manager (TanmayWM)...", delay: 1240, color: "#00ffd5" },
    { text: "Loading user preferences...", delay: 1320, color: "#888" },
    { text: "", delay: 1380 },
    { text: "Welcome to TanmayOS.", delay: 1440, color: "#00ffd5" },
  ];

  const ASCII_LOGO = `
  ████████╗ █████╗ ███╗   ██╗███╗   ███╗ █████╗ ██╗   ██╗
  ╚══██╔══╝██╔══██╗████╗  ██║████╗ ████║██╔══██╗╚██╗ ██╔╝
     ██║   ███████║██╔██╗ ██║██╔████╔██║███████║ ╚████╔╝
     ██║   ██╔══██║██║╚██╗██║██║╚██╔╝██║██╔══██║  ╚██╔╝
     ██║   ██║  ██║██║ ╚████║██║ ╚═╝ ██║██║  ██║   ██║
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝
                        ╔═══════════════════╗
                        ║    OS  v1.0.0     ║
                        ╚═══════════════════╝`;

  let skipped = false;

  function init() {

    const bootSeen = sessionStorage.getItem("tanmayos-boot-seen");
    if (bootSeen) {
      skipToDesktop();
      return;
    }

    const bootScreen = document.getElementById("boot-screen");
    const bootText = document.getElementById("boot-text");
    const bootLogo = document.getElementById("boot-logo");
    const bootProgressBar = document.getElementById("boot-progress-bar");
    const bootProgressFill = document.getElementById("boot-progress-fill");

    if (!bootScreen) {
      skipToDesktop();
      return;
    }

    const skipHandler = () => {
      if (!skipped) {
        skipped = true;
        sessionStorage.setItem("tanmayos-boot-seen", "true");
        bootScreen.style.animation = "bootFadeOut 400ms ease forwards";
        setTimeout(() => {
          bootScreen.remove();
          showDesktop();
        }, 400);
      }
    };

    bootScreen.addEventListener("click", skipHandler);
    document.addEventListener("keydown", skipHandler, { once: false });

    runTextSequence(bootText, BOOT_LINES, () => {
      if (skipped) return;

      setTimeout(() => {
        if (skipped) return;
        bootText.style.display = "none";
        bootLogo.style.display = "block";
        bootLogo.textContent = ASCII_LOGO;

        setTimeout(() => {
          if (skipped) return;
          bootProgressBar.style.display = "block";

          let progress = 0;
          const progressInterval = setInterval(() => {
            if (skipped) {
              clearInterval(progressInterval);
              return;
            }
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
              progress = 100;
              clearInterval(progressInterval);

              setTimeout(() => {
                if (skipped) return;
                skipped = true;
                sessionStorage.setItem("tanmayos-boot-seen", "true");
                bootScreen.style.animation = "bootFadeOut 500ms ease forwards";
                setTimeout(() => {
                  bootScreen.remove();
                  showDesktop();
                }, 500);
              }, 300);
            }
            bootProgressFill.style.width = progress + "%";
          }, 60);
        }, 500);
      }, 300);
    });
  }

  function runTextSequence(container, lines, onComplete) {
    container.innerHTML = "";
    let currentIndex = 0;

    function showNextLine() {
      if (skipped || currentIndex >= lines.length) {
        if (!skipped && onComplete) onComplete();
        return;
      }

      const line = lines[currentIndex];
      const lineEl = document.createElement("div");
      lineEl.style.color = line.color || "#ffffffff";
      lineEl.textContent = line.text;
      container.appendChild(lineEl);

      container.scrollTop = container.scrollHeight;

      currentIndex++;
      const nextDelay =
        currentIndex < lines.length
          ? lines[currentIndex].delay - line.delay
          : 100;
      setTimeout(showNextLine, Math.max(nextDelay, 30));
    }

    setTimeout(showNextLine, 200);
  }

  function skipToDesktop() {
    const bootScreen = document.getElementById("boot-screen");
    if (bootScreen) bootScreen.remove();
    showDesktop();
  }

  function showDesktop() {
    const desktop = document.getElementById("desktop");
    const taskbar = document.getElementById("taskbar");

    if (desktop) {
      desktop.style.display = "block";
    }

    if (taskbar) {
      taskbar.style.display = "flex";
    }

    if (typeof Desktop !== "undefined") Desktop.init();
    if (typeof Taskbar !== "undefined") Taskbar.init();
  }

  return { init };
})();
