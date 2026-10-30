
const NotepadApp = (() => {
  function open() {
    openWithContent(
      "README.md",
      PORTFOLIO_DATA.filesystem["~"].children["README.md"].content
    );
  }

  function openWithContent(fileName, content) {
    const lines = content.split("\n");
    const lineNumbersHtml = lines.map((_, i) => i + 1).join("\n");

    const contentHtml = `
      <div class="notepad-container">
        <div class="notepad-toolbar">
          <span class="notepad-filename">📄 ${fileName}</span>
          <span style="margin-left: auto; font-size: 11px; color: var(--text-muted);">
            ${lines.length} lines · UTF-8
          </span>
        </div>
        <div class="notepad-editor-wrapper">
          <div class="notepad-line-numbers">${lineNumbersHtml}</div>
          <textarea class="notepad-editor" spellcheck="false" wrap="off" readonly>${escapeHtml(content)}</textarea>
        </div>
      </div>
    `;

    const windowId = WindowManager.createWindow("notepad", `Notepad — ${fileName}`, contentHtml, {
      width: 650,
      height: 450,
      icon: Desktop.ICONS.notepad,
      singleInstance: false,
    });

    const winEl = document.getElementById(windowId);
    if (winEl) {
      const editor = winEl.querySelector(".notepad-editor");
      const lineNumbers = winEl.querySelector(".notepad-line-numbers");
      if (editor && lineNumbers) {
        editor.addEventListener("scroll", () => {
          lineNumbers.scrollTop = editor.scrollTop;
        });
        lineNumbers.addEventListener("wheel", (e) => {
          editor.scrollTop += e.deltaY;
          e.preventDefault();
        }, { passive: false });
      }
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  return { open, openWithContent };
})();
