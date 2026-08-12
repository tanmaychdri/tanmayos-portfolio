

const FileExplorerApp = (() => {
  let currentPath = "~";
  let pathHistory = ["~"];
  let historyIndex = 0;
  let windowId = null;

  function getIconForFile(name) {
    if (name.endsWith(".txt")) return Desktop.ICONS.fileTxt;
    if (name.endsWith(".pdf")) return Desktop.ICONS.filePdf;
    if (name.endsWith(".js")) return Desktop.ICONS.fileJs;
    if (name.endsWith(".md")) return Desktop.ICONS.fileMd;
    if (name.endsWith(".json")) return Desktop.ICONS.fileJson;
    return Desktop.ICONS.file;
  }

  function resolvePath(path) {
    let normalized = path;
    if (normalized.startsWith("/home/tanmay")) {
      normalized = "~" + normalized.slice(12);
    }

    const parts = normalized.split("/").filter(Boolean);
    let current = PORTFOLIO_DATA.filesystem["~"];

    if (parts[0] === "~") parts.shift();

    for (const part of parts) {
      if (!current || !current.children || !current.children[part]) return null;
      current = current.children[part];
    }

    return current;
  }

  function renderContent(explorerEl) {
    const dir = resolvePath(currentPath);
    if (!dir || dir.type !== "dir") return;

    const breadcrumbEl = explorerEl.querySelector(".explorer-breadcrumb");
    if (breadcrumbEl) {
      const parts = currentPath.split("/").filter(Boolean);
      breadcrumbEl.innerHTML = parts
        .map((part, i) => {
          const pathTo = parts.slice(0, i + 1).join("/");
          return `<span class="breadcrumb-segment" data-path="${pathTo}">${part}</span>
                  ${i < parts.length - 1 ? '<span class="breadcrumb-separator">/</span>' : ""}`;
        })
        .join("");

      breadcrumbEl.querySelectorAll(".breadcrumb-segment").forEach((seg) => {
        seg.addEventListener("click", () => {
          navigateTo(seg.dataset.path, explorerEl);
        });
      });
    }

    explorerEl.querySelectorAll(".sidebar-item").forEach((item) => {
      const isActive = currentPath === item.dataset.path ||
        currentPath.startsWith(item.dataset.path + "/");
      item.classList.toggle("active", isActive);
    });

    const backBtn = explorerEl.querySelector('[data-nav="back"]');
    const fwdBtn = explorerEl.querySelector('[data-nav="forward"]');
    if (backBtn) backBtn.disabled = historyIndex <= 0;
    if (fwdBtn) fwdBtn.disabled = historyIndex >= pathHistory.length - 1;

    const contentEl = explorerEl.querySelector(".file-explorer-content");
    if (!contentEl) return;

    const entries = Object.entries(dir.children);
    if (entries.length === 0) {
      contentEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
        <div style="font-size: 32px; margin-bottom: 8px;">📂</div>
        <div>This folder is empty</div>
      </div>`;
      return;
    }

    entries.sort((a, b) => {
      if (a[1].type === "dir" && b[1].type !== "dir") return -1;
      if (a[1].type !== "dir" && b[1].type === "dir") return 1;
      return a[0].localeCompare(b[0]);
    });

    contentEl.innerHTML = entries
      .map(([name, entry]) => {
        const icon =
          entry.type === "dir" ? Desktop.ICONS.folder : getIconForFile(name);
        return `
        <div class="file-item" data-name="${name}" data-type="${entry.type}">
          <div class="file-item-icon">${icon}</div>
          <div class="file-item-name">${name}</div>
        </div>`;
      })
      .join("");

    contentEl.querySelectorAll(".file-item").forEach((item) => {
      item.addEventListener("click", (e) => {

        contentEl.querySelectorAll(".file-item").forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        e.stopPropagation();
      });

      item.addEventListener("dblclick", () => {
        const name = item.dataset.name;
        const type = item.dataset.type;

        if (type === "dir") {
          const newPath = currentPath === "~" ? `~/${name}` : `${currentPath}/${name}`;
          navigateTo(newPath, explorerEl);
        } else {

          openFileInNotepad(name, currentPath + "/" + name);
        }
      });
    });
  }

  function navigateTo(path, explorerEl) {
    const dir = resolvePath(path);
    if (!dir || dir.type !== "dir") return;

    currentPath = path;

    pathHistory = pathHistory.slice(0, historyIndex + 1);
    pathHistory.push(path);
    historyIndex = pathHistory.length - 1;

    renderContent(explorerEl);
  }

  function openFileInNotepad(fileName, filePath) {
    const file = resolvePath(filePath);
    if (!file || file.type === "dir") return;

    NotepadApp.openWithContent(fileName, file.content);
  }

  function open(startPath) {
    if (startPath) currentPath = startPath;

    const sidebarItems = [
      { path: "~", label: "Home", icon: Desktop.ICONS.home },
      { path: "~/Documents", label: "Documents", icon: Desktop.ICONS.folder },
      { path: "~/Projects", label: "Projects", icon: Desktop.ICONS.folder },
      { path: "~/Downloads", label: "Downloads", icon: Desktop.ICONS.folder },
    ];

    const sidebarHtml = `
      <div class="sidebar-section-title">Places</div>
      ${sidebarItems
        .map(
          (item) => `
        <div class="sidebar-item" data-path="${item.path}">
          ${item.icon}
          <span>${item.label}</span>
        </div>
      `
        )
        .join("")}
    `;

    const contentHtml = `
      <div class="file-explorer">
        <div class="file-explorer-sidebar">
          ${sidebarHtml}
        </div>
        <div class="file-explorer-main">
          <div class="file-explorer-toolbar">
            <button class="explorer-nav-btn" data-nav="back" title="Back">
              ${Desktop.ICONS.arrowLeft}
            </button>
            <button class="explorer-nav-btn" data-nav="forward" title="Forward">
              ${Desktop.ICONS.arrowRight}
            </button>
            <button class="explorer-nav-btn" data-nav="up" title="Up">
              ${Desktop.ICONS.arrowUp}
            </button>
            <div class="explorer-breadcrumb"></div>
          </div>
          <div class="file-explorer-content"></div>
        </div>
      </div>
    `;

    windowId = WindowManager.createWindow(
      "fileExplorer",
      "Files",
      contentHtml,
      {
        width: 750,
        height: 500,
        icon: Desktop.ICONS.fileExplorer,
        singleInstance: true,
        onClose: () => {
          windowId = null;
          currentPath = "~";
          pathHistory = ["~"];
          historyIndex = 0;
        },
      }
    );

    setTimeout(() => {
      const winEl = document.getElementById(windowId);
      if (!winEl) return;

      const explorerEl = winEl.querySelector(".file-explorer");

      explorerEl.querySelectorAll(".sidebar-item").forEach((item) => {
        item.addEventListener("click", () => {
          navigateTo(item.dataset.path, explorerEl);
        });
      });

      explorerEl.querySelector('[data-nav="back"]').addEventListener("click", () => {
        if (historyIndex > 0) {
          historyIndex--;
          currentPath = pathHistory[historyIndex];
          renderContent(explorerEl);
        }
      });

      explorerEl.querySelector('[data-nav="forward"]').addEventListener("click", () => {
        if (historyIndex < pathHistory.length - 1) {
          historyIndex++;
          currentPath = pathHistory[historyIndex];
          renderContent(explorerEl);
        }
      });

      explorerEl.querySelector('[data-nav="up"]').addEventListener("click", () => {
        if (currentPath !== "~") {
          const parts = currentPath.split("/");
          parts.pop();
          navigateTo(parts.join("/") || "~", explorerEl);
        }
      });

      renderContent(explorerEl);
    }, 100);
  }

  return { open };
})();
