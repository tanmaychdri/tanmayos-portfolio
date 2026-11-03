// TanmayOS Web Browser
// Interactive browser app for web navigation and project showcase

const BrowserApp = (() => {
  let windowId = null;
  let history = ["tanmay://home"];
  let historyIndex = 0;
  let currentFilter = "all";
  let searchQuery = "";

  const BOOKMARKS = [
    { label: "🏠 Home", url: "tanmay://home" },
    { label: "📁 Projects", url: "tanmay://projects" },
    { label: "⚡ CYGNUS", url: "https://github.com/tanmaychdri/CodeAlpha_CYGNUS" },
    { label: "🎯 ZENITH", url: "https://github.com/tanmaychdri/CodeAlpha_ZENITH" },
    { label: "🔢 Calculator", url: "https://github.com/tanmaychdri/Calculator" },
    { label: "📖 Wikipedia", url: "https://en.m.wikipedia.org" },
    { label: "🔍 DuckDuckGo", url: "https://duckduckgo.com" },
    { label: "🐙 GitHub", url: "https://github.com/tanmaychdri" },
  ];

  function open(initialUrl) {
    if (windowId) {
      const win = WindowManager.getWindow(windowId);
      if (win && !win.closed) {
        if (win.minimized) {
          WindowManager.restoreWindow(windowId);
        }
        WindowManager.focusWindow(windowId);
        if (initialUrl) {
          navigateTo(initialUrl);
        }
        return;
      }
    }

    const startUrl = initialUrl || "tanmay://home";
    history = [startUrl];
    historyIndex = 0;

    const contentHtml = `
      <div class="browser-container">
        <div class="browser-toolbar">
          <button class="browser-nav-btn" data-action="back" title="Back (Alt+Left)">
            ${Desktop.ICONS.arrowLeft}
          </button>
          <button class="browser-nav-btn" data-action="forward" title="Forward (Alt+Right)">
            ${Desktop.ICONS.arrowRight}
          </button>
          <button class="browser-nav-btn" data-action="refresh" title="Reload (Ctrl+R)">
            ${Desktop.ICONS.refresh}
          </button>
          <button class="browser-nav-btn" data-action="home" title="Home">
            ${Desktop.ICONS.home}
          </button>

          <div class="browser-address-wrapper">
            <div class="browser-address-icon">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="8" cy="8" r="6"/>
                <line x1="2" y1="8" x2="14" y2="8"/>
                <path d="M8 2a9 9 0 013 6 9 9 0 01-3 6 9 9 0 01-3-6 9 9 0 013-6z"/>
              </svg>
            </div>
            <input type="text" class="browser-address-bar" placeholder="Search with DuckDuckGo or enter web address..." autocomplete="off" spellcheck="false" />
            <button class="browser-go-btn" data-action="go" title="Navigate">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 3l5 5-5 5"/>
              </svg>
            </button>
          </div>

          <button class="browser-nav-btn" data-action="external" title="Open in External Browser Tab">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 9v4H3V4h4M9 2h5v5M14 2L7 9"/>
            </svg>
          </button>
        </div>

        <div class="browser-bookmarks-bar">
          ${BOOKMARKS.map(
            (b) => `
            <a class="browser-bookmark-item" data-url="${b.url}">
              ${b.label}
            </a>
          `
          ).join("")}
        </div>

        <div class="browser-loading-bar"></div>

        <div class="browser-content-area"></div>
      </div>
    `;

    windowId = WindowManager.createWindow("browser", "Browser", contentHtml, {
      width: 840,
      height: 560,
      minWidth: 480,
      minHeight: 350,
      icon: Desktop.ICONS.browser,
      singleInstance: true,
      onClose: () => {
        windowId = null;
        history = ["tanmay://home"];
        historyIndex = 0;
      },
    });

    setupEvents();
    renderPage(startUrl);
  }

  function setupEvents() {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;

    const btnBack = winEl.querySelector('[data-action="back"]');
    const btnForward = winEl.querySelector('[data-action="forward"]');
    const btnRefresh = winEl.querySelector('[data-action="refresh"]');
    const btnHome = winEl.querySelector('[data-action="home"]');
    const btnExternal = winEl.querySelector('[data-action="external"]');
    const btnGo = winEl.querySelector('[data-action="go"]');
    const addressInput = winEl.querySelector(".browser-address-bar");

    if (btnBack) btnBack.addEventListener("click", goBack);
    if (btnForward) btnForward.addEventListener("click", goForward);
    if (btnRefresh) btnRefresh.addEventListener("click", reload);
    if (btnHome) btnHome.addEventListener("click", () => navigateTo("tanmay://home"));
    if (btnExternal) btnExternal.addEventListener("click", openCurrentInExternalTab);

    if (btnGo) {
      btnGo.addEventListener("click", () => {
        if (addressInput) navigateTo(addressInput.value);
      });
    }

    if (addressInput) {
      addressInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          navigateTo(addressInput.value);
        }
      });
      addressInput.addEventListener("focus", () => addressInput.select());
    }

    winEl.querySelectorAll(".browser-bookmark-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const url = item.dataset.url;
        if (url) navigateTo(url);
      });
    });
  }

  function resolveInput(input) {
    const trimmed = (input || "").trim();
    if (!trimmed) return "tanmay://home";

    if (trimmed.startsWith("tanmay://") || trimmed.startsWith("about:")) {
      return trimmed;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Domain name pattern (e.g. wikipedia.org, github.com/tanmaychdri)
    if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed)) {
      return "https://" + trimmed;
    }

    // Default to DuckDuckGo web search
    return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
  }

  function navigateTo(inputUrl, addToHistory = true) {
    const resolvedUrl = resolveInput(inputUrl);

    if (addToHistory) {
      history = history.slice(0, historyIndex + 1);
      history.push(resolvedUrl);
      historyIndex = history.length - 1;
    }

    renderPage(resolvedUrl);
  }

  function goBack() {
    if (historyIndex > 0) {
      historyIndex--;
      renderPage(history[historyIndex]);
    }
  }

  function goForward() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      renderPage(history[historyIndex]);
    }
  }

  function reload() {
    if (historyIndex >= 0 && historyIndex < history.length) {
      renderPage(history[historyIndex]);
    }
  }

  function openCurrentInExternalTab() {
    const currentUrl = history[historyIndex] || "tanmay://home";
    if (currentUrl.startsWith("http://") || currentUrl.startsWith("https://")) {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    } else if (currentUrl === "tanmay://projects") {
      window.open("https://github.com/tanmaychdri", "_blank", "noopener,noreferrer");
    } else {
      window.open(PORTFOLIO_DATA.personal.website || "https://github.com/tanmaychdri", "_blank", "noopener,noreferrer");
    }
  }

  function updateToolbar(url) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;

    const btnBack = winEl.querySelector('[data-action="back"]');
    const btnForward = winEl.querySelector('[data-action="forward"]');
    const addressInput = winEl.querySelector(".browser-address-bar");

    if (btnBack) btnBack.disabled = historyIndex <= 0;
    if (btnForward) btnForward.disabled = historyIndex >= history.length - 1;
    if (addressInput) addressInput.value = url;

    winEl.querySelectorAll(".browser-bookmark-item").forEach((b) => {
      b.classList.toggle("active", b.dataset.url === url);
    });

    let title = "Browser";
    if (url === "tanmay://home") title = "New Tab — Browser";
    else if (url === "tanmay://projects") title = "Projects — Browser";
    else if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const u = new URL(url);
        title = `${u.hostname} — Browser`;
      } catch (e) {
        title = "Web — Browser";
      }
    }

    const titleEl = winEl.querySelector(".window-title");
    if (titleEl) titleEl.textContent = title;
  }

  function triggerLoading() {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    const bar = winEl.querySelector(".browser-loading-bar");
    if (!bar) return;

    bar.classList.remove("complete");
    bar.classList.add("active");

    setTimeout(() => {
      bar.classList.add("complete");
      setTimeout(() => {
        bar.classList.remove("active", "complete");
      }, 300);
    }, 450);
  }

  function renderPage(url) {
    updateToolbar(url);
    triggerLoading();

    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    const contentArea = winEl.querySelector(".browser-content-area");
    if (!contentArea) return;

    if (url === "tanmay://home") {
      contentArea.innerHTML = renderHomeHtml();
      setupHomeEvents(contentArea);
    } else if (url === "tanmay://projects") {
      contentArea.innerHTML = renderProjectsHtml();
      setupProjectsEvents(contentArea);
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      contentArea.innerHTML = renderIframeHtml(url);
      setupIframeEvents(contentArea, url);
    } else {
      contentArea.innerHTML = renderNotFoundHtml(url);
    }
  }

  // --- HOME PAGE ---
  function renderHomeHtml() {
    return `
      <div class="browser-page-view">
        <div class="browser-page-container">
          <div class="browser-home-hero">
            <div class="browser-home-title">TANMAY // BROWSER</div>
            <div class="browser-home-subtitle">
              Browse websites directly inside TanmayOS or explore featured projects, web experiments, and online profiles.
            </div>

            <div class="browser-home-search-box">
              <input type="text" class="browser-home-search-input" placeholder="Search DuckDuckGo or enter any URL..." />
              <button class="browser-home-search-btn">Search</button>
            </div>
          </div>

          <div class="browser-section-header">
            <span class="browser-section-title">Speed Dial &amp; Favorites</span>
          </div>

          <div class="browser-grid">
            <div class="browser-grid-card" data-url="tanmay://projects">
              <div class="browser-card-header">
                <span class="browser-card-icon">📁</span>
                <span class="browser-card-title">My Projects</span>
              </div>
              <div class="browser-card-desc">
                Interactive showcase of full-stack apps, Python utilities, and web experiments.
              </div>
              <div class="browser-card-footer">
                <span>tanmay://projects</span>
                <span>Open ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="https://github.com/tanmaychdri/CodeAlpha_CYGNUS">
              <div class="browser-card-header">
                <span class="browser-card-icon">⚡</span>
                <span class="browser-card-title">CodeAlpha_CYGNUS</span>
              </div>
              <div class="browser-card-desc">
                Full-stack e-commerce web application with Django backend &amp; SQLite.
              </div>
              <div class="browser-card-footer">
                <span>Django · E-Commerce</span>
                <span>Launch ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="https://github.com/tanmaychdri/CodeAlpha_ZENITH">
              <div class="browser-card-header">
                <span class="browser-card-icon">🎯</span>
                <span class="browser-card-title">CodeAlpha_ZENITH</span>
              </div>
              <div class="browser-card-desc">
                Sleek real-time project management platform with minimalistic UI.
              </div>
              <div class="browser-card-footer">
                <span>Django · Vanilla JS</span>
                <span>Launch ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="https://github.com/tanmaychdri/Calculator">
              <div class="browser-card-header">
                <span class="browser-card-icon">🔢</span>
                <span class="browser-card-title">Calculator</span>
              </div>
              <div class="browser-card-desc">
                Modern, frameless dark-mode calculator with memory system in Python.
              </div>
              <div class="browser-card-footer">
                <span>Python · Tkinter</span>
                <span>Launch ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="https://en.m.wikipedia.org">
              <div class="browser-card-header">
                <span class="browser-card-icon">📖</span>
                <span class="browser-card-title">Wikipedia</span>
              </div>
              <div class="browser-card-desc">
                The free online encyclopedia. Fully interactive within the browser view.
              </div>
              <div class="browser-card-footer">
                <span>en.wikipedia.org</span>
                <span>Visit ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="https://duckduckgo.com">
              <div class="browser-card-header">
                <span class="browser-card-icon">🔍</span>
                <span class="browser-card-title">DuckDuckGo</span>
              </div>
              <div class="browser-card-desc">
                Privacy-focused search engine to search the open web with no tracking.
              </div>
              <div class="browser-card-footer">
                <span>duckduckgo.com</span>
                <span>Visit ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="${PORTFOLIO_DATA.social.github}">
              <div class="browser-card-header">
                <span class="browser-card-icon">🐙</span>
                <span class="browser-card-title">GitHub Profile</span>
              </div>
              <div class="browser-card-desc">
                Explore open source repositories, contributions, and code stars.
              </div>
              <div class="browser-card-footer">
                <span>github.com/tanmaychdri</span>
                <span>Visit ➔</span>
              </div>
            </div>

            <div class="browser-grid-card" data-url="${PORTFOLIO_DATA.social.linkedin}">
              <div class="browser-card-header">
                <span class="browser-card-icon">💼</span>
                <span class="browser-card-title">LinkedIn</span>
              </div>
              <div class="browser-card-desc">
                Connect professionally, review education details, and get in touch.
              </div>
              <div class="browser-card-footer">
                <span>linkedin.com</span>
                <span>Visit ➔</span>
              </div>
            </div>
          </div>

          <div class="browser-callout">
            <div class="browser-callout-title">🌐 Web Browsing in TanmayOS</div>
            You can type any web address or search term in the address bar above. Some major sites (like Google or GitHub) restrict being embedded in frames for security reasons. You can open any site directly in your default browser tab using the ↗ button at any time.
          </div>
        </div>
      </div>
    `;
  }

  function setupHomeEvents(container) {
    const searchInput = container.querySelector(".browser-home-search-input");
    const searchBtn = container.querySelector(".browser-home-search-btn");

    function executeSearch() {
      if (searchInput && searchInput.value.trim()) {
        navigateTo(searchInput.value.trim());
      }
    }

    if (searchBtn) searchBtn.addEventListener("click", executeSearch);
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          executeSearch();
        }
      });
      setTimeout(() => searchInput.focus(), 50);
    }

    container.querySelectorAll(".browser-grid-card").forEach((card) => {
      card.addEventListener("click", () => {
        const url = card.dataset.url;
        if (url) navigateTo(url);
      });
    });
  }

  // --- PROJECTS PAGE ---
  function renderProjectsHtml() {
    const projects = filterProjects(PORTFOLIO_DATA.projects);

    const cardsHtml = projects.length
      ? projects
          .map(
            (p) => `
        <div class="browser-project-card">
          <div class="browser-project-header">
            <div class="browser-project-title">
              <span style="color: var(--accent-primary);">▸</span>
              ${escapeHtml(p.name)}
            </div>
            <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">
              ${p.type || "project"}
            </span>
          </div>

          <div class="browser-project-desc">${escapeHtml(p.description)}</div>

          <div class="browser-project-tech">
            ${p.tech.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}
          </div>

          <div class="browser-project-actions">
            <button class="browser-action-btn primary" data-action="open-internal" data-url="${escapeHtml(p.url)}">
              🌐 Open in Browser
            </button>
            <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="browser-action-btn">
              ↗ GitHub Repo
            </a>
            <button class="browser-action-btn" data-action="view-readme" data-project="${escapeHtml(p.name)}">
              📄 View README
            </button>
          </div>
        </div>
      `
          )
          .join("")
      : `
        <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
          No projects found matching "${escapeHtml(searchQuery)}".
        </div>
      `;

    return `
      <div class="browser-page-view">
        <div class="browser-page-container">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              My Projects
            </h2>
            <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
              A curated showcase of applications, tools, and platforms built by Tanmay Chaudhari.
            </p>
          </div>

          <div class="browser-filter-bar">
            <button class="browser-filter-btn ${currentFilter === "all" ? "active" : ""}" data-filter="all">All</button>
            <button class="browser-filter-btn ${currentFilter === "Full-Stack" ? "active" : ""}" data-filter="Full-Stack">Full-Stack</button>
            <button class="browser-filter-btn ${currentFilter === "Python" ? "active" : ""}" data-filter="Python">Python</button>
            <button class="browser-filter-btn ${currentFilter === "JavaScript" ? "active" : ""}" data-filter="JavaScript">JavaScript</button>
            <button class="browser-filter-btn ${currentFilter === "Django" ? "active" : ""}" data-filter="Django">Django</button>

            <input type="text" class="browser-search-input" placeholder="Filter projects..." value="${escapeHtml(searchQuery)}" />
          </div>

          <div class="browser-projects-list">
            ${cardsHtml}
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #222;">
            <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 10px;">
              Connect &amp; Collaborate
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${Object.entries(PORTFOLIO_DATA.social)
                .map(
                  ([platform, url]) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="browser-action-btn">
                  <span style="text-transform: capitalize;">${platform}</span> ↗
                </a>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function filterProjects(projects) {
    return projects.filter((p) => {
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "Full-Stack" && p.tech.some((t) => ["Django", "HTML", "CSS"].includes(t))) ||
        p.tech.includes(currentFilter);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }

  function setupProjectsEvents(container) {
    container.querySelectorAll(".browser-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderPage("tanmay://projects");
      });
    });

    const searchInput = container.querySelector(".browser-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        const list = container.querySelector(".browser-projects-list");
        if (list) {
          const projects = filterProjects(PORTFOLIO_DATA.projects);
          list.innerHTML = projects.length
            ? projects
                .map(
                  (p) => `
              <div class="browser-project-card">
                <div class="browser-project-header">
                  <div class="browser-project-title">
                    <span style="color: var(--accent-primary);">▸</span>
                    ${escapeHtml(p.name)}
                  </div>
                  <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">
                    ${p.type || "project"}
                  </span>
                </div>
                <div class="browser-project-desc">${escapeHtml(p.description)}</div>
                <div class="browser-project-tech">
                  ${p.tech.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}
                </div>
                <div class="browser-project-actions">
                  <button class="browser-action-btn primary" data-action="open-internal" data-url="${escapeHtml(p.url)}">
                    🌐 Open in Browser
                  </button>
                  <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="browser-action-btn">
                    ↗ GitHub Repo
                  </a>
                  <button class="browser-action-btn" data-action="view-readme" data-project="${escapeHtml(p.name)}">
                    📄 View README
                  </button>
                </div>
              </div>
            `
                )
                .join("")
            : `
              <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                No projects found matching "${escapeHtml(searchQuery)}".
              </div>
            `;
          setupProjectCardActions(list);
        }
      });
    }

    setupProjectCardActions(container);
  }

  function setupProjectCardActions(scope) {
    scope.querySelectorAll('[data-action="open-internal"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.dataset.url;
        if (url) navigateTo(url);
      });
    });

    scope.querySelectorAll('[data-action="view-readme"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const projectName = btn.dataset.project;
        const pObj = PORTFOLIO_DATA.projects.find((p) => p.name === projectName);
        if (pObj && typeof NotepadApp !== "undefined") {
          const content = `# ${pObj.name}\n\n${pObj.description}\n\nTech Stack:\n- ${pObj.tech.join("\n- ")}\n\nRepository:\n${pObj.url}\n`;
          NotepadApp.openWithContent(`${pObj.name}_README.md`, content);
        }
      });
    });
  }

  // --- EXTERNAL WEBSITE (IFRAME) ---
  function renderIframeHtml(url) {
    return `
      <div class="browser-iframe-container">
        <div class="browser-site-banner">
          <div class="browser-site-banner-left">
            <span>🌐</span>
            <span style="color: #bbb; max-width: 480px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${escapeHtml(url)}
            </span>
          </div>
          <div class="browser-site-banner-right">
            <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="browser-banner-btn" title="Open in real browser tab">
              Open in External Tab ↗
            </a>
            <button class="browser-banner-btn" data-action="banner-home">
              🏠 Home
            </button>
          </div>
        </div>

        <iframe
          class="browser-iframe"
          src="${escapeHtml(url)}"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          loading="lazy">
        </iframe>
      </div>
    `;
  }

  function setupIframeEvents(container, url) {
    const bannerHome = container.querySelector('[data-action="banner-home"]');
    if (bannerHome) {
      bannerHome.addEventListener("click", () => navigateTo("tanmay://home"));
    }
  }

  function renderNotFoundHtml(url) {
    return `
      <div class="browser-page-view" style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <div style="text-align: center; max-width: 400px;">
          <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
          <h3 style="font-size: 16px; color: #fff; margin-bottom: 8px;">Address Not Found</h3>
          <p style="font-size: 12px; color: #888; margin-bottom: 16px;">
            The address <code>${escapeHtml(url)}</code> could not be resolved.
          </p>
          <button class="browser-action-btn primary" onclick="BrowserApp.open('tanmay://home')">
            Back to Home
          </button>
        </div>
      </div>
    `;
  }

  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return {
    open,
    navigateTo,
  };
})();
