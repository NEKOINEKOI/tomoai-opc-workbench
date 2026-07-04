(function () {
  const checkBtn = document.getElementById("publishCheckBtn");
  const modal = document.getElementById("publishCheckModal");
  const closeBtn = document.getElementById("closePublishCheckBtn");
  const summary = document.getElementById("publishCheckSummary");
  const result = document.getElementById("publishCheckResult");

  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function currentArticleTitle() {
    const titleInput = document.getElementById("articleTitleInput");
    const coverTitleInput = document.getElementById("coverTitleInput");
    return titleInput?.value || coverTitleInput?.value || "未命名文章";
  }

  function renderCheck(data) {
    const issues = Array.isArray(data.issues) ? data.issues : [];
    summary.textContent = data.summary || "检查完成。";
    if (!issues.length) {
      result.innerHTML = '<div class="publish-check-empty">没有发现明显问题，可以进入人工复核。</div>';
      return;
    }
    result.innerHTML = issues.map((issue) => `
      <article class="publish-check-item ${escapeHtml(issue.severity || "info")}">
        <div class="publish-check-line">
          <b>${escapeHtml(issue.type || "检查项")}</b>
          <span>${escapeHtml(issue.severityLabel || issue.severity || "提示")}</span>
        </div>
        ${issue.quote ? `<p><strong>命中：</strong>${escapeHtml(issue.quote)}</p>` : ""}
        <p><strong>建议：</strong>${escapeHtml(issue.suggestion || "")}</p>
      </article>
    `).join("");
  }

  async function runPublishCheck() {
    const markdownInput = document.getElementById("markdownInput");
    const markdown = markdownInput?.value || "";
    modal?.classList.remove("hidden");
    summary.textContent = "正在检查标题、AI 味、违禁风险和证据完整度。";
    result.innerHTML = '<div class="publish-check-empty">检查中...</div>';
    try {
      const resp = await fetch("/api/ai/check-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentArticleTitle(), markdown }),
      });
      const payload = await resp.json();
      if (!resp.ok) throw new Error(payload.error || "发布检查失败");
      renderCheck(payload.check || payload);
    } catch (err) {
      summary.textContent = "检查失败";
      result.innerHTML = `<div class="publish-check-empty">${escapeHtml(err.message || err)}</div>`;
    }
  }

  checkBtn?.addEventListener("click", runPublishCheck);
  closeBtn?.addEventListener("click", () => modal?.classList.add("hidden"));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.add("hidden");
  });
})();
