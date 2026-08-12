

const Taskbar = (() => {
  let apps = {};
  let clockInterval = null;

  function init() {
    setupLauncher();
    startClock();
  }

  function setupLauncher() {
    const launcher = document.getElementById("taskbar-launcher");
    if (launcher) {
      launcher.addEventListener("click", (e) => {
        e.stopPropagation();
        Desktop.toggleAppMenu();
      });
    }

    document.addEventListener("click", (e) => {
      if (
        !e.target.closest("#app-menu") &&
        !e.target.closest("#taskbar-launcher")
      ) {
        Desktop.hideAppMenu();
      }
    });
  }

  function addApp(windowId, appId, title, icon) {
    const container = document.getElementById("taskbar-apps");
    if (!container) return;

    const btn = document.createElement("button");
    btn.className = "taskbar-app-btn active";
    btn.id = `taskbar-btn-${windowId}`;
    btn.dataset.windowId = windowId;

    const iconSvg = icon
      ? `<span style="width:16px;height:16px;display:flex;align-items:center">${icon}</span>`
      : "";

    btn.innerHTML = `${iconSvg}<span class="app-label">${title}</span>`;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      WindowManager.toggleWindow(windowId);
    });

    container.appendChild(btn);

    apps[windowId] = { btn, appId, title };
  }

  function removeApp(windowId) {
    if (apps[windowId]) {
      apps[windowId].btn.remove();
      delete apps[windowId];
    }
  }

  function setActive(windowId) {
    Object.keys(apps).forEach((wId) => {
      apps[wId].btn.classList.toggle("active", wId === windowId);
    });
  }

  function setMinimized(windowId, minimized) {
    if (apps[windowId]) {
      apps[windowId].btn.classList.toggle("active", !minimized);
      apps[windowId].btn.style.opacity = minimized ? "0.5" : "1";
    }
  }

  function startClock() {
    const clockEl = document.getElementById("tray-clock");
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = now.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
      clockEl.innerHTML = `${time}<br>${date}`;
    }

    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }

  return {
    init,
    addApp,
    removeApp,
    setActive,
    setMinimized,
  };
})();
