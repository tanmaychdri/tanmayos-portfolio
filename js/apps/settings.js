

const SettingsApp = (() => {
  let windowId = null;
  let activeTab = "appearance";

  const ACCENT_COLORS = [
    { name: "Cyan", value: "#00ffd5" },
    { name: "Purple", value: "#b44aff" },
    { name: "Green", value: "#6bff8a" },
    { name: "Orange", value: "#ff9f43" },
    { name: "Pink", value: "#ff6b9d" },
    { name: "Blue", value: "#4a9eff" },
    { name: "Red", value: "#ff5f57" },
    { name: "Yellow", value: "#ffd93d" },
  ];

  function renderTab(container) {
    const main = container.querySelector(".settings-main");
    if (!main) return;

    if (activeTab === "appearance") {
      renderAppearanceTab(main);
    } else if (activeTab === "about") {
      renderAboutTab(main);
    }

    container.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.tab === activeTab);
    });
  }

  function renderAppearanceTab(main) {
    const currentWallpaper = localStorage.getItem("tanmayos-wallpaper") || "default";
    const currentAccent = localStorage.getItem("tanmayos-accent") || "#00ffd5";
    const scanlinesEnabled = localStorage.getItem("tanmayos-scanlines") === "true";
    const grayscaleEnabled = localStorage.getItem("tanmayos-grayscale") === "true";
    const windowOpacity = localStorage.getItem("tanmayos-window-opacity") || "0.95";

    main.innerHTML = `
      <div class="settings-section-title">Appearance</div>

      <div class="settings-group">
        <div class="settings-group-title">Wallpaper</div>
        <div class="wallpaper-grid">
          ${Object.entries(Desktop.WALLPAPERS)
            .map(
              ([id, wp]) => `
            <div class="wallpaper-option ${id === currentWallpaper ? "active" : ""}"
                 data-wallpaper="${id}"
                 title="${wp.name}"
                 style="background: ${wp.css};">
            </div>
          `
            )
            .join("")}
        </div>
        <div style="margin-top: 8px;">
          <button id="btn-upload-wallpaper" style="padding: 4px 12px; width: 100%; background: #1a1a1a; border: 1px solid #444; color: #ccc; cursor: pointer; font-family: var(--font-mono); font-size: 11px;">
            Upload Custom Wallpaper
          </button>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-title">Accent Color</div>
        <div class="settings-option">
          <div>
            <div class="settings-option-label">Primary Accent</div>
            <div class="settings-option-desc">Used for highlights and interactive elements</div>
          </div>
          <div class="color-picker-swatches">
            ${ACCENT_COLORS.map(
              (c) => `
              <div class="color-swatch ${c.value === currentAccent ? "active" : ""}"
                   data-color="${c.value}"
                   title="${c.name}"
                   style="background: ${c.value};">
              </div>
            `
            ).join("")}
          </div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-title">Effects</div>

        <div class="settings-option">
          <div>
            <div class="settings-option-label">CRT Scanlines</div>
            <div class="settings-option-desc">Retro scanline overlay effect</div>
          </div>
          <div class="toggle-switch ${scanlinesEnabled ? "active" : ""}" data-setting="scanlines"></div>
        </div>

        <div class="settings-option">
          <div>
            <div class="settings-option-label">Grayscale Wallpaper</div>
            <div class="settings-option-desc">Apply a gray tint to colorful wallpapers</div>
          </div>
          <div class="toggle-switch ${grayscaleEnabled ? "active" : ""}" data-setting="grayscale"></div>
        </div>

        <div class="settings-option">
          <div>
            <div class="settings-option-label">Window Opacity</div>
            <div class="settings-option-desc">Transparency level for windows</div>
          </div>
          <input type="range" class="settings-slider" min="0.5" max="1" step="0.05"
                 value="${windowOpacity}" data-setting="opacity" />
        </div>
      </div>
    `;

    main.querySelectorAll(".wallpaper-option").forEach((option) => {
      option.addEventListener("click", () => {
        main.querySelectorAll(".wallpaper-option").forEach((o) => o.classList.remove("active"));
        option.classList.add("active");
        Desktop.setWallpaper(option.dataset.wallpaper);
      });
    });

    const uploadBtn = main.querySelector("#btn-upload-wallpaper");
    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        Desktop.uploadWallpaper();
        main.querySelectorAll(".wallpaper-option").forEach((o) => o.classList.remove("active"));
      });
    }

    main.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        main.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");
        Desktop.setAccentColor(swatch.dataset.color);
      });
    });

    main.querySelectorAll(".toggle-switch").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        const setting = toggle.dataset.setting;
        const enabled = toggle.classList.contains("active");

        if (setting === "scanlines") {
          Desktop.toggleScanlines(enabled);
        } else if (setting === "grayscale") {
          Desktop.toggleGrayscale(enabled);
        }
      });
    });

    main.querySelectorAll(".settings-slider").forEach((slider) => {
      slider.addEventListener("input", () => {
        const setting = slider.dataset.setting;
        if (setting === "opacity") {
          Desktop.setWindowOpacity(slider.value);
        }
      });
    });
  }

  function renderAboutTab(main) {
    const si = PORTFOLIO_DATA.systemInfo;
    main.innerHTML = `
      <div class="settings-about">
        <div class="settings-about-logo">TanmayOS</div>
        <div class="settings-about-version">Version 1.2.2 (Neon)</div>
        <div class="settings-about-info">
          <div class="about-info-row">
            <span class="about-info-label">OS Name</span>
            <span class="about-info-value">${si.os}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Kernel</span>
            <span class="about-info-value">${si.kernel}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Desktop</span>
            <span class="about-info-value">${si.de}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Window Manager</span>
            <span class="about-info-value">${si.wm}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Shell</span>
            <span class="about-info-value">${si.shell}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Theme</span>
            <span class="about-info-value">${si.theme}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Terminal</span>
            <span class="about-info-value">${si.terminal}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">CPU</span>
            <span class="about-info-value">${si.cpu}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Resolution</span>
            <span class="about-info-value">${window.innerWidth}x${window.innerHeight}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Developer</span>
            <span class="about-info-value">${PORTFOLIO_DATA.personal.fullName}</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">Built With</span>
            <span class="about-info-value">HTML, CSS, Vanilla JS</span>
          </div>
          <div class="about-info-row">
            <span class="about-info-label">License</span>
            <span class="about-info-value">MIT</span>
          </div>
        </div>
      </div>
    `;
  }

  function open() {
    const contentHtml = `
      <div class="settings-container">
        <div class="settings-sidebar">
          <div class="settings-sidebar-title"># Settings</div>
          <div class="settings-nav-item active" data-tab="appearance">
            ${Desktop.ICONS.appearance}
            <span>Appearance</span>
          </div>
          <div class="settings-nav-item" data-tab="about">
            ${Desktop.ICONS.info}
            <span>About</span>
          </div>
        </div>
        <div class="settings-main"></div>
      </div>
    `;

    windowId = WindowManager.createWindow("settings", "Settings", contentHtml, {
      width: 700,
      height: 520,
      icon: Desktop.ICONS.settings,
      singleInstance: true,
      onClose: () => {
        windowId = null;
        activeTab = "appearance";
      },
    });

    setTimeout(() => {
      const winEl = document.getElementById(windowId);
      if (!winEl) return;

      const container = winEl.querySelector(".settings-container");

      container.querySelectorAll(".settings-nav-item").forEach((item) => {
        item.addEventListener("click", () => {
          activeTab = item.dataset.tab;
          renderTab(container);
        });
      });

      renderTab(container);
    }, 100);
  }

  return { open };
})();
