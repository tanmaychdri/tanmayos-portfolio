

const WindowManager = (() => {
  let windows = {};
  let windowOrder = [];
  let activeWindowId = null;
  let baseZIndex = 100;
  let windowIdCounter = 0;

  function createWindow(appId, title, contentHtml, options = {}) {
    const id = `window-${appId}-${windowIdCounter++}`;

    if (options.singleInstance) {
      const existingId = Object.keys(windows).find(
        (wId) => windows[wId].appId === appId && !windows[wId].closed
      );
      if (existingId) {

        if (windows[existingId].minimized) {
          restoreWindow(existingId);
        }
        focusWindow(existingId);
        return existingId;
      }
    }

    const defaults = {
      width: 700,
      height: 500,
      x: 80 + (windowIdCounter % 8) * 30,
      y: 40 + (windowIdCounter % 8) * 30,
      minWidth: 400,
      minHeight: 300,
      resizable: true,
      icon: null,
      singleInstance: false,
      onClose: null,
      onFocus: null,
      onResize: null,
    };

    const config = { ...defaults, ...options };

    const maxX = window.innerWidth - config.width;
    const maxY = window.innerHeight - 48 - config.height;
    config.x = Math.max(0, Math.min(config.x, maxX));
    config.y = Math.max(0, Math.min(config.y, maxY));

    const windowEl = document.createElement("div");
    windowEl.id = id;
    windowEl.className = "os-window";
    windowEl.style.width = config.width + "px";
    windowEl.style.height = config.height + "px";
    windowEl.style.left = config.x + "px";
    windowEl.style.top = config.y + "px";

    windowEl.style.opacity = "1";

    const iconHtml = config.icon
      ? `<div class="window-titlebar-icon">${config.icon}</div>`
      : "";

    windowEl.innerHTML = `
      <div class="window-titlebar" data-window-id="${id}">
        ${iconHtml}
        <div class="window-title">${title}</div>
        <div class="window-controls">
          <button class="window-control-btn minimize" data-action="minimize" title="Minimize">_</button>
          <button class="window-control-btn maximize" data-action="maximize" title="Maximize">□</button>
          <button class="window-control-btn close" data-action="close" title="Close">✕</button>
        </div>
      </div>
      <div class="window-body">${contentHtml}</div>
      ${
        config.resizable
          ? `
        <div class="window-resize-handle resize-n" data-resize="n"></div>
        <div class="window-resize-handle resize-s" data-resize="s"></div>
        <div class="window-resize-handle resize-e" data-resize="e"></div>
        <div class="window-resize-handle resize-w" data-resize="w"></div>
        <div class="window-resize-handle resize-ne" data-resize="ne"></div>
        <div class="window-resize-handle resize-nw" data-resize="nw"></div>
        <div class="window-resize-handle resize-se" data-resize="se"></div>
        <div class="window-resize-handle resize-sw" data-resize="sw"></div>
      `
          : ""
      }
    `;

    document.getElementById("window-container").appendChild(windowEl);

    windows[id] = {
      id,
      appId,
      title,
      element: windowEl,
      config,
      minimized: false,
      maximized: false,
      closed: false,
      prevBounds: null, // for restore from maximize
    };

    windowOrder.push(id);

    bindWindowEvents(id);
    focusWindow(id);

    if (typeof Taskbar !== "undefined") {
      Taskbar.addApp(id, appId, title, config.icon);
    }

    return id;
  }

  function bindWindowEvents(id) {
    const win = windows[id];
    const el = win.element;
    const titlebar = el.querySelector(".window-titlebar");

    el.addEventListener("mousedown", () => focusWindow(id));

    el.querySelectorAll(".window-control-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === "close") closeWindow(id);
        else if (action === "minimize") minimizeWindow(id);
        else if (action === "maximize") toggleMaximize(id);
      });
    });

    titlebar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".window-controls")) return;
      toggleMaximize(id);
    });

    setupDrag(id, titlebar);

    if (win.config.resizable) {
      el.querySelectorAll(".window-resize-handle").forEach((handle) => {
        setupResize(id, handle, handle.dataset.resize);
      });
    }
  }

  function setupDrag(id, titlebar) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    titlebar.addEventListener("mousedown", (e) => {
      if (e.target.closest(".window-controls")) return;
      if (windows[id].maximized) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = windows[id].element.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      const el = windows[id].element;
      newLeft = Math.max(-el.offsetWidth + 100, Math.min(newLeft, window.innerWidth - 100));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - 48 - 38));

      el.style.left = newLeft + "px";
      el.style.top = newTop + "px";
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    });
  }

  function setupResize(id, handle, direction) {
    let isResizing = false;
    let startX, startY, startW, startH, startLeft, startTop;

    handle.addEventListener("mousedown", (e) => {
      if (windows[id].maximized) return;

      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;

      const el = windows[id].element;
      const rect = el.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;
      startLeft = rect.left;
      startTop = rect.top;

      document.body.style.cursor = getComputedStyle(handle).cursor;
      document.body.style.userSelect = "none";

      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const el = windows[id].element;
      const minW = windows[id].config.minWidth;
      const minH = windows[id].config.minHeight;

      let newW = startW,
        newH = startH,
        newLeft = startLeft,
        newTop = startTop;

      if (direction.includes("e")) newW = Math.max(minW, startW + dx);
      if (direction.includes("w")) {
        newW = Math.max(minW, startW - dx);
        if (newW > minW) newLeft = startLeft + dx;
      }
      if (direction.includes("s")) newH = Math.max(minH, startH + dy);
      if (direction.includes("n")) {
        newH = Math.max(minH, startH - dy);
        if (newH > minH) newTop = startTop + dy;
      }

      el.style.width = newW + "px";
      el.style.height = newH + "px";
      el.style.left = newLeft + "px";
      el.style.top = newTop + "px";

      if (windows[id].config.onResize) {
        windows[id].config.onResize(newW, newH);
      }
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    });
  }

  function focusWindow(id) {
    if (!windows[id] || windows[id].closed) return;

    Object.values(windows).forEach((w) => {
      w.element.classList.remove("focused");
    });

    windowOrder = windowOrder.filter((wId) => wId !== id);
    windowOrder.push(id);

    windowOrder.forEach((wId, i) => {
      if (windows[wId]) {
        windows[wId].element.style.zIndex = baseZIndex + i;
      }
    });

    windows[id].element.classList.add("focused");
    activeWindowId = id;

    if (typeof Taskbar !== "undefined") {
      Taskbar.setActive(id);
    }

    if (windows[id].config.onFocus) {
      windows[id].config.onFocus();
    }
  }

  function closeWindow(id) {
    if (!windows[id]) return;

    const el = windows[id].element;

    if (windows[id].config.onClose) {
      windows[id].config.onClose();
    }

    el.remove();
    windows[id].closed = true;
    windowOrder = windowOrder.filter((wId) => wId !== id);

    if (typeof Taskbar !== "undefined") {
      Taskbar.removeApp(id);
    }

    if (activeWindowId === id) {
      activeWindowId = windowOrder[windowOrder.length - 1] || null;
      if (activeWindowId) focusWindow(activeWindowId);
    }

    delete windows[id];
  }

  function minimizeWindow(id) {
    if (!windows[id]) return;

    windows[id].minimized = true;
    const el = windows[id].element;
    el.classList.add("minimized");
    el.style.pointerEvents = "none";

    if (activeWindowId === id) {
      const nextId = [...windowOrder]
        .reverse()
        .find((wId) => wId !== id && !windows[wId].minimized && !windows[wId].closed);
      if (nextId) focusWindow(nextId);
      else activeWindowId = null;
    }

    if (typeof Taskbar !== "undefined") {
      Taskbar.setMinimized(id, true);
    }
  }

  function restoreWindow(id) {
    if (!windows[id]) return;

    windows[id].minimized = false;
    const el = windows[id].element;
    el.classList.remove("minimized");
    el.style.pointerEvents = "auto";

    focusWindow(id);

    if (typeof Taskbar !== "undefined") {
      Taskbar.setMinimized(id, false);
    }
  }

  function toggleMaximize(id) {
    if (!windows[id]) return;
    const el = windows[id].element;

    if (windows[id].maximized) {

      const prev = windows[id].prevBounds;
      if (prev) {
        el.style.width = prev.width;
        el.style.height = prev.height;
        el.style.left = prev.left;
        el.style.top = prev.top;
      }
      el.classList.remove("maximized");
      windows[id].maximized = false;
    } else {

      windows[id].prevBounds = {
        width: el.style.width,
        height: el.style.height,
        left: el.style.left,
        top: el.style.top,
      };
      el.classList.add("maximized");
      windows[id].maximized = true;
    }
  }

  function toggleWindow(id) {
    if (!windows[id]) return;

    if (windows[id].minimized) {
      restoreWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }

  return {
    createWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    toggleWindow,
    focusWindow,
    getWindow: (id) => windows[id],
    getActiveWindowId: () => activeWindowId,
    getAllWindows: () => ({ ...windows }),
  };
})();
