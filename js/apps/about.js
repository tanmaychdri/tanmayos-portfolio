const AboutApp = (() => {
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
    const contentHtml = `
        <div class="about-app-container" style="display: flex; gap: 24px; padding: 24px; font-family: var(--font-mono); color: var(--text-primary); background: var(--bg-primary); height: 100%; box-sizing: border-box; align-items: center;">
          <div class="about-ascii" style="white-space: pre; font-size: 16px; line-height: 1.15; color: var(--accent-primary); font-weight: bold; text-shadow: 0 0 5px var(--accent-primary);">${ASCII_ART}</div>
          <div class="about-info" style="display: flex; flex-direction: column; justify-content: center; gap: 12px; flex: 1;">
            <h2 style="margin: 0; color: var(--text-primary); font-size: 24px; letter-spacing: -0.5px;">TanmayOS <span style="font-size: 14px; color: var(--text-secondary); font-weight: normal;">v1.2.2</span></h2>
            <div style="width: 100%; height: 1px; background: #333; margin: 4px 0;"></div>
            <p style="margin: 0; font-size: 15px;"><span style="color: var(--text-secondary);">User:</span> ${PORTFOLIO_DATA.personal.fullName}</p>
            <p style="margin: 0; font-size: 15px;"><span style="color: var(--text-secondary);">Role:</span> ${PORTFOLIO_DATA.personal.title}</p>
            <p style="margin: 0; font-size: 15px;"><span style="color: var(--text-secondary);">Loc:</span> ${PORTFOLIO_DATA.personal.location}</p>
            <div style="margin-top: 12px; display: flex; gap: 16px;">
              <a href="${PORTFOLIO_DATA.social.github}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: none; border: 1px solid var(--accent-primary); padding: 4px 12px; transition: all 0.2s;">GitHub</a>
              <a href="${PORTFOLIO_DATA.social.linkedin}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: none; border: 1px solid var(--accent-primary); padding: 4px 12px; transition: all 0.2s;">LinkedIn</a>
            </div>
          </div>
        </div>
      `;

    WindowManager.createWindow("about", "About TanmayOS", contentHtml, {
      width: 480,
      height: 340,
      icon: Desktop.ICONS.info,
      singleInstance: true,
    });
  }

  return { open };
})();
