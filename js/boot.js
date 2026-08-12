

const Boot = (() => {
  const BOOT_LINES = [
    { text: "TanmayOS BIOS v1.2.2", delay: 0, color: "#ffffffff" },
    { text: "Copyright (C) 2024 TanmayOS Foundation", delay: 80, color: "#ffffffff" },
    { text: "", delay: 120 },
    { text: "Linux version 6.4.2-tanmay (root@build-server) (gcc version 12.2.0, GNU ld 2.39) #1 SMP PREEMPT_DYNAMIC", delay: 150, color: "#ffffffff" },
    { text: "ACPI: Core revision 20240322", delay: 180, color: "#ffffffff" },
    { text: "Checking memory... 16384 MB OK", delay: 200, color: "#ffffffff" },
    { text: "smpboot: CPU0: Neural Engine @ ∞ GHz (family: 0x19, model: 0x21, stepping: 0x0)", delay: 260, color: "#ffffffff" },
    { text: "Performance Events: PEBS fmt4, AMD PMU driver.", delay: 290, color: "#ffffffff" },
    { text: "random: crng init done", delay: 320, color: "#ffffffff" },
    { text: "pci 0000:00:00.0: [1022:1482] type 00 class 0x060000", delay: 350, color: "#ffffffff" },
    { text: "Detecting GPU... Creativity Core v4.2 [Active]", delay: 380, color: "#ffffffff" },
    { text: "Console: colour dummy device 80x25", delay: 410, color: "#ffffffff" },
    { text: "Loading kernel modules...", delay: 460, color: "#888" },
    { text: "  [OK] Loaded module: creativity.ko", delay: 540, color: "#ffffffff" },
    { text: "  [OK] Loaded module: problem-solving.ko", delay: 600, color: "#ffffffff" },
    { text: "  [OK] Loaded module: caffeine-driver.ko", delay: 660, color: "#ffffffff" },
    { text: "  [OK] Loaded module: dark-mode.ko", delay: 720, color: "#ffffffff" },
    { text: "usb 1-1: new high-speed USB device number 2 using xhci_hcd", delay: 750, color: "#ffffffff" },
    { text: "Bluetooth: Core ver 2.22", delay: 770, color: "#ffffffff" },
    { text: "e1000e 0000:00:1f.6 eth0: (PCI Express:2.5GT/s:Width x1) MAC: 00:1a:2b:3c:4d:5e", delay: 800, color: "#ffffffff" },
    { text: "e1000e 0000:00:1f.6 eth0: Intel(R) PRO/1000 Network Connection", delay: 820, color: "#ffffffff" },
    { text: "", delay: 830 },
    { text: "Mounting filesystems...", delay: 840, color: "#888" },
    { text: "  [OK] Mounted /dev/portfolio on /home/tanmay", delay: 920, color: "#ffffffff" },
    { text: "  [OK] Mounted /dev/projects on /home/tanmay/Projects", delay: 980, color: "#ffffffff" },
    { text: "  [OK] Mounted /dev/skills on /usr/local/skills", delay: 1040, color: "#ffffffff" },
    { text: "EXT4-fs (sda1): re-mounted. Opts: (null). Quota mode: none.", delay: 1050, color: "#ffffffff" },
    { text: "Starting Systemd Services...", delay: 1070, color: "#888" },
    { text: "  [OK] Started D-Bus System Message Bus.", delay: 1075, color: "#ffffffff" },
    { text: "  [OK] Started Network Manager.", delay: 1090, color: "#ffffffff" },
    { text: "  [OK] Started WPA supplicant.", delay: 1095, color: "#ffffffff" },
    { text: "  [OK] Reached target Graphical Interface.", delay: 1110, color: "#ffffffff" },
    { text: "", delay: 1130 },
    { text: "Starting TanmayDE desktop environment...", delay: 1160, color: "#00ffd5" },
    { text: "Initializing window manager (TanmayWM)...", delay: 1240, color: "#00ffd5" },
    { text: "Loading user preferences...", delay: 1320, color: "#888" },
    { text: "", delay: 1380 },
    { text: "Welcome to TanmayOS.", delay: 1440, color: "#00ffd5" },
  ];

  const ASCII_LOGO = `
 **********                                                     *******    ********
/////**///                                            **   **  **/////**  **////// 
    /**      ******   *******  **********   ******   //** **  **     //**/**       
    /**     //////** //**///**//**//**//** //////**   //***  /**      /**/*********
    /**      *******  /**  /** /** /** /**  *******    /**   /**      /**////////**
    /**     **////**  /**  /** /** /** /** **////**    **    //**     **        /**
    /**    //******** ***  /** *** /** /**//********  **      //*******   ******** 
    //      //////// ///   // ///  //  //  ////////  //        ///////   ////////  
                        ╔═══════════════════════╗
                        ║ <span style="color: white;">v1.2.2</span> ║
                        ╚═══════════════════════╝`;

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
        bootLogo.innerHTML = "";
        
        bootProgressBar.style.display = "block";
        bootProgressBar.style.visibility = "hidden";

        let logoIndex = 0;
        let logoHtml = "";
        let isTag = false;

        function typeLogo() {
          if (skipped) return;
          if (logoIndex < ASCII_LOGO.length) {
            let charsProcessed = 0;
            while (logoIndex < ASCII_LOGO.length && charsProcessed < 8) {
              let char = ASCII_LOGO.charAt(logoIndex);
              if (char === '<') isTag = true;
              logoHtml += char;
              logoIndex++;
              charsProcessed++;
              
              if (isTag) {
                while (logoIndex < ASCII_LOGO.length && ASCII_LOGO.charAt(logoIndex - 1) !== '>') {
                  logoHtml += ASCII_LOGO.charAt(logoIndex);
                  logoIndex++;
                }
                isTag = false;
              }
            }
            
            bootLogo.innerHTML = logoHtml;
            setTimeout(typeLogo, 10);
          } else {
            setTimeout(() => {
              if (skipped) return;
              bootProgressBar.style.visibility = "visible";

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
            }, 300);
          }
        }
        
        typeLogo();
      }, 500);
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
