

const BrowserApp = (() => {
  let windowId = null;

  function open() {
    const projectsHtml = PORTFOLIO_DATA.projects
      .map(
        (p) => `
      <div class="project-card">
        <div class="project-card-title">
          <span style="color: var(--accent-primary); margin-right: 8px;">▸</span>
          ${p.name}
        </div>
        <div class="project-card-desc">${p.description}</div>
        <div class="project-card-tech">
          ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
        <div style="margin-top: 12px;">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer"
             style="font-size: 12px; font-family: var(--font-mono);">
            ${p.url} ↗
          </a>
        </div>
      </div>
    `
      )
      .join("");

    const socialHtml = `
      <div style="display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap;">
        ${Object.entries(PORTFOLIO_DATA.social)
          .map(
            ([platform, url]) => `
          <a href="${url}" target="_blank" rel="noopener noreferrer"
             style="padding: 8px 16px; background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
                    font-size: 12px; font-family: var(--font-mono);
                    transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
            <span style="text-transform: capitalize;">${platform}</span>
            <span style="color: var(--text-muted);">↗</span>
          </a>
        `
          )
          .join("")}
      </div>
    `;

    const contentHtml = `
      <div class="browser-container">
        <div class="browser-toolbar">
          <button class="explorer-nav-btn" disabled>${Desktop.ICONS.arrowLeft}</button>
          <button class="explorer-nav-btn" disabled>${Desktop.ICONS.arrowRight}</button>
          <button class="explorer-nav-btn">${Desktop.ICONS.refresh}</button>
          <input type="text" class="browser-address-bar" value="tanmay://projects" readonly />
        </div>
        <div class="browser-content">
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              My Projects
            </h2>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
              A collection of things I've built and contributed to.
            </p>
          </div>

          ${projectsHtml}

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);">
            <h3 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
              Find me online
            </h3>
            ${socialHtml}
          </div>
        </div>
      </div>
    `;

    windowId = WindowManager.createWindow("browser", "Projects — Browser", contentHtml, {
      width: 750,
      height: 550,
      icon: Desktop.ICONS.browser,
      singleInstance: true,
      onClose: () => {
        windowId = null;
      },
    });
  }

  return { open };
})();
