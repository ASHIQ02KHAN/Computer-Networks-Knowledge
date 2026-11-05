/**
 * katex-init.js
 * Auto-renders KaTeX math on every MkDocs page load.
 * Supports both inline ($…$) and display ($$…$$) delimiters.
 */
document.addEventListener("DOMContentLoaded", function () {
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$",  right: "$",  display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true  }
    ],
    throwOnError: false
  });
});
