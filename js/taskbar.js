

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
      
      const calendar = document.getElementById("calendar-flyout");
      if (calendar && !e.target.closest("#calendar-flyout") && !e.target.closest("#taskbar-clock")) {
        calendar.classList.remove("active");
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
    const clockEl = document.getElementById("taskbar-clock");
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      clockEl.innerHTML = time;
    }

    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    
    clockEl.style.cursor = "pointer";
    clockEl.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCalendar();
    });
  }

  function toggleCalendar() {
    const flyout = document.getElementById("calendar-flyout");
    if (!flyout) return;
    
    if (flyout.classList.contains("active")) {
      flyout.classList.remove("active");
    } else {
      renderCalendar();
      flyout.classList.add("active");
    }
  }

  function renderCalendar() {
    const flyout = document.getElementById("calendar-flyout");
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthName = now.toLocaleDateString([], { month: "long", year: "numeric" });
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    
    let gridHtml = daysOfWeek.map(d => `<div class="calendar-day-header">${d}</div>`).join("");
    
    for (let i = 0; i < firstDay; i++) {
      gridHtml += `<div class="calendar-day empty"></div>`;
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today ? "today" : "";
      gridHtml += `<div class="calendar-day ${isToday}">${d}</div>`;
    }
    
    flyout.innerHTML = `
      <div class="calendar-header">${monthName}</div>
      <div class="calendar-grid">${gridHtml}</div>
    `;
  }

  return {
    init,
    addApp,
    removeApp,
    setActive,
    setMinimized,
  };
})();
