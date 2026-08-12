const AboutApp = (() => {
  // A cool retro ASCII portrait
  const ASCII_ART = `
      .▄▄▄▄▄.
    ▄█████████▄
   ████▀ ▀ ▀████
   ███ ▄   ▄ ███
   ███ ▀   ▀ ███
   ▀██▄ ▄▄▄ ▄██▀
     ▀▀█████▀▀
       █████
      ▄█████▄
     █████████`;

  function open() {
    WindowManager.createWindow({
      id: "about-os",
      title: "About TanmayOS",
      width: 480,
      height: 340,
      icon: ICONS.info || `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      content: `
        <div class="about-app-container" style="display: flex; gap: 24px; padding: 24px; font-family: var(--font-mono); color: var(--text-primary); background: var(--bg-primary); height: 100%; box-sizing: border-box; align-items: center;">
          <div class="about-ascii" style="white-space: pre; font-size: 16px; line-height: 1.15; color: var(--accent-primary); font-weight: bold; text-shadow: 0 0 5px var(--accent-primary);">${ASCII_ART}</div>
          <div class="about-info" style="display: flex; flex-direction: column; justify-content: center; gap: 12px; flex: 1;">
            <h2 style="margin: 0; color: var(--text-primary); font-size: 24px; letter-spacing: -0.5px;">TanmayOS <span style="font-size: 14px; color: var(--text-secondary); font-weight: normal;">v1.0</span></h2>
            <div style="width: 100%; height: 1px; background: #333; margin: 4px 0;"></div>
            <p style="margin: 0; font-size: 15px;"><span style="color: var(--text-secondary);">User:</span> ${PORTFOLIO_DATA.personal.fullName}</p>
            <p style="margin: 0; font-size: 15px;"><span style="color: var(--text-secondary);">Role:</span> ${PORTFOLIO_DATA.personal.title}</p>
            <p style="margin: 0; font-size: 15px;"><span style="color: var(--text-secondary);">Loc:</span> ${PORTFOLIO_DATA.personal.location}</p>
            <div style="margin-top: 12px; display: flex; gap: 16px;">
              <a href="${PORTFOLIO_DATA.personal.github}" target="_blank" style="color: var(--accent-primary); text-decoration: none; border: 1px solid var(--accent-primary); padding: 4px 12px; transition: all 0.2s;">GitHub</a>
              <a href="${PORTFOLIO_DATA.personal.linkedin}" target="_blank" style="color: var(--accent-primary); text-decoration: none; border: 1px solid var(--accent-primary); padding: 4px 12px; transition: all 0.2s;">LinkedIn</a>
            </div>
          </div>
        </div>
      `
    });
  }

  return { open };
})();
