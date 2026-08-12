

const Desktop = (() => {

  const ICONS = {
    terminal: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="40" height="36" fill="#111" stroke="#aaa" stroke-width="1.5"/>
      <path d="M12 18l6 5-6 5" stroke="#aaa" stroke-width="2" stroke-linejoin="miter"/>
      <line x1="22" y1="28" x2="32" y2="28" stroke="#555" stroke-width="2"/>
    </svg>`,
    fileExplorer: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14V38h36V18H24l-4-4H6z" fill="#111" stroke="#aaa" stroke-width="1.5" stroke-linejoin="miter"/>
      <line x1="6" y1="18" x2="42" y2="18" stroke="#aaa" stroke-width="1" opacity="0.4"/>
    </svg>`,
    settings: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6h8l1.5 5a12 12 0 013.5 2l4.5-2 4 7-3.5 3.5a12 12 0 010 4L41 29l-4 7-4.5-2a12 12 0 01-3.5 2L27.5 42h-8L18 36a12 12 0 01-3.5-2L10 36l-4-7 3.5-3.5a12 12 0 010-4L6 18l4-7 4.5 2a12 12 0 013.5-2L20 6z" fill="#111" stroke="#aaa" stroke-width="1.5" stroke-linejoin="miter"/>
      <rect x="19" y="19" width="10" height="10" stroke="#aaa" stroke-width="1.5" fill="none"/>
    </svg>`,
    notepad: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="32" height="40" fill="#111" stroke="#aaa" stroke-width="1.5"/>
      <line x1="14" y1="14" x2="34" y2="14" stroke="#555" stroke-width="1.5"/>
      <line x1="14" y1="20" x2="30" y2="20" stroke="#555" stroke-width="1.5"/>
      <line x1="14" y1="26" x2="34" y2="26" stroke="#555" stroke-width="1.5"/>
      <line x1="14" y1="32" x2="26" y2="32" stroke="#555" stroke-width="1.5"/>
    </svg>`,
    browser: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="40" height="36" fill="#111" stroke="#aaa" stroke-width="1.5"/>
      <line x1="4" y1="14" x2="44" y2="14" stroke="#aaa" stroke-width="1"/>
      <rect x="8" y="9" width="16" height="3" fill="#222" stroke="#555" stroke-width="0.5"/>
      <line x1="16" y1="22" x2="32" y2="22" stroke="#555" stroke-width="1"/>
      <line x1="16" y1="26" x2="28" y2="26" stroke="#555" stroke-width="1"/>
      <line x1="16" y1="30" x2="32" y2="30" stroke="#555" stroke-width="1"/>
    </svg>`,
    trash: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 16h20l-2 24H16L14 16z" fill="#111" stroke="#aaa" stroke-width="1.5" stroke-linejoin="miter"/>
      <line x1="12" y1="12" x2="36" y2="12" stroke="#aaa" stroke-width="2"/>
      <path d="M18 12V8h12v4" fill="none" stroke="#aaa" stroke-width="1.5" stroke-linejoin="miter"/>
      <line x1="20" y1="20" x2="20" y2="34" stroke="#555" stroke-width="1"/>
      <line x1="24" y1="20" x2="24" y2="34" stroke="#555" stroke-width="1"/>
      <line x1="28" y1="20" x2="28" y2="34" stroke="#555" stroke-width="1"/>
    </svg>`,
    folder: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7V19h18V9h-9l-2-2H3z" fill="#111" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
    </svg>`,
    file: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6v20h12V8z" fill="#111" stroke="#888" stroke-width="1" stroke-linejoin="miter"/>
      <path d="M14 2v6h6" stroke="#888" stroke-width="1" stroke-linejoin="miter"/>
    </svg>`,
    fileTxt: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6v20h12V8z" fill="#111" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <path d="M14 2v6h6" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="#555" stroke-width="1"/>
      <line x1="8" y1="17" x2="13" y2="17" stroke="#555" stroke-width="1"/>
    </svg>`,
    filePdf: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6v20h12V8z" fill="#111" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <path d="M14 2v6h6" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <text x="7" y="18" font-size="6" fill="#aaa" font-family="monospace" font-weight="bold">PDF</text>
    </svg>`,
    fileJs: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6v20h12V8z" fill="#111" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <path d="M14 2v6h6" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <text x="7" y="18" font-size="6" fill="#aaa" font-family="monospace" font-weight="bold">JS</text>
    </svg>`,
    fileMd: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6v20h12V8z" fill="#111" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <path d="M14 2v6h6" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <text x="6" y="18" font-size="5" fill="#aaa" font-family="monospace" font-weight="bold">MD</text>
    </svg>`,
    fileJson: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6v20h12V8z" fill="#111" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <path d="M14 2v6h6" stroke="#aaa" stroke-width="1" stroke-linejoin="miter"/>
      <text x="5" y="18" font-size="4.5" fill="#aaa" font-family="monospace" font-weight="bold">{..}</text>
    </svg>`,

    wifi: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/><path d="M4.3 9.7a5.2 5.2 0 017.4 0l-1.1 1.1a3.5 3.5 0 00-5.2 0L4.3 9.7z"/><path d="M2 7.4a8.7 8.7 0 0112 0L12.9 8.5a7 7 0 00-9.8 0L2 7.4z"/></svg>`,
    battery: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="4" width="12" height="8" stroke="currentColor" stroke-width="1" fill="none"/><rect x="2.5" y="5.5" width="8" height="5" fill="currentColor" opacity="0.6"/><rect x="13" y="6" width="2" height="4" fill="currentColor"/></svg>`,
    volume: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 6h2l3-3v10L5 10H3V6z"/><path d="M10.5 4.5a5 5 0 010 7" stroke="currentColor" stroke-width="1" fill="none"/></svg>`,
    launcher: `<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" stroke="currentColor" stroke-width="1.5"/><path d="M8 7l4 3-4 3z" fill="currentColor"/></svg>`,

    arrowLeft: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
    arrowRight: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
    arrowUp: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 10l4-4 4 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
    home: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 8l6-6 6 6M4 7v6h3v-4h2v4h3V7" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,

    wallpaper: `<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.2"/><rect x="5" y="5" width="3" height="3" fill="currentColor"/><path d="M2 11l3-3 2 2 3-3 4 4v1H2v-1z" fill="currentColor" opacity="0.3"/></svg>`,
    info: `<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.2"/><path d="M8 7v4M8 5v0.5" stroke="currentColor" stroke-width="1.5"/></svg>`,
    refresh: `<svg viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0111.5-2.3M14 8a6 6 0 01-11.5 2.3" stroke="currentColor" stroke-width="1.2"/><path d="M13 2v4h-4M3 14v-4h4" stroke="currentColor" stroke-width="1.2"/></svg>`,
    appearance: `<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.2"/><path d="M8 2v12" stroke="currentColor" stroke-width="1"/><rect x="8" y="2" width="6" height="12" fill="currentColor" opacity="0.15"/></svg>`,
  };

  const DESKTOP_APPS = [
    { id: "terminal", label: "Terminal", icon: ICONS.terminal },
    { id: "fileExplorer", label: "Files", icon: ICONS.fileExplorer },
    { id: "settings", label: "Settings", icon: ICONS.settings },
    { id: "notepad", label: "Notepad", icon: ICONS.notepad },
    { id: "browser", label: "Projects", icon: ICONS.browser },
    { id: "trash", label: "Trash", icon: ICONS.trash },
  ];

  const WALLPAPERS = {
    default: {
      name: "Default",
      css: `url('assets/default-wall.png') center/cover no-repeat`,
    },
  };

  let selectedIcon = null;

  function init() {
    renderDesktopIcons();
    setupContextMenu();
    loadWallpaper();
    loadScanlinePreference();
    loadGrayscalePreference();
  }

  function renderDesktopIcons() {
    const container = document.getElementById("desktop-icons");
    if (!container) return;

    container.innerHTML = "";
    
    const savedPositions = JSON.parse(localStorage.getItem("tanmayos-icon-positions") || "{}");
    const GRID_W = 80;
    const GRID_H = 100;
    
    let startX = 20;
    let startY = 20;

    DESKTOP_APPS.forEach((app) => {
      const iconEl = document.createElement("div");
      iconEl.className = "desktop-icon";
      iconEl.dataset.appId = app.id;
      iconEl.innerHTML = `
        <div class="icon-image">${app.icon}</div>
        <div class="icon-label">${app.label}</div>
      `;

      let posX = startX;
      let posY = startY;

      if (savedPositions[app.id]) {
        posX = savedPositions[app.id].x;
        posY = savedPositions[app.id].y;
      } else {
        startY += GRID_H;
        if (startY > window.innerHeight - 150) {
          startY = 20;
          startX += GRID_W;
        }
      }

      iconEl.style.left = posX + "px";
      iconEl.style.top = posY + "px";
      
      let moved = false;
      
      iconEl.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; 
        let isDragging = false;
        let startMouseX = e.clientX;
        let startMouseY = e.clientY;
        let startIconX = parseInt(iconEl.style.left || 0, 10);
        let startIconY = parseInt(iconEl.style.top || 0, 10);
        
        moved = false;
        iconEl.style.zIndex = 100;

        function onMouseMove(moveEvent) {
          const dx = moveEvent.clientX - startMouseX;
          const dy = moveEvent.clientY - startMouseY;
          
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
              isDragging = true;
              moved = true;
          }
          
          if (isDragging) {
            iconEl.style.left = (startIconX + dx) + "px";
            iconEl.style.top = (startIconY + dy) + "px";
          }
        }

        function onMouseUp(upEvent) {
          iconEl.style.zIndex = "";
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          
          if (isDragging) {
              let finalX = parseInt(iconEl.style.left || 0, 10);
              let finalY = parseInt(iconEl.style.top || 0, 10);
              
              // Snap to grid
              finalX = Math.round((finalX - 20) / GRID_W) * GRID_W + 20; 
              finalY = Math.round((finalY - 20) / GRID_H) * GRID_H + 20;
              
              finalX = Math.max(20, Math.min(finalX, window.innerWidth - GRID_W));
              finalY = Math.max(20, Math.min(finalY, window.innerHeight - GRID_H - 40));

              // Check for overlapping icons to swap
              const allIcons = document.querySelectorAll('.desktop-icon');
              let overlappingIcon = null;
              
              allIcons.forEach(otherIcon => {
                  if (otherIcon !== iconEl) {
                      const otherX = parseInt(otherIcon.style.left || 0, 10);
                      const otherY = parseInt(otherIcon.style.top || 0, 10);
                      if (otherX === finalX && otherY === finalY) {
                          overlappingIcon = otherIcon;
                      }
                  }
              });

              const positions = JSON.parse(localStorage.getItem("tanmayos-icon-positions") || "{}");

              if (overlappingIcon) {
                  // Swap position with the overlapping icon
                  overlappingIcon.style.left = startIconX + "px";
                  overlappingIcon.style.top = startIconY + "px";
                  positions[overlappingIcon.dataset.appId] = { x: startIconX, y: startIconY };
              }

              iconEl.style.left = finalX + "px";
              iconEl.style.top = finalY + "px";
              positions[app.id] = { x: finalX, y: finalY };
              
              localStorage.setItem("tanmayos-icon-positions", JSON.stringify(positions));
              
              setTimeout(() => { moved = false; }, 0);
          }
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      iconEl.addEventListener("click", (e) => {
        if (moved) return;
        e.stopPropagation();
        selectIcon(iconEl);
      });

      iconEl.addEventListener("dblclick", (e) => {
        if (moved) return;
        e.stopPropagation();
        launchApp(app.id);
      });

      container.appendChild(iconEl);
    });

    document.getElementById("desktop").addEventListener("click", () => {
      deselectAll();
      hideContextMenu();
      hideAppMenu();
    });
  }

  function selectIcon(iconEl) {
    deselectAll();
    iconEl.classList.add("selected");
    selectedIcon = iconEl;
  }

  function deselectAll() {
    document.querySelectorAll(".desktop-icon.selected").forEach((el) => {
      el.classList.remove("selected");
    });
    selectedIcon = null;
  }

  function launchApp(appId) {
    switch (appId) {
      case "terminal":
        TerminalApp.open();
        break;
      case "fileExplorer":
        FileExplorerApp.open();
        break;
      case "settings":
        SettingsApp.open();
        break;
      case "notepad":
        NotepadApp.open();
        break;
      case "browser":
        BrowserApp.open();
        break;
      case "about":
        AboutApp.open();
        break;
      case "trash":
        showNotification(
          "Trash",
          "Trash is empty."
        );
        break;
    }
  }

  function setupContextMenu() {
    document.getElementById("desktop").addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY);
    });

    document.addEventListener("click", () => {
      hideContextMenu();
    });
  }

  function showContextMenu(x, y) {
    const menu = document.getElementById("context-menu");
    if (!menu) return;

    menu.innerHTML = `
      <div class="context-menu-item" data-action="open-terminal">
        ${ICONS.terminal.replace('viewBox="0 0 48 48"', 'viewBox="0 0 48 48" width="14" height="14"')}
        <span>Open Terminal</span>
      </div>
      <div class="context-menu-item" data-action="change-wallpaper">
        ${ICONS.wallpaper}
        <span>Change Wallpaper</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="refresh">
        ${ICONS.refresh}
        <span>Refresh Desktop</span>
      </div>
      <div class="context-menu-item" data-action="settings">
        ${ICONS.settings.replace('viewBox="0 0 48 48"', 'viewBox="0 0 48 48" width="14" height="14"')}
        <span>Display Settings</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="about">
        ${ICONS.info}
        <span>About TanmayOS</span>
      </div>
    `;

    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 32 - menu.offsetHeight - 10;
    menu.style.left = Math.min(x, maxX) + "px";
    menu.style.top = Math.min(y, maxY) + "px";
    menu.classList.add("visible");

    menu.querySelectorAll(".context-menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        handleContextMenuAction(item.dataset.action);
        hideContextMenu();
      });
    });
  }

  function hideContextMenu() {
    const menu = document.getElementById("context-menu");
    if (menu) menu.classList.remove("visible");
  }

  function handleContextMenuAction(action) {
    switch (action) {
      case "open-terminal":
        launchApp("terminal");
        break;
      case "change-wallpaper":
      case "settings":
        launchApp("settings");
        break;
      case "refresh":
        location.reload();
        break;
      case "about":
        launchApp("about");
        break;
    }
  }

  function toggleAppMenu() {
    const menu = document.getElementById("app-menu");
    if (!menu) return;

    if (menu.classList.contains("visible")) {
      hideAppMenu();
    } else {
      showAppMenu();
    }
  }

  function showAppMenu() {
    const menu = document.getElementById("app-menu");
    if (!menu) return;

    const gridHtml = DESKTOP_APPS.filter((a) => a.id !== "trash")
      .map(
        (app) => `
      <div class="app-menu-item" data-app-id="${app.id}">
        <div class="menu-item-icon">${app.icon}</div>
        <div class="menu-item-label">${app.label}</div>
      </div>
    `
      )
      .join("");

    const initial = PORTFOLIO_DATA.personal.name.charAt(0).toUpperCase();

    menu.innerHTML = `
      <div id="app-menu-header">
        <div class="menu-avatar">${initial}</div>
        <div class="menu-user-info">
          <div class="menu-user-name">${PORTFOLIO_DATA.personal.name}</div>
          <div class="menu-user-title">${PORTFOLIO_DATA.personal.title}</div>
        </div>
      </div>
      <input type="text" id="app-menu-search" placeholder="Search..." autocomplete="off" />
      <div id="app-menu-grid">${gridHtml}</div>
    `;

    menu.classList.add("visible");

    menu.querySelectorAll(".app-menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        launchApp(item.dataset.appId);
        hideAppMenu();
      });
    });

    const searchInput = document.getElementById("app-menu-search");
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      menu.querySelectorAll(".app-menu-item").forEach((item) => {
        const label = item.querySelector(".menu-item-label").textContent.toLowerCase();
        item.style.display = label.includes(query) ? "" : "none";
      });
    });

    setTimeout(() => searchInput.focus(), 50);
  }

  function hideAppMenu() {
    const menu = document.getElementById("app-menu");
    if (menu) menu.classList.remove("visible");
  }

  function setWallpaper(wallpaperId) {
    if (wallpaperId === 'custom') {
      const customData = localStorage.getItem("tanmayos-custom-wallpaper");
      if (customData) {
         const wallpaperEl = document.getElementById("desktop-wallpaper");
         if (wallpaperEl) wallpaperEl.style.background = `url(${customData}) center/cover no-repeat`;
         localStorage.setItem("tanmayos-wallpaper", 'custom');
      }
      return;
    }

    const wp = WALLPAPERS[wallpaperId];
    if (!wp) return;

    const wallpaperEl = document.getElementById("desktop-wallpaper");
    if (wallpaperEl) {
      wallpaperEl.style.background = wp.css;
    }

    localStorage.setItem("tanmayos-wallpaper", wallpaperId);
  }

  function loadWallpaper() {
    const saved = localStorage.getItem("tanmayos-wallpaper") || "default";
    setWallpaper(saved);
  }

  function uploadWallpaper() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        try {
          localStorage.setItem("tanmayos-custom-wallpaper", dataUrl);
          setWallpaper("custom");
        } catch (err) {

          const wallpaperEl = document.getElementById("desktop-wallpaper");
          if (wallpaperEl) wallpaperEl.style.background = `url(${dataUrl}) center/cover no-repeat`;
          localStorage.setItem("tanmayos-wallpaper", "custom");
          showNotification("Warning", "Image too large to save. It will reset on reload.");
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }



  function toggleScanlines(enabled) {
    const overlay = document.getElementById("scanline-overlay");
    if (overlay) {
      overlay.classList.toggle("active", enabled);
    }
    localStorage.setItem("tanmayos-scanlines", enabled);
  }

  function loadScanlinePreference() {
    const saved = localStorage.getItem("tanmayos-scanlines");
    if (saved === "true") {
      toggleScanlines(true);
    }
  }

  function toggleGrayscale(enabled) {
    const wallpaper = document.getElementById("desktop-wallpaper");
    if (wallpaper) {
      wallpaper.classList.toggle("grayscale-filter", enabled);
    }
    localStorage.setItem("tanmayos-grayscale", enabled);
  }

  function loadGrayscalePreference() {
    const saved = localStorage.getItem("tanmayos-grayscale");
    if (saved === "true") {
      toggleGrayscale(true);
    }
  }

  function setWindowOpacity(value) {
    document.documentElement.style.setProperty("--window-opacity", value);
    localStorage.setItem("tanmayos-window-opacity", value);
  }

  function showNotification(title, body) {
    const notif = document.createElement("div");
    notif.className = "os-notification";
    notif.innerHTML = `
      <div class="notification-title">${title}</div>
      <div class="notification-body">${body}</div>
    `;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.remove();
    }, 3000);
  }

  return {
    init,
    launchApp,
    toggleAppMenu,
    hideAppMenu,
    setWallpaper,
    uploadWallpaper,
    toggleScanlines,
    toggleGrayscale,
    setWindowOpacity,
    showNotification,
    ICONS,
    WALLPAPERS,
    DESKTOP_APPS,
  };
})();
