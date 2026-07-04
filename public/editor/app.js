const markdownInput = document.getElementById("markdownInput");
const previewArea = document.getElementById("previewArea");
const wordCountText = document.getElementById("wordCountText");
const copyBtn = document.getElementById("copyBtn");
const convertBtn = document.getElementById("convertBtn");
const pushDraftBtn = document.getElementById("pushDraftBtn");
const pushProgress = document.getElementById("pushProgress");
const pushProgressBar = document.getElementById("pushProgressBar");
const pushProgressText = document.getElementById("pushProgressText");
const insertOutroBtn = document.getElementById("insertOutroBtn");
const editOutroBtn = document.getElementById("editOutroBtn");
const exportObsidianBtn = document.getElementById("exportObsidianBtn");
const statusText = document.getElementById("statusText");
const insertImageBtn = document.getElementById("insertImageBtn");
const imagePicker = document.getElementById("imagePicker");
const coverPicker = document.getElementById("coverPicker");
const outroModal = document.getElementById("outroModal");
const outroEditor = document.getElementById("outroEditor");
const outroPreview = document.getElementById("outroPreview");
const outroImagePicker = document.getElementById("outroImagePicker");
const outroInsertImageBtn = document.getElementById("outroInsertImageBtn");
const outroSaveBtn = document.getElementById("outroSaveBtn");
const outroSaveInsertBtn = document.getElementById("outroSaveInsertBtn");
const outroCancelBtn = document.getElementById("outroCancelBtn");
const newArticleBtn = document.getElementById("newArticleBtn");
const articleList = document.getElementById("articleList");
const articleActions = document.getElementById("articleActions");
const articleSearchInput = document.getElementById("articleSearchInput");
const articleTitleInput = document.getElementById("articleTitleInput");
const articleSubtitleInput = document.getElementById("articleSubtitleInput");
const currentArticleTitle = document.getElementById("currentArticleTitle");
const renameArticleBtn = document.getElementById("renameArticleBtn");
const deleteArticleBtn = document.getElementById("deleteArticleBtn");
const openImaBtn = document.getElementById("openImaBtn");
const openAiProviderBtn = document.getElementById("openAiProviderBtn");
const aiProviderModal = document.getElementById("aiProviderModal");
const aiProviderForm = document.getElementById("aiProviderForm");
const aiProviderInfo = document.getElementById("aiProviderInfo");
const aiProviderSummary = document.getElementById("aiProviderSummary");
const testAiProviderBtn = document.getElementById("testAiProviderBtn");
const closeAiProviderBtn = document.getElementById("closeAiProviderBtn");
const openTopicLibraryBtn = document.getElementById("openTopicLibraryBtn");
const topicList = document.getElementById("topicList");
const topicModal = document.getElementById("topicModal");
const closeTopicModalBtn = document.getElementById("closeTopicModalBtn");
const topicTitleInput = document.getElementById("topicTitleInput");
const topicRecommendationInput = document.getElementById("topicRecommendationInput");
const addTopicBtn = document.getElementById("addTopicBtn");
const topicTodoList = document.getElementById("topicTodoList");
const topicDoneList = document.getElementById("topicDoneList");
const selectAllTodoTopics = document.getElementById("selectAllTodoTopics");
const deleteSelectedTopicsBtn = document.getElementById("deleteSelectedTopicsBtn");
const whitelistModal = document.getElementById("whitelistModal");
const whitelistIpText = document.getElementById("whitelistIpText");
const copyWhitelistIpBtn = document.getElementById("copyWhitelistIpBtn");
const closeWhitelistModalBtn = document.getElementById("closeWhitelistModalBtn");
const selectionToolbar = document.getElementById("selectionToolbar");
const coverTitleInput = document.getElementById("coverTitleInput");
const coverSubtitleInput = document.getElementById("coverSubtitleInput");
const coverSquareInput = document.getElementById("coverSquareInput");
const copyCoverPromptBtn = document.getElementById("copyCoverPromptBtn");
const copyCoverTitleSubtitleBtn = document.getElementById("copyCoverTitleSubtitleBtn");
const autoMarkdownBtn = document.getElementById("autoMarkdownBtn");
const clearFormattingBtn = document.getElementById("clearFormattingBtn");
const openTableBuilderBtn = document.getElementById("openTableBuilderBtn");
const tableBuilderModal = document.getElementById("tableBuilderModal");
const tableColCount = document.getElementById("tableColCount");
const tableRowCount = document.getElementById("tableRowCount");
const tableRefreshBtn = document.getElementById("tableRefreshBtn");
const tableBuilderGrid = document.getElementById("tableBuilderGrid");
const tableCancelBtn = document.getElementById("tableCancelBtn");
const tableInsertBtn = document.getElementById("tableInsertBtn");
const imageResizeModal = document.getElementById("imageResizeModal");
const imageModalTitle = document.getElementById("imageModalTitle");
const imageModalSubtitle = document.getElementById("imageModalSubtitle");
const imageSizeGroup = document.getElementById("imageSizeGroup");
const imageRowGroup = document.getElementById("imageRowGroup");
const imgSize30 = document.getElementById("imgSize30");
const imgSize50 = document.getElementById("imgSize50");
const imgSize70 = document.getElementById("imgSize70");
const imgSize100 = document.getElementById("imgSize100");
const imgRow = document.getElementById("imgRow");
const imgCut = document.getElementById("imgCut");
const imgDelete = document.getElementById("imgDelete");
const imgSizeCancel = document.getElementById("imgSizeCancel");
const imageStore = new Map();
let imageIdSeed = 1;
const STORAGE_KEY = "wechat_markdown_articles_v1";
const PUSH_SETTINGS_KEY = "wechat_draft_push_settings_v1";
const OUTRO_TEMPLATE_KEY = "wechat_outro_template_v1";
const OUTRO_TEMPLATE_IMAGES_KEY = "wechat_outro_template_images_v1";
const COVER_PROMPT_STATE_KEY = "wechat_cover_prompt_state_v1";
const API_BASE = window.location.protocol === "file:" ? "http://localhost:8788" : "";
const WECHAT_WHITELIST_URL = "https://mp.weixin.qq.com/cgi-bin/safecenterstatus?action=view&t=setting/safe-index&token=356069842&lang=zh_CN";
let docs = [];
let topics = [];
let selectedTodoTopicIds = new Set();
let currentDocId = null;
let docsSaveTimer = null;
let docsSaveInFlight = false;
let docsSaveQueued = false;
let topicsSaveTimer = null;
let activeToolbarTextarea = null;
let outroModalMode = "edit";
const outroImageStore = new Map();
const textareaHistories = new WeakMap();
let pendingImageResizeSelection = null;
let lastImageSelectionSignature = "";
let pendingWhitelistIp = "";

const DEFAULT_COVER_PROMPT_FIELDS = {
  title: "本地部署真香",
  subtitle: "大模型本地部署，从开始到放弃",
  square: "Codex 手搓小工具",
};

const DEFAULT_OUTRO_TEMPLATE = `
---

今天就酱八，明天继续聊AI。

欢迎<strong style="color:#916dd5;">点赞、评论、转发、一键关注点亮星标</strong>，每天学点 AI 小技巧👇

我建了个AI的交流群，欢迎一起来交流学习。

<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=你的biz号#wechat_redirect">👉 点击进入公众号主页名片</a>

## 关于我

这里是智井，一名普通90后主副业双修职场女性。

目前专注研究AI+降本增效方案。

## 往期精选

### AI工具

- <a href="https://mp.weixin.qq.com/s/文章链接1">变了！我把龙虾训练成了夜班员工，一觉醒来活全干完了</a>
- <a href="https://mp.weixin.qq.com/s/文章链接2">这个知识库会自我迭代：Karpathy 公开 LLM Wiki 新玩法</a>
- <a href="https://mp.weixin.qq.com/s/文章链接3">恐怖如斯！我用OpenClaw把客服同事蒸馏成了Skill</a>

### AI副业

- <a href="https://mp.weixin.qq.com/s/文章链接4">AI算命春节爆火！实测用DeepSeek算2025年运势（内含教程）</a>
- <a href="https://mp.weixin.qq.com/s/文章链接5">情绪价值副业太香！AI唤醒老照片，4天暴涨粉4k+，含保姆级教程</a>

### 复盘&总结

- <a href="https://mp.weixin.qq.com/s/文章链接6">90后女牛马，被优化了....</a>
`.trim();

const defaultMd = `**这是加粗的效果**

*这是斜线的效果*

<u>这是下划线的效果</u>

~~这是删除的效果~~

\`这是行内代码\`

$这是行内公式$

# 这是一级标题

## 这是二级标题

### 这是三级标题

#### 这是四级标题

##### 这是五级标题

###### 这是六级标题

- 这是无序排列
- 这是无序排列

1. 这是有序排列
2. 这是有序排列

\`\`\`
这是代码
\`\`\`

>这是引用

这是正文的效果，我需要你模仿它的字体，行间距，还有颜色等等，我就是需要你一比一地复刻这套样式

然后这是图片的效果，我希望图片的代码可以短小一点，不然我排版的话看起来会非常困难，尤其图多的时候，你想办法把图片的代码，要么不显示那么多，要么想办法减少到很短，就跟下面这个一样。

![](https://files.mdnice.com/user/108877/51126459-4320-4538-a374-1d93f4e28687.jpg)`;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseInline(text) {
  const placeholders = [];
  const put = (html) => {
    const key = `@@INLINE_${placeholders.length}@@`;
    placeholders.push({ key, html });
    return key;
  };

  let out = escapeHtml(text);

  // 先处理 <u>...</u>，避免后续 URL 自动识别把 &lt;/u&gt; 误吞进链接
  out = out.replace(/&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g, "<u style=\"text-decoration-color:currentColor;\">$1</u>");

  out = out.replace(/!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)(?:\{w:(30|50|70|100)\})?/g, (_, alt, src, caption, width) => {
    return put(renderImageFigure({ alt, src, caption, width }));
  });

  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    // 识别 Markdown 链接语法，但不输出可点击链接，避免公众号端样式干扰
    return put(`<span style="color:#465261;text-decoration:underline;text-decoration-color:currentColor;">${escapeHtml(label)}</span>`);
  });

  out = out.replace(/(https?:\/\/[^\s<>"'，。！？；、）】]+)/g, (url) => {
    return put(`<span style="color:#465261;text-decoration:underline;text-decoration-color:currentColor;">${escapeHtml(url)}</span>`);
  });

  out = out.replace(/`([^`]+)`/g, (_, code) => {
    return put(`<code style="padding:0 4px;border-radius:4px;font-family:Consolas,monospace;font-size:1em;color:#916dd5;background:#f3f4f4;">${escapeHtml(code)}</code>`);
  });

  out = out.replace(/\$([^$\n]+)\$/g, (_, formula) => {
    return put(`<span style="padding:0 1px;font-family:'Cambria Math','Times New Roman',serif;font-size:1em;color:#9aa3b2;background:transparent;">${escapeHtml(formula)}</span>`);
  });

  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong style=\"color:#916dd5;font-weight:700;\">$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em style=\"color:#4b5665;font-style:italic;background:#f6eeff;padding:0 2px;border-radius:3px;\">$1</em>");
  out = out.replace(/~~([^~]+)~~/g, "<span style=\"color:#8a72db;text-decoration:line-through;text-decoration-color:currentColor;font-style:italic;\">$1</span>");

  placeholders.forEach(({ key, html }) => {
    out = out.replace(key, html);
  });

  out = out.replace(/\n/g, "<br/>");
  return out;
}

function resolveImageSrc(src) {
  let resolvedSrc = src || "";
  if (typeof resolvedSrc === "string" && resolvedSrc.startsWith("image://")) {
    resolvedSrc = imageStore.get(resolvedSrc) || outroImageStore.get(resolvedSrc) || "";
  }
  return resolvedSrc;
}

function parseImageMarkdownLine(line) {
  const raw = String(line || "").trim();
  const full = raw.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)(?:\{w:(30|50|70|100)\})?$/);
  if (!full) return null;
  return {
    raw,
    alt: full[1] || "",
    src: full[2] || "",
    caption: full[3] || "",
    width: full[4] || "",
  };
}

function renderImageFigure(image, options = {}) {
  const resolvedSrc = resolveImageSrc(image.src);
  if (!resolvedSrc) return "";
  const imgWidth = image.width ? Number(image.width) : 100;
  const finalCaption = (image.caption && image.caption.trim()) || (image.alt && image.alt.trim()) || "";
  const captionHtml = finalCaption
    ? `<figcaption style="margin-top:14px;color:#9aa3b2;font-size:1em;line-height:1.6;text-align:center;">${escapeHtml(finalCaption)}</figcaption>`
    : "";
  const figureStyle = options.inline
    ? "display:block;flex:1 1 0;min-width:0;margin:0;"
    : "display:block;margin:14px auto 12px;";
  const widthStyle = options.inline ? "width:100%;" : `width:${imgWidth}%;`;
  return `<figure style="${figureStyle}"><img alt="${escapeHtml(image.alt)}" src="${escapeHtml(resolvedSrc)}" style="display:block;max-width:100%;${widthStyle}margin:0 auto;border-radius:12px;" />${captionHtml}</figure>`;
}

function renderImageRowBlock(imageLines) {
  const images = imageLines.map(parseImageMarkdownLine).filter(Boolean);
  if (images.length < 2) {
    return images.length === 1 ? renderImageFigure(images[0]) : "";
  }
  const gap = images.length > 2 ? 8 : 10;
  const figures = images.map((image) => renderImageFigure(image, { inline: true })).join("");
  return `<section style="display:flex;gap:${gap}px;align-items:flex-start;margin:16px 0 14px;">${figures}</section>`;
}

function isTableDividerLine(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(String(line || "").trim());
}

function isTableRowLine(line) {
  const trimmed = String(line || "").trim();
  return /^\|.+\|$/.test(trimmed) || /^[^|]+\|[^|]+/.test(trimmed);
}

function renderTableBlock(tableLines) {
  if (tableLines.length < 2 || !isTableDividerLine(tableLines[1])) {
    return "";
  }
  const parseCells = (line) => String(line || "")
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
  const headers = parseCells(tableLines[0]);
  const bodyRows = tableLines.slice(2).filter(isTableRowLine).map(parseCells);
  let html = `<section style="margin:18px 0;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.65;color:#465261;">`;
  html += `<thead><tr>`;
  for (const header of headers) {
    html += `<th style="padding:8px 10px;border-bottom:1px solid #d8c9f5;text-align:left;color:#3f4b59;font-weight:700;">${parseInline(header)}</th>`;
  }
  html += `</tr></thead>`;
  if (bodyRows.length) {
    html += `<tbody>`;
    for (const row of bodyRows) {
      html += `<tr>`;
      for (let idx = 0; idx < headers.length; idx += 1) {
        html += `<td style="padding:8px 10px;border-bottom:1px solid #eee8fb;vertical-align:top;">${parseInline(row[idx] || "")}</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody>`;
  }
  html += `</table></section>`;
  return html;
}

function getMarkdownLineStarts(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const starts = [0];
  for (let idx = 0; idx < normalized.length; idx += 1) {
    if (normalized[idx] === "\n") starts.push(idx + 1);
  }
  return starts;
}

function previewSourceAttrs(lineIndex, lineStarts) {
  const pos = lineStarts[Math.max(0, lineIndex)] || 0;
  return `data-md-line="${lineIndex}" data-md-pos="${pos}" class="preview-source-block"`;
}

function markdownToStyledHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const lineStarts = getMarkdownLineStarts(markdown);
  let i = 0;
  let html = "";

  const articleStyle = "max-width:680px;margin:0 auto;color:#465261;font-size:15px;line-height:1.78;font-family:'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif;letter-spacing:0.12px;";

  html += `<section style="${articleStyle}">`;

  while (i < lines.length) {
    const blockStartLine = i;
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^:::\s*image-row\s*$/.test(trimmed)) {
      const imageLines = [];
      i += 1;
      while (i < lines.length && !/^:::\s*$/.test(lines[i].trim())) {
        if (lines[i].trim()) imageLines.push(lines[i].trim());
        i += 1;
      }
      if (i < lines.length && /^:::\s*$/.test(lines[i].trim())) {
        i += 1;
      }
      html += `<section ${previewSourceAttrs(blockStartLine, lineStarts)}>${renderImageRowBlock(imageLines)}</section>`;
      continue;
    }

    if (/^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)(?:\{w:(?:30|50|70|100)\})?$/.test(trimmed)) {
      html += `<section ${previewSourceAttrs(blockStartLine, lineStarts)}>${parseInline(trimmed)}</section>`;
      i += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const codeLines = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      const codeHtml = (codeLines.length ? codeLines : [""])
        .map((line) => escapeHtml(String(line).replace(/\t/g, "    ")).replace(/ /g, "&nbsp;"))
        .join("<br/>");
      html += `<section ${previewSourceAttrs(blockStartLine, lineStarts)} style="background:#272d39;border-radius:8px;overflow:hidden;margin:22px 0;box-shadow:0 6px 14px rgba(18,22,30,0.28);"><div style="height:30px;box-sizing:border-box;padding:0;background-color:#242a35;background-image:radial-gradient(circle,#ff5f56 0 5px,transparent 5.2px),radial-gradient(circle,#ffbd2e 0 5px,transparent 5.2px),radial-gradient(circle,#27c93f 0 5px,transparent 5.2px);background-repeat:no-repeat;background-size:10px 10px,10px 10px,10px 10px;background-position:16px 10px,34px 10px,52px 10px;line-height:0;font-size:0;user-select:none;-webkit-user-select:none;color:transparent;">&#65279;</div><section style="margin:0;padding:12px 16px 14px;overflow:hidden;"><code style="display:block;line-height:1.7;font-size:14px;color:#c5ceda;font-family:Consolas,Monaco,'Courier New',monospace;white-space:normal;word-break:break-word;">${codeHtml || "&nbsp;"}</code></section></section>`;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      html += `<hr ${previewSourceAttrs(blockStartLine, lineStarts)} style="border:none;border-top:1px solid #e2d6ff;margin:28px 0;" />`;
      i += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s*(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = parseInline(heading[2]);
      if (level === 1) {
        html += `<h1 ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:24px;line-height:1.38;color:#3f4b59;margin:20px 0 14px;font-weight:800;">${content}</h1>`;
      } else if (level === 2) {
        html += `<h2 ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:18px;line-height:1.42;color:#3f4b59;margin:22px 0 14px;font-weight:800;border-left:4px solid #d8c4ff;border-radius:0;padding-left:10px;padding-top:1px;padding-bottom:1px;">${content}</h2>`;
      } else if (level === 3) {
        html += `<h3 ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:16px;line-height:1.42;color:#4d5968;margin:18px 0 14px;font-weight:700;text-align:center;"><span style="display:inline-block;border-bottom:2px solid #cdc0ee;padding-bottom:1px;">${content}</span></h3>`;
      } else if (level === 4) {
        html += `<h4 ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:18px;line-height:1.42;color:#111111;margin:18px 0 12px;font-weight:800;">${content}</h4>`;
      } else if (level === 5) {
        html += `<h5 ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:16px;line-height:1.42;color:#111111;margin:16px 0 11px;font-weight:800;">${content}</h5>`;
      } else if (level === 6) {
        html += `<h6 ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:15px;line-height:1.4;color:#111111;margin:14px 0 10px;font-weight:800;">${content}</h6>`;
      } else {
        html += `<h${level} ${previewSourceAttrs(blockStartLine, lineStarts)} style="font-size:16px;line-height:1.5;color:#4f5462;margin:18px 0 10px;font-weight:700;">${content}</h${level}>`;
      }
      i += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      html += `<blockquote ${previewSourceAttrs(blockStartLine, lineStarts)} style="margin:20px 0;padding:12px 14px;border:1px solid #eddefd;background:#f6eeff;color:#465261;border-radius:4px;">${parseInline(quoteLines.join("\n"))}</blockquote>`;
      continue;
    }

    if (isTableRowLine(trimmed) && i + 1 < lines.length && isTableDividerLine(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && isTableRowLine(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i += 1;
      }
      html += `<section ${previewSourceAttrs(blockStartLine, lineStarts)}>${renderTableBlock(tableLines)}</section>`;
      continue;
    }

    if (/^[-*+]\s+(?:\[[ xX]\]\s+)?/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+(?:\[[ xX]\]\s+)?/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+(?:\[[ xX]\]\s+)?/, ""));
        i += 1;
      }
      html += `<section ${previewSourceAttrs(blockStartLine, lineStarts)} style="margin:14px 0 16px;">`;
      for (const item of items) {
        html += `<p style="margin:6px 0;color:#465261;"><span style="display:inline-block;width:9px;height:9px;line-height:9px;font-size:0;border:1.4px solid #596273;border-radius:50%;box-sizing:border-box;vertical-align:middle;margin-right:10px;">&nbsp;</span><span style="color:#465261;vertical-align:middle;">${parseInline(item)}</span></p>`;
      }
      html += `</section>`;
      continue;
    }

    if (/^\d+[.)、）]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[.)、）]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)、）]\s+/, ""));
        i += 1;
      }
      html += `<section ${previewSourceAttrs(blockStartLine, lineStarts)} style="margin:14px 0 16px;">`;
      for (let idx = 0; idx < items.length; idx += 1) {
        const item = items[idx];
        html += `<p style="margin:6px 0;color:#465261;"><span style="display:inline-block;min-width:1.5em;color:#111111;">${idx + 1}.</span><span style="color:#465261;">${parseInline(item)}</span></p>`;
      }
      html += `</section>`;
      continue;
    }

    const paraLines = [trimmed];
    i += 1;
    while (i < lines.length) {
      const look = lines[i].trim();
      if (!look) {
        i += 1;
        break;
      }
      if (/^(#{1,6})\s*/.test(look) || /^```/.test(look) || /^:::\s*image-row\s*$/.test(look) || /^>\s?/.test(look) || (isTableRowLine(look) && i + 1 < lines.length && isTableDividerLine(lines[i + 1])) || /^[-*+]\s+(?:\[[ xX]\]\s+)?/.test(look) || /^\d+[.)、）]\s+/.test(look) || /^---+$/.test(look)) {
        break;
      }
      paraLines.push(look);
      i += 1;
    }

    html += `<p ${previewSourceAttrs(blockStartLine, lineStarts)} style="margin:14px 0 12px;color:#465261;">${parseInline(paraLines.join("\n"))}</p>`;
  }

  html += `</section>`;
  return html;
}

function renderPreview() {
  if (markdownInput.value.includes("(data:image/")) {
    compactDataUrlImagesInMarkdown();
  }
  const html = markdownToStyledHtml(markdownInput.value);
  previewArea.innerHTML = html;
  if (wordCountText) {
    wordCountText.textContent = `${markdownInput.value.length} 字`;
  }
  statusText.textContent = `已渲染 ${markdownInput.value.length} 字符`; 
  updateCurrentArticleMeta();
}

function scrollMarkdownEditorToSource(lineIndex, pos) {
  if (!markdownInput) return;
  const safePos = Math.max(0, Number(pos) || 0);
  markdownInput.focus();
  markdownInput.setSelectionRange(safePos, safePos);
  const caret = getSelectionCaretPosition(markdownInput, safePos);
  const targetTop = Math.max(0, caret.y - markdownInput.clientHeight * 0.28);
  markdownInput.scrollTop = targetTop;
  showEditorSourceLocator(caret);
  markdownInput.classList.add("editor-source-flash");
  window.setTimeout(() => {
    markdownInput.classList.remove("editor-source-flash");
  }, 520);
}

function showEditorSourceLocator(caret) {
  const host = markdownInput?.closest(".editor-card");
  if (!host || !caret) return;
  host.querySelectorAll(".editor-locator-highlight, .editor-locator-rail").forEach((node) => node.remove());

  const styles = window.getComputedStyle(markdownInput);
  const lineHeight = Number.parseFloat(styles.lineHeight) || 27;
  const textTop = markdownInput.offsetTop + caret.y - markdownInput.scrollTop;
  const top = Math.max(markdownInput.offsetTop + 8, Math.min(textTop, markdownInput.offsetTop + markdownInput.clientHeight - lineHeight - 8));

  const highlight = document.createElement("div");
  highlight.className = "editor-locator-highlight";
  highlight.style.top = `${top}px`;
  highlight.style.left = `${markdownInput.offsetLeft + 12}px`;
  highlight.style.width = `${Math.max(120, markdownInput.clientWidth - 24)}px`;
  highlight.style.height = `${lineHeight}px`;

  const rail = document.createElement("div");
  rail.className = "editor-locator-rail";
  rail.style.top = `${top}px`;
  rail.style.left = `${markdownInput.offsetLeft + 6}px`;
  rail.style.height = `${lineHeight}px`;

  host.append(highlight, rail);
  window.setTimeout(() => {
    highlight.remove();
    rail.remove();
  }, 1600);
}

function handlePreviewSourceClick(event) {
  const source = event.target.closest("[data-md-line]");
  if (!source || !previewArea.contains(source)) return;
  previewArea.querySelectorAll(".preview-source-active").forEach((node) => node.classList.remove("preview-source-active"));
  source.classList.add("preview-source-active");
  window.setTimeout(() => {
    source.classList.remove("preview-source-active");
  }, 1200);
  scrollMarkdownEditorToSource(source.dataset.mdLine, source.dataset.mdPos);
}

function autoResizeEditor() {
  markdownInput.style.height = "100%";
}

function autoResizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function insertTextAtCursorIn(textarea, text) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = `${before}${text}${after}`;
  const nextPos = start + text.length;
  textarea.selectionStart = nextPos;
  textarea.selectionEnd = nextPos;
  textarea.focus();
}

function insertTextAtCursor(text) {
  insertTextAtCursorIn(markdownInput, text);
}

function cleanMarkdownText(text) {
  return String(text || "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function escapeMarkdownInline(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNestedHeadingMarks(text) {
  return String(text || "")
    .replace(/^\s*#{1,6}\s+/, "")
    .trim();
}

function looksLikeMarkdownText(text) {
  const raw = String(text || "");
  return (
    /(^|\n)\s{0,3}#{1,6}\s+\S/.test(raw) ||
    /(^|\n)\s{0,3}> ?\S/.test(raw) ||
    /(^|\n)\s{0,3}[-*+]\s+\S/.test(raw) ||
    /(^|\n)\s{0,3}\d+[.)、）]\s+\S/.test(raw) ||
    /(^|\n)\s{0,3}```/.test(raw) ||
    /!\[[^\]]*]\([^)]+?\)/.test(raw) ||
    /\[[^\]]+]\([^)]+?\)/.test(raw) ||
    /\*\*[^*\n]+?\*\*/.test(raw) ||
    /~~[^~\n]+?~~/.test(raw) ||
    /(^|\n)\s*\|.+\|/.test(raw)
  );
}

function escapeMarkdownTableCell(text) {
  return escapeMarkdownInline(text).replace(/\|/g, "\\|");
}

function indentContinuationLines(text, indent = "  ") {
  return String(text || "")
    .split("\n")
    .map((line, index) => (index === 0 ? line : `${indent}${line}`))
    .join("\n");
}

function htmlNodeToMarkdown(node, context = {}) {
  if (!node) return "";
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const tag = node.tagName.toLowerCase();
  const childInline = () => Array.from(node.childNodes)
    .map((child) => htmlNodeToMarkdown(child, { ...context, inline: true }))
    .join("");
  const childBlock = () => Array.from(node.childNodes)
    .map((child) => htmlNodeToMarkdown(child, context))
    .join("");

  if (tag === "br") return "\n";
  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag.slice(1));
    const title = stripNestedHeadingMarks(escapeMarkdownInline(childInline()));
    return title ? `\n\n${"#".repeat(level)} ${title}\n\n` : "";
  }
  if (tag === "p") {
    const text = childInline().trim();
    return text ? `\n\n${text}\n\n` : "\n\n";
  }
  if (tag === "div" || tag === "section" || tag === "article" || tag === "main") {
    if (context.inline) return childInline();
    const text = childBlock().trim();
    return text ? `\n\n${text}\n\n` : "";
  }
  if (tag === "strong" || tag === "b") return `**${escapeMarkdownInline(childInline())}**`;
  if (tag === "em" || tag === "i") return `*${escapeMarkdownInline(childInline())}*`;
  if (tag === "u") return `<u>${escapeMarkdownInline(childInline())}</u>`;
  if (tag === "s" || tag === "del" || tag === "strike") return `~~${escapeMarkdownInline(childInline())}~~`;
  if (tag === "code") {
    if (node.parentElement?.tagName?.toLowerCase() === "pre") return node.textContent || "";
    return `\`${(node.textContent || "").trim()}\``;
  }
  if (tag === "pre") {
    const text = node.textContent || "";
    return `\n\n\`\`\`\n${text.replace(/\n+$/g, "")}\n\`\`\`\n\n`;
  }
  if (tag === "blockquote") {
    const text = cleanMarkdownText(childBlock() || node.textContent || "");
    return `\n\n${text.split("\n").map((line) => line.trim() ? `> ${line}` : ">").join("\n")}\n\n`;
  }
  if (tag === "ul" || tag === "ol") {
    const ordered = tag === "ol";
    let idx = 1;
    const items = Array.from(node.children)
      .filter((child) => child.tagName?.toLowerCase() === "li")
      .map((li) => {
        const content = cleanMarkdownText(htmlNodeToMarkdown(li, { inline: true }));
        const marker = ordered ? `${idx++}.` : "-";
        return `${marker} ${indentContinuationLines(content)}`;
      });
    return `\n\n${items.join("\n")}\n\n`;
  }
  if (tag === "li") return childInline();
  if (tag === "a") {
    const label = escapeMarkdownInline(childInline() || node.textContent || "");
    const href = node.getAttribute("href") || "";
    if (!href || /^javascript:/i.test(href)) return label;
    return label && label !== href ? `[${label}](${href})` : label;
  }
  if (tag === "img") {
    const alt = node.getAttribute("alt") || "";
    const src = node.getAttribute("src") || "";
    return src ? `\n\n![${alt}](${src})\n\n` : "";
  }
  if (tag === "table") {
    const rows = Array.from(node.querySelectorAll("tr")).map((tr) =>
      Array.from(tr.children).map((cell) => escapeMarkdownTableCell(cell.textContent || ""))
    ).filter((row) => row.length);
    if (!rows.length) return "";
    const colCount = Math.max(...rows.map((row) => row.length));
    const pad = (row) => Array.from({ length: colCount }, (_, i) => row[i] || "");
    const header = pad(rows[0]);
    const body = rows.slice(1).map(pad);
    return `\n\n| ${header.join(" | ")} |\n| ${Array.from({ length: colCount }, () => "---").join(" | ")} |\n${body.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n\n`;
  }

  return childInline();
}

function hasStructuredClipboardHtml(html) {
  return /<(h[1-6]|p|br|ul|ol|li|strong|b|em|i|u|s|del|strike|pre|code|blockquote|table|img|a)\b/i.test(String(html || ""));
}

function htmlToMarkdown(html) {
  const raw = String(html || "");
  if (!raw.trim() || !/[<][a-zA-Z]/.test(raw)) return "";
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const root = doc.body;
  const md = Array.from(root.childNodes).map((node) => htmlNodeToMarkdown(node)).join("");
  return cleanMarkdownText(md);
}

function shouldUseHtmlMarkdown(html, plainText) {
  if (!html || !/[<][a-zA-Z]/.test(html) || !hasStructuredClipboardHtml(html)) return false;
  const plain = String(plainText || "");
  if (!plain.trim()) return true;
  if (looksLikeMarkdownText(plain)) return false;
  return true;
}

function normalizePastedMarkdown(text) {
  if (!text) return "";
  return cleanMarkdownText(text)
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
    .split("\n")
    .map((line) => {
      let next = line.replace(/[ \t]+$/g, "");
      next = next.replace(/^(\s*)[•·●▪◦]\s+/, "$1- ");
      next = next.replace(/^(\s*)[–—]\s+/, "$1- ");
      next = next.replace(/^(\s*)(\d+)[、）)]\s+/, "$1$2. ");
      next = next.replace(/^(\s*)(#{1,6})\s+#{1,6}\s+(.+)$/, "$1$2 $3");
      next = next.replace(/^(\s*)(#{1,6})(\S.*)$/, "$1$2 $3");
      next = next.replace(/^(\s*)＞\s*/, "$1> ");
      return next;
    })
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n");
}

function handleMarkdownTextPaste(event, textarea) {
  const text = event.clipboardData?.getData("text/plain") || "";
  const html = event.clipboardData?.getData("text/html") || "";
  if (!text.trim() && !html.trim()) return false;
  const htmlMarkdown = shouldUseHtmlMarkdown(html, text) ? htmlToMarkdown(html) : "";
  const normalized = normalizePastedMarkdown(htmlMarkdown || text);
  event.preventDefault();
  insertTextAtCursorIn(textarea, normalized);
  runAfterTextareaChange(textarea);
  statusText.textContent = htmlMarkdown ? "已从富文本还原为 Markdown" : "已清洗并粘贴 Markdown";
  return true;
}

function isExistingMarkdownLine(line) {
  const trimmed = String(line || "").trim();
  return (
    /^(#{1,6})\s+/.test(trimmed) ||
    /^!\[[^\]]*\]\(/.test(trimmed) ||
    /^\[[^\]]+\]\([^)]+\)/.test(trimmed) ||
    /^:::\s*/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^[-*+]\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed) ||
    /^---+$/.test(trimmed) ||
    isTableRowLine(trimmed)
  );
}

function isLikelyTitleLine(line) {
  const text = String(line || "").trim();
  if (!text) return false;
  if (text.length > 38) return false;
  if (/[。！？!?；;，,]$/.test(text)) return false;
  if (/^https?:\/\//i.test(text)) return false;
  return true;
}

function unwrapMarkdownMarks(line) {
  return String(line || "")
    .trim()
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\*\*([\s\S]*)\*\*$/, "$1")
    .replace(/^「([\s\S]*)」$/, "$1")
    .trim();
}

function formatFixedArticleLine(line, state) {
  const text = unwrapMarkdownMarks(line);
  if (state.nonEmptyCount === 1) {
    return "**你好啊，这里是智井。**";
  }
  if (text === "写在最后") {
    state.hasH1 = true;
    return "# 写在最后";
  }
  return null;
}

function looksLikeMajorSection(line) {
  const text = stripTitleTailColon(unwrapMarkdownMarks(line));
  if (/^(第[一二三四五六七八九十百千万\d]+[章节篇部分]|[一二三四五六七八九十]+[、.．])/.test(text)) return true;
  return /^(开头|引言|背景|核心观点|主要内容|关键结论|案例|方法|步骤|清单|复盘|总结|结语|最后的话|写在前面|写在后面)$/.test(text);
}

function looksLikeCodeLine(line) {
  const text = String(line || "").trim();
  if (!text) return false;
  return (
    /^[{}\[\](),;]+$/.test(text) ||
    /^(const|let|var|function|class|import|export|return|if|else|for|while|try|catch)\b/.test(text) ||
    /^(def|class|from|import|print|return|if|elif|else|for|while|try|except)\b/.test(text) ||
    /^(npm|pnpm|yarn|node|python|pip|git|curl|npx|uv|docker|cd|mkdir|copy|xcopy|set)\s+/.test(text) ||
    /^<\/?[a-z][\s\S]*>$/i.test(text) ||
    /^[\w.-]+\s*[:=]\s*[\[{\"'`]/.test(text) ||
    /[{};]$/.test(text)
  );
}

function looksLikePromptBlockStart(line) {
  return /^(提示词|prompt|system prompt|user prompt|指令|角色设定|要求|输出格式)[:：]/i.test(String(line || "").trim());
}

function shouldCodeBlockFrom(lines, index) {
  const current = lines[index] || "";
  const trimmed = current.trim();
  if (!trimmed) return false;
  if (looksLikePromptBlockStart(trimmed)) return true;
  if (/^[{\[]/.test(trimmed)) return true;
  const windowLines = lines.slice(index, Math.min(lines.length, index + 4)).filter((line) => line.trim());
  if (windowLines.length < 2) return false;
  return windowLines.filter(looksLikeCodeLine).length >= 2;
}

function collectCodeLikeBlock(lines, start) {
  const block = [];
  let braceScore = 0;
  let sawStructured = false;
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) break;
    const isCode = looksLikeCodeLine(trimmed) || looksLikePromptBlockStart(trimmed) || sawStructured;
    if (!isCode && block.length >= 2) break;
    block.push(line);
    if (/^[{\[]/.test(trimmed)) sawStructured = true;
    braceScore += (trimmed.match(/[{\[]/g) || []).length;
    braceScore -= (trimmed.match(/[}\]]/g) || []).length;
    if (sawStructured && braceScore <= 0 && block.length > 1) {
      return { block, end: i };
    }
  }
  return block.length ? { block, end: start + block.length - 1 } : null;
}

function codeFenceForBlock(block) {
  const text = block.join("\n");
  if (/^\s*[{\[]/.test(text)) return "json";
  if (/\b(const|let|function|import|export|console\.log)\b/.test(text)) return "js";
  if (/\b(def|print|from\s+\w+\s+import)\b/.test(text)) return "python";
  if (/<\/?[a-z][\s\S]*>/i.test(text)) return "html";
  return "";
}

function stripTitleTailColon(line) {
  return String(line || "").trim().replace(/[：:]\s*$/, "");
}

function autoFormatPlainLine(line, state) {
  const raw = String(line || "");
  const trimmed = raw.trim();
  if (!trimmed) return "";
  state.nonEmptyCount += 1;
  const fixed = formatFixedArticleLine(trimmed, state);
  if (fixed) return fixed;
  if (isExistingMarkdownLine(trimmed)) return trimmed;

  const bullet = trimmed.match(/^[•·●▪◦]\s*(.+)$/);
  if (bullet) return `- ${bullet[1].trim()}`;

  const section = trimmed.match(/^(第[一二三四五六七八九十百千万\d]+[章节篇部分]|[一二三四五六七八九十]+[、.．])\s*(.+)$/);
  if (section && isLikelyTitleLine(trimmed)) {
    return `## ${trimmed}`;
  }

  const numbered = trimmed.match(/^(\d+)[、）)]\s*(.+)$/);
  if (numbered) {
    const content = numbered[2].trim();
    if (content.length <= 28 && !/[。！？!?]$/.test(content)) {
      return `## ${numbered[1]}. ${content}`;
    }
    return `${numbered[1]}. ${content}`;
  }

  if (looksLikeMajorSection(trimmed) && isLikelyTitleLine(trimmed)) {
    return `## ${stripTitleTailColon(trimmed)}`;
  }

  if (/[：:]$/.test(trimmed) && isLikelyTitleLine(trimmed)) {
    return `### ${stripTitleTailColon(trimmed)}`;
  }

  if (!state.hasH1 && state.nonEmptyCount === 1 && isLikelyTitleLine(trimmed)) {
    state.hasH1 = true;
    return `# ${trimmed}`;
  }

  if (isLikelyTitleLine(trimmed) && state.previousBlank && state.nextBlank) {
    return `## ${trimmed}`;
  }

  return trimmed;
}

function autoMarkdownizeText(text) {
  const normalized = normalizePastedMarkdown(text);
  const lines = normalized.split("\n");
  const out = [];
  const state = {
    hasH1: lines.some((line) => /^#\s+/.test(line.trim())),
    nonEmptyCount: 0,
  };
  let inCode = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^```/.test(trimmed)) {
      inCode = !inCode;
      out.push(trimmed);
      continue;
    }
    if (inCode) {
      out.push(line);
      continue;
    }

    if (shouldCodeBlockFrom(lines, i)) {
      const collected = collectCodeLikeBlock(lines, i);
      if (collected && collected.block.length) {
        const fence = codeFenceForBlock(collected.block);
        out.push(`\`\`\`${fence}`);
        out.push(...collected.block);
        out.push("```");
        i = collected.end;
        continue;
      }
    }

    if (trimmed && line.includes("\t")) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes("\t")) {
        tableRows.push(lines[i].trim().split("\t").map(escapeMarkdownTableCell));
        i += 1;
      }
      i -= 1;
      const colCount = Math.max(...tableRows.map((row) => row.length));
      const padRow = (row) => Array.from({ length: colCount }, (_, col) => row[col] || "");
      const headers = padRow(tableRows[0]).map((cell, col) => cell || `列${col + 1}`);
      out.push(`| ${headers.join(" | ")} |`);
      out.push(`| ${Array.from({ length: colCount }, () => "---").join(" | ")} |`);
      tableRows.slice(1).map(padRow).forEach((row) => {
        out.push(`| ${row.join(" | ")} |`);
      });
      continue;
    }

    state.previousBlank = i === 0 || !lines[i - 1].trim();
    state.nextBlank = i === lines.length - 1 || !lines[i + 1].trim();
    out.push(autoFormatPlainLine(line, state));
  }

  return out.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

async function organizeMarkdownSegment(segment, mode) {
  const resp = await fetch(`${API_BASE}/api/editor/organize-markdown`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: segment,
      mode,
      title: getCurrentDoc()?.title || articleTitleInput?.value || "",
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data.ok || !data.markdown) {
    throw new Error(data.error || "模型整理 Markdown 失败");
  }
  return String(data.markdown || "").trim();
}

async function autoMarkdownizeEditor() {
  const textarea = markdownInput;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;
  const value = textarea.value || "";
  const hasSelection = end > start;
  const from = hasSelection ? start : 0;
  const to = hasSelection ? end : value.length;
  const segment = value.slice(from, to);
  if (!segment.trim()) return;
  const originalButtonText = autoMarkdownBtn?.textContent || "";
  if (autoMarkdownBtn) {
    autoMarkdownBtn.disabled = true;
    autoMarkdownBtn.textContent = "整理中...";
  }
  statusText.textContent = hasSelection ? "正在整理选中内容..." : "正在整理全文 Markdown...";

  let nextSegment = "";
  let shouldResetButtonText = true;
  try {
    nextSegment = await organizeMarkdownSegment(segment, hasSelection ? "selection" : "full");
    if ((textarea.value || "") !== value) {
      statusText.textContent = "编辑区内容已变化，请重新点击整理 Markdown";
      return;
    }
  } catch (err) {
    const message = err?.message || "模型整理 Markdown 失败";
    statusText.textContent = `AI 整理失败，未改动文章：${message}`;
    shouldResetButtonText = false;
    if (autoMarkdownBtn) {
      autoMarkdownBtn.textContent = "AI 整理失败";
      autoMarkdownBtn.title = message;
      setTimeout(() => {
        autoMarkdownBtn.textContent = originalButtonText || "整理 Markdown";
        autoMarkdownBtn.title = "";
      }, 3500);
    }
    console.warn(err);
    return;
  } finally {
    if (autoMarkdownBtn) {
      autoMarkdownBtn.disabled = false;
      if (shouldResetButtonText) {
        autoMarkdownBtn.textContent = originalButtonText || "整理 Markdown";
        autoMarkdownBtn.title = "";
      }
    }
  }

  textarea.value = `${value.slice(0, from)}${nextSegment}${value.slice(to)}`;
  textarea.selectionStart = from;
  textarea.selectionEnd = from + nextSegment.length;
  textarea.focus();
  runAfterTextareaChange(textarea);
  const target = hasSelection ? "选中内容" : "全文";
  statusText.textContent = `已用 AI 整理${target} Markdown`;
}

function setAiProviderInfo(provider, envProvider) {
  if (!aiProviderInfo) return;
  const current = provider || {};
  const env = envProvider || {};
  const envText = env.enabled
    ? `\n\n环境变量已配置，会优先生效：\nBase URL：${env.baseURL || ""}\n模型：${env.model || ""}\nKey：${env.maskedApiKey || "已配置"}`
    : "";
  aiProviderInfo.textContent = current.enabled
    ? `当前已配置：${current.name || "未命名中转站"}\nBase URL：${current.baseURL || ""}\n模型：${current.model || ""}\nKey：${current.maskedApiKey || "已保存"}\n来源：${current.source || "local-file"}${envText}`
    : `还没有配置可用的 API。保存 Agnes 信息后，“整理 Markdown”会优先调用模型。${envText}`;
}

function fillAiProviderForm(provider) {
  if (!aiProviderForm) return;
  const p = provider || {};
  const defaults = {
    name: p.name || "Agnes AI",
    baseURL: p.baseURL || "https://apihub.agnes-ai.com/v1",
    model: p.model || "agnes-1.5-flash",
  };
  ["name", "baseURL", "model"].forEach((field) => {
    const input = aiProviderForm.querySelector(`[name="${field}"]`);
    if (input) input.value = defaults[field] || "";
  });
  const keyInput = aiProviderForm.querySelector('[name="apiKey"]');
  if (keyInput) keyInput.value = "";
}

async function loadAiProviderConfig() {
  if (aiProviderInfo) aiProviderInfo.textContent = "正在读取配置...";
  const resp = await fetch(`${API_BASE}/api/ai-providers`);
  const data = await resp.json();
  if (!resp.ok || !data.ok) throw new Error(data.error || "读取 API 设置失败");
  fillAiProviderForm(data.provider);
  setAiProviderInfo(data.provider, data.envProvider);
  return data;
}

function aiProviderFromForm() {
  const form = new FormData(aiProviderForm);
  const provider = Object.fromEntries(form.entries());
  provider.id = "default";
  provider.name = String(provider.name || "Agnes AI").trim();
  provider.baseURL = String(provider.baseURL || "https://apihub.agnes-ai.com/v1").trim();
  provider.apiKey = String(provider.apiKey || "").trim();
  provider.model = String(provider.model || "agnes-1.5-flash").trim();
  provider.enabled = Boolean(provider.baseURL && provider.model && provider.apiKey);
  return provider;
}

async function saveAiProviderConfig() {
  const provider = aiProviderFromForm();
  const resp = await fetch(`${API_BASE}/api/ai-providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data.ok) throw new Error(data.error || "保存 API 设置失败");
  setAiProviderInfo(data.provider, null);
  return data.provider;
}

async function openAiProviderModal() {
  if (!aiProviderModal) return;
  aiProviderModal.classList.remove("hidden");
  try {
    await loadAiProviderConfig();
    statusText.textContent = "已打开 API 设置";
  } catch (err) {
    if (aiProviderInfo) aiProviderInfo.textContent = err.message;
  }
}

function closeAiProviderModal() {
  if (aiProviderModal) aiProviderModal.classList.add("hidden");
}

function clampNumber(value, min, max, fallback) {
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, num));
}

function getTableBuilderSize() {
  return {
    cols: clampNumber(tableColCount?.value, 1, 8, 3),
    rows: clampNumber(tableRowCount?.value, 1, 12, 3),
  };
}

function renderTableBuilderGrid() {
  if (!tableBuilderGrid) return;
  const { cols, rows } = getTableBuilderSize();
  if (tableColCount) tableColCount.value = String(cols);
  if (tableRowCount) tableRowCount.value = String(rows);
  const previousValues = new Map();
  tableBuilderGrid.querySelectorAll(".table-cell-input").forEach((input) => {
    previousValues.set(input.dataset.cell, input.value);
  });
  tableBuilderGrid.innerHTML = "";
  tableBuilderGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(130px, 1fr))`;

  for (let row = 0; row <= rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const input = document.createElement("input");
      const key = `${row}-${col}`;
      input.type = "text";
      input.className = "table-cell-input";
      input.dataset.cell = key;
      input.dataset.role = row === 0 ? "header" : "body";
      input.placeholder = row === 0 ? `表头 ${col + 1}` : `第 ${row} 行`;
      input.value = previousValues.get(key) || "";
      tableBuilderGrid.appendChild(input);
    }
  }
}

function openTableBuilder() {
  if (!tableBuilderModal) return;
  renderTableBuilderGrid();
  tableBuilderModal.classList.remove("hidden");
  const firstInput = tableBuilderGrid?.querySelector(".table-cell-input");
  setTimeout(() => firstInput?.focus(), 0);
}

function closeTableBuilder() {
  if (!tableBuilderModal) return;
  tableBuilderModal.classList.add("hidden");
  markdownInput.focus();
}

function escapeMarkdownTableCell(value) {
  return String(value || "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function buildMarkdownTableFromGrid() {
  const { cols, rows } = getTableBuilderSize();
  const getCell = (row, col) => {
    const input = tableBuilderGrid?.querySelector(`[data-cell="${row}-${col}"]`);
    return escapeMarkdownTableCell(input?.value || "");
  };
  const headers = Array.from({ length: cols }, (_, col) => getCell(0, col) || `列${col + 1}`);
  const divider = Array.from({ length: cols }, () => "---");
  const body = [];
  for (let row = 1; row <= rows; row += 1) {
    body.push(Array.from({ length: cols }, (_, col) => getCell(row, col)));
  }
  return [
    `| ${headers.join(" | ")} |`,
    `| ${divider.join(" | ")} |`,
    ...body.map((cells) => `| ${cells.join(" | ")} |`),
  ].join("\n");
}

function insertBuiltTable() {
  const tableMarkdown = buildMarkdownTableFromGrid();
  const prefix = markdownInput.value && !markdownInput.value.slice(0, markdownInput.selectionStart ?? 0).endsWith("\n") ? "\n\n" : "";
  insertTextAtCursorIn(markdownInput, `${prefix}${tableMarkdown}\n\n`);
  runAfterTextareaChange(markdownInput);
  closeTableBuilder();
  statusText.textContent = "已插入 Markdown 表格";
}

function runAfterTextareaChange(textarea) {
  if (textarea === markdownInput) {
    autoResizeEditor();
    renderPreview();
    persistCurrentDoc();
    recordTextareaHistory(textarea);
    return;
  }
  if (textarea === outroEditor) {
    autoResizeTextarea(outroEditor);
    renderOutroPreview();
    recordTextareaHistory(textarea);
  }
}

function ensureTextareaHistory(textarea) {
  if (!textarea) return null;
  let history = textareaHistories.get(textarea);
  if (!history) {
    history = {
      stack: [{
        value: textarea.value || "",
        start: textarea.selectionStart ?? 0,
        end: textarea.selectionEnd ?? 0,
      }],
      index: 0,
      restoring: false,
    };
    textareaHistories.set(textarea, history);
  }
  return history;
}

function resetTextareaHistory(textarea) {
  if (!textarea) return;
  textareaHistories.set(textarea, {
    stack: [{
      value: textarea.value || "",
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    }],
    index: 0,
    restoring: false,
  });
}

function recordTextareaHistory(textarea) {
  const history = ensureTextareaHistory(textarea);
  if (!history || history.restoring) return;
  const current = {
    value: textarea.value || "",
    start: textarea.selectionStart ?? 0,
    end: textarea.selectionEnd ?? 0,
  };
  const prev = history.stack[history.index];
  if (prev && prev.value === current.value && prev.start === current.start && prev.end === current.end) {
    return;
  }
  if (history.index < history.stack.length - 1) {
    history.stack = history.stack.slice(0, history.index + 1);
  }
  history.stack.push(current);
  if (history.stack.length > 200) {
    history.stack.shift();
  }
  history.index = history.stack.length - 1;
}

function restoreTextareaFromHistory(textarea, state) {
  if (!textarea || !state) return;
  const history = ensureTextareaHistory(textarea);
  history.restoring = true;
  textarea.value = state.value;
  textarea.selectionStart = Math.min(state.start, textarea.value.length);
  textarea.selectionEnd = Math.min(state.end, textarea.value.length);
  textarea.focus();
  history.restoring = false;

  if (textarea === markdownInput) {
    autoResizeEditor();
    renderPreview();
    persistCurrentDoc();
    return;
  }
  if (textarea === outroEditor) {
    autoResizeTextarea(outroEditor);
    renderOutroPreview();
  }
}

function undoTextarea(textarea) {
  const history = ensureTextareaHistory(textarea);
  if (!history || history.index <= 0) return;
  history.index -= 1;
  restoreTextareaFromHistory(textarea, history.stack[history.index]);
}

function redoTextarea(textarea) {
  const history = ensureTextareaHistory(textarea);
  if (!history || history.index >= history.stack.length - 1) return;
  history.index += 1;
  restoreTextareaFromHistory(textarea, history.stack[history.index]);
}

function wrapSelectionIn(textarea, prefix, suffix = prefix) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;
  if (start === end) return;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const next = `${prefix}${selected}${suffix}`;
  textarea.value = `${value.slice(0, start)}${next}${value.slice(end)}`;
  textarea.selectionStart = start;
  textarea.selectionEnd = start + next.length;
  textarea.focus();
  runAfterTextareaChange(textarea);
}

function getCurrentParagraphRangeIn(textarea) {
  const value = textarea.value || "";
  const cursor = textarea.selectionStart ?? 0;
  let { start, end } = getCurrentLineRangeIn(textarea);

  const currentLine = value.slice(start, end);
  if (!currentLine.trim()) {
    return { start, end };
  }

  while (start > 0) {
    const prevEnd = start - 1;
    const prevStart = value.lastIndexOf("\n", Math.max(0, prevEnd - 1)) + 1;
    const prevLine = value.slice(prevStart, prevEnd);
    if (!prevLine.trim()) break;
    start = prevStart;
  }

  while (end < value.length) {
    const nextStart = end + 1;
    const nextEndRaw = value.indexOf("\n", nextStart);
    const nextEnd = nextEndRaw === -1 ? value.length : nextEndRaw;
    const nextLine = value.slice(nextStart, nextEnd);
    if (!nextLine.trim()) break;
    end = nextEnd;
  }

  if (cursor < start || cursor > end) {
    return { start: cursor, end: cursor };
  }
  return { start, end };
}

function wrapCurrentParagraphIn(textarea, prefix, suffix = prefix, afterChange) {
  if (!textarea) return;
  const startSel = textarea.selectionStart ?? 0;
  const endSel = textarea.selectionEnd ?? startSel;
  if (endSel > startSel) {
    wrapSelectionIn(textarea, prefix, suffix);
    return;
  }

  const value = textarea.value || "";
  const { start, end } = getCurrentParagraphRangeIn(textarea);
  const segment = value.slice(start, end);
  if (!segment) return;
  const nextSegment = `${prefix}${segment}${suffix}`;
  textarea.value = `${value.slice(0, start)}${nextSegment}${value.slice(end)}`;
  textarea.selectionStart = start;
  textarea.selectionEnd = start + nextSegment.length;
  textarea.focus();
  if (typeof afterChange === "function") afterChange();
}

function replaceSelectionIn(textarea, transformer) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;
  if (start === end) return;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const next = transformer(selected);
  textarea.value = `${value.slice(0, start)}${next}${value.slice(end)}`;
  textarea.selectionStart = start;
  textarea.selectionEnd = start + next.length;
  textarea.focus();
  runAfterTextareaChange(textarea);
}

function normalizeCornerQuotes(text) {
  let out = String(text || "");
  out = out.replace(/“([^”]*)”/g, "「$1」");
  out = out.replace(/"([^"]*)"/g, "「$1」");
  if (/^「[\s\S]*」$/.test(out.trim())) {
    return out;
  }
  return `「${out}」`;
}

function stripMarkdownFormatting(text) {
  let out = String(text || "").replace(/\r\n?/g, "\n");

  out = out.replace(/```[^\n]*\n([\s\S]*?)\n?```/g, "$1");
  out = out.replace(/!\[([^\]]*)\]\((?:[^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, caption) => caption || alt || "");
  out = out.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  out = out.replace(/<u>([\s\S]*?)<\/u>/gi, "$1");
  out = out.replace(/<\/?(strong|b|em|i|s|strike|del|code)>/gi, "");
  out = out.replace(/(^|\n)\s{0,3}#{1,6}\s+/g, "$1");
  out = out.replace(/(^|\n)\s{0,3}>\s?/g, "$1");
  out = out.replace(/(^|\n)\s{0,3}[-*+]\s+/g, "$1");
  out = out.replace(/(^|\n)\s{0,3}\d+[.)、）]\s+/g, "$1");
  out = out.replace(/(^|\n)\s{0,3}---+\s*(?=\n|$)/g, "$1");
  out = out.replace(/(^|\n)\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*(?=\n|$)/g, "$1");
  out = out.replace(/^\s*\|\s?|\s?\|\s*$/gm, "");
  out = out.replace(/\s?\|\s?/g, "  ");

  let previous = "";
  while (previous !== out) {
    previous = out;
    out = out
      .replace(/\*\*([^*\n]+)\*\*/g, "$1")
      .replace(/__([^_\n]+)__/g, "$1")
      .replace(/~~([^~\n]+)~~/g, "$1")
      .replace(/`([^`\n]+)`/g, "$1")
      .replace(/\$([^$\n]+)\$/g, "$1")
      .replace(/\*([^*\n]+)\*/g, "$1")
      .replace(/_([^_\n]+)_/g, "$1");
  }

  return out
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function removeSecondPersonWords(text) {
  return String(text || "").replace(/你们|你的|你/g, "");
}

function stripListPrefix(line) {
  return String(line || "").replace(/^(\s*)(?:[-*+]\s+|\d+[.)、）]\s+)/, "$1");
}

function formatSelectionAsList(text, ordered = false) {
  let index = 1;
  return String(text || "")
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line;
      const indent = (line.match(/^\s*/) || [""])[0];
      const content = stripListPrefix(line).trim();
      if (ordered) {
        const marker = `${index}.`;
        index += 1;
        return `${indent}${marker} ${content}`;
      }
      return `${indent}- ${content}`;
    })
    .join("\n");
}

function getSelectionCaretPosition(textarea, pos) {
  const styles = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  const marker = document.createElement("span");
  const props = [
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight",
    "letterSpacing", "textTransform", "textIndent", "textAlign",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "boxSizing", "whiteSpace", "wordBreak", "overflowWrap", "tabSize",
  ];

  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.left = "-9999px";
  mirror.style.top = "0";
  mirror.style.width = `${textarea.clientWidth}px`;
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflowWrap = "break-word";
  props.forEach((key) => {
    mirror.style[key] = styles[key];
  });

  const before = textarea.value.slice(0, pos);
  mirror.textContent = before;
  marker.textContent = "\u200b";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const x = marker.offsetLeft;
  const y = marker.offsetTop;
  document.body.removeChild(mirror);
  return { x, y };
}

function positionSelectionToolbar(textarea) {
  if (!selectionToolbar || !textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const startCaret = getSelectionCaretPosition(textarea, start);
  const endCaret = getSelectionCaretPosition(textarea, end);
  const rect = textarea.getBoundingClientRect();
  const toolbarRect = selectionToolbar.getBoundingClientRect();
  const selectionTop = Math.min(startCaret.y, endCaret.y) - textarea.scrollTop;
  const selectionBottom = Math.max(startCaret.y, endCaret.y) - textarea.scrollTop;
  const selectionMidX = (startCaret.x + endCaret.x) / 2 - textarea.scrollLeft;

  let left = rect.left + selectionMidX - toolbarRect.width / 2;
  let top = rect.top + selectionTop - toolbarRect.height - 10;

  if (left < 8) left = 8;
  const maxLeft = window.innerWidth - toolbarRect.width - 8;
  if (left > maxLeft) left = maxLeft;

  if (top < rect.top + 6) {
    top = rect.top + selectionBottom + 24;
  }
  const maxTop = window.innerHeight - toolbarRect.height - 8;
  if (top > maxTop) top = maxTop;
  if (top < 8) top = 8;

  selectionToolbar.style.left = `${left}px`;
  selectionToolbar.style.top = `${top}px`;
}

function hideSelectionToolbar() {
  if (!selectionToolbar) return;
  selectionToolbar.classList.add("hidden");
  activeToolbarTextarea = null;
}

function isImageResizeModalOpen() {
  return Boolean(imageResizeModal && !imageResizeModal.classList.contains("hidden"));
}

function showSelectionToolbar(textarea) {
  if (!selectionToolbar || !textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  if (end <= start) {
    hideSelectionToolbar();
    return;
  }
  activeToolbarTextarea = textarea;
  selectionToolbar.classList.remove("hidden");
  positionSelectionToolbar(textarea);
}

function updateSelectionToolbarFor(textarea) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const selected = end > start ? (textarea.value || "").slice(start, end) : "";
  if (
    isImageResizeModalOpen() ||
    parseSelectedImageMarkdown(selected) ||
    parseSelectedImageMarkdownGroup(selected) ||
    document.activeElement !== textarea ||
    end <= start
  ) {
    hideSelectionToolbar();
    return;
  }
  showSelectionToolbar(textarea);
}

function applySelectionAction(textarea, action) {
  if (!textarea) return;
  if (action === "bold") { wrapSelectionIn(textarea, "**", "**"); return; }
  if (action === "italic") { wrapSelectionIn(textarea, "*", "*"); return; }
  if (action === "underline") { wrapSelectionIn(textarea, "<u>", "</u>"); return; }
  if (action === "inline-code") { wrapSelectionIn(textarea, "`", "`"); return; }
  if (action === "strike") { wrapSelectionIn(textarea, "~~", "~~"); return; }
  if (action === "link") { wrapSelectionIn(textarea, "[", "](https://)"); return; }
  if (action === "code-block") {
    replaceSelectionIn(textarea, (selected) => `\`\`\`\n${selected}\n\`\`\``);
    return;
  }
  if (action === "quote") {
    replaceSelectionIn(textarea, (selected) => selected.split("\n").map((line) => `> ${line}`).join("\n"));
    return;
  }
  if (action === "unordered-list") {
    replaceSelectionIn(textarea, (selected) => formatSelectionAsList(selected, false));
    return;
  }
  if (action === "ordered-list") {
    replaceSelectionIn(textarea, (selected) => formatSelectionAsList(selected, true));
    return;
  }
  if (action === "corner-quote") {
    replaceSelectionIn(textarea, normalizeCornerQuotes);
    return;
  }
  if (action === "clear-markdown") {
    replaceSelectionIn(textarea, stripMarkdownFormatting);
    return;
  }
  if (action === "remove-you") {
    replaceSelectionIn(textarea, removeSecondPersonWords);
  }
}

function parseSelectedImageMarkdown(text) {
  return parseImageMarkdownLine(text);
}

function parseSelectedImageMarkdownGroup(text) {
  if (!text) return null;
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const parsed = lines.map(parseImageMarkdownLine);
  if (parsed.some((item) => !item)) return null;
  return {
    rawLines: parsed.map((item) => item.raw),
  };
}

function withImageWidth(raw, width) {
  const cleaned = raw.replace(/\{w:(30|50|70|100)\}\s*$/, "");
  return `${cleaned}{w:${width}}`;
}

function setImageModalMode(mode) {
  const isRow = mode === "row";
  if (imageModalTitle) {
    imageModalTitle.textContent = isRow ? "多图操作" : "图片操作";
  }
  if (imageModalSubtitle) {
    imageModalSubtitle.textContent = isRow
      ? "把选中的多张 Markdown 图片排到同一行，适合对比图和连续图。"
      : "调整当前选中的 Markdown 图片，或直接删除这一行。";
  }
  [imgSize30, imgSize50, imgSize70, imgSize100].forEach((button) => {
    if (button) button.classList.toggle("modal-action-hidden", isRow);
  });
  if (imageSizeGroup) {
    imageSizeGroup.classList.toggle("modal-action-hidden", isRow);
  }
  if (imageRowGroup) {
    imageRowGroup.classList.toggle("modal-action-hidden", false);
  }
  if (imgRow) {
    imgRow.classList.toggle("modal-action-hidden", !isRow);
  }
  if (imgCut) {
    imgCut.textContent = isRow ? "剪切多图" : "剪切图片";
  }
}

function openImageResizeModal(textarea, start, end, rawImageMd, mode = "single", rawLines = []) {
  if (!imageResizeModal) return;
  pendingImageResizeSelection = { textarea, start, end, rawImageMd, mode, rawLines };
  setImageModalMode(mode);
  hideSelectionToolbar();
  imageResizeModal.classList.remove("hidden");
}

function closeImageResizeModal() {
  if (!imageResizeModal) return;
  imageResizeModal.classList.add("hidden");
  pendingImageResizeSelection = null;
}

function applyImageResize(width) {
  const pending = pendingImageResizeSelection;
  if (!pending || !pending.textarea) return;
  const { textarea, start, end, rawImageMd } = pending;
  const nextRaw = withImageWidth(rawImageMd, width);
  const value = textarea.value || "";
  textarea.value = `${value.slice(0, start)}${nextRaw}${value.slice(end)}`;
  textarea.selectionStart = start;
  textarea.selectionEnd = start + nextRaw.length;
  textarea.focus();
  runAfterTextareaChange(textarea);
  lastImageSelectionSignature = `${start}-${start + nextRaw.length}-${nextRaw}`;
  closeImageResizeModal();
}

function deleteSelectedImageMarkdown() {
  const pending = pendingImageResizeSelection;
  if (!pending || !pending.textarea) return;
  const { textarea, start, end } = pending;
  const value = textarea.value || "";
  let lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  let lineEnd = value.indexOf("\n", end);
  if (lineEnd === -1) {
    lineEnd = value.length;
  } else {
    lineEnd += 1;
  }

  const nextValue = `${value.slice(0, lineStart)}${value.slice(lineEnd)}`;
  textarea.value = nextValue;
  textarea.selectionStart = lineStart;
  textarea.selectionEnd = lineStart;
  textarea.focus();
  runAfterTextareaChange(textarea);
  lastImageSelectionSignature = "";
  closeImageResizeModal();
}

function getPendingImageCutText(pending) {
  if (!pending) return "";
  if (Array.isArray(pending.rawLines) && pending.rawLines.length > 0) {
    return pending.rawLines.join("\n");
  }
  return pending.rawImageMd || "";
}

async function writeTextToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  const ok = document.execCommand("copy");
  helper.remove();
  return ok;
}

async function cutSelectedImageMarkdown() {
  const pending = pendingImageResizeSelection;
  if (!pending || !pending.textarea) return;
  const cutText = getPendingImageCutText(pending);
  try {
    const copied = await writeTextToClipboard(cutText);
    if (!copied) {
      throw new Error("浏览器没有允许写入剪贴板");
    }
  } catch (err) {
    alert(`剪切失败：${err.message || err}`);
    return;
  }
  deleteSelectedImageMarkdown();
  statusText.textContent = "图片 Markdown 已剪切，可以粘贴到新位置";
}

function arrangeSelectedImagesInRow() {
  const pending = pendingImageResizeSelection;
  if (!pending || !pending.textarea || !Array.isArray(pending.rawLines) || pending.rawLines.length < 2) return;
  const { textarea, start, end, rawLines } = pending;
  const value = textarea.value || "";
  const nextRaw = `::: image-row\n${rawLines.join("\n")}\n:::`;
  textarea.value = `${value.slice(0, start)}${nextRaw}${value.slice(end)}`;
  textarea.selectionStart = start;
  textarea.selectionEnd = start + nextRaw.length;
  textarea.focus();
  runAfterTextareaChange(textarea);
  lastImageSelectionSignature = `${start}-${start + nextRaw.length}-image-row`;
  closeImageResizeModal();
}

function maybeOpenImageResizeFromSelection(textarea) {
  if (!textarea || !imageResizeModal) return false;
  if (isImageResizeModalOpen()) {
    hideSelectionToolbar();
    return true;
  }
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  if (end <= start) return false;
  const selected = (textarea.value || "").slice(start, end);
  const imageGroup = parseSelectedImageMarkdownGroup(selected);
  if (imageGroup) {
    const sig = `${start}-${end}-${imageGroup.rawLines.join("|")}`;
    lastImageSelectionSignature = sig;
    openImageResizeModal(textarea, start, end, "", "row", imageGroup.rawLines);
    return true;
  }
  const parsed = parseSelectedImageMarkdown(selected);
  if (!parsed) return false;
  const sig = `${start}-${end}-${parsed.raw}`;
  lastImageSelectionSignature = sig;
  openImageResizeModal(textarea, start, end, parsed.raw);
  return true;
}

function bindSelectionToolbarToTextarea(textarea) {
  if (!textarea) return;
  const update = () => updateSelectionToolbarFor(textarea);
  textarea.addEventListener("mouseup", () => {
    if (maybeOpenImageResizeFromSelection(textarea)) return;
    update();
  });
  textarea.addEventListener("keyup", () => {
    if (maybeOpenImageResizeFromSelection(textarea)) return;
    update();
  });
  textarea.addEventListener("select", () => {
    if (maybeOpenImageResizeFromSelection(textarea)) return;
    update();
  });
  textarea.addEventListener("scroll", update);
  textarea.addEventListener("input", update);
  textarea.addEventListener("blur", () => {
    setTimeout(() => {
      if (!selectionToolbar || !selectionToolbar.contains(document.activeElement)) {
        hideSelectionToolbar();
      }
    }, 80);
  });
}

function getCurrentLineRangeIn(textarea) {
  const cursor = textarea.selectionStart ?? 0;
  const value = textarea.value;
  const start = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
  const endRaw = value.indexOf("\n", cursor);
  const end = endRaw === -1 ? value.length : endRaw;
  return { start, end };
}

function transformCurrentLineIn(textarea, transformer, afterChange) {
  const { start, end } = getCurrentLineRangeIn(textarea);
  const value = textarea.value;
  const currentLine = value.slice(start, end);
  const nextLine = transformer(currentLine);
  textarea.value = `${value.slice(0, start)}${nextLine}${value.slice(end)}`;
  textarea.selectionStart = start;
  textarea.selectionEnd = start + nextLine.length;
  textarea.focus();
  if (typeof afterChange === "function") afterChange();
}

function wrapCurrentLineIn(textarea, prefix, suffix = prefix, afterChange) {
  transformCurrentLineIn(textarea, (line) => `${prefix}${line}${suffix}`, afterChange);
}

function prefixCurrentLineIn(textarea, prefix, afterChange) {
  transformCurrentLineIn(textarea, (line) => `${prefix}${line}`, afterChange);
}

function setCurrentLineHeadingIn(textarea, level, afterChange) {
  transformCurrentLineIn(textarea, (line) => {
    const raw = line.replace(/^\s{0,3}#{1,6}\s+/, "");
    return `${"#".repeat(level)} ${raw}`;
  }, afterChange);
}

function handleAutoListOnEnter(event) {
  if (event.key !== "Enter") return;
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  const textarea = event.currentTarget;
  if (!textarea || textarea.tagName !== "TEXTAREA") return;

  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  if (start !== end) return;

  const range = getCurrentLineRangeIn(textarea);
  const line = textarea.value.slice(range.start, range.end);

  const unordered = line.match(/^(\s*)([-*+])\s(.*)$/);
  if (unordered) {
    event.preventDefault();
    const indent = unordered[1] || "";
    const bullet = unordered[2] || "-";
    const content = unordered[3] || "";
    const insert = content.trim() ? `\n${indent}${bullet} ` : "\n";
    insertTextAtCursorIn(textarea, insert);
    runAfterTextareaChange(textarea);
    return;
  }

  const ordered = line.match(/^(\s*)(\d+)\.\s(.*)$/);
  if (ordered) {
    event.preventDefault();
    const indent = ordered[1] || "";
    const number = Number(ordered[2] || "1");
    const content = ordered[3] || "";
    const insert = content.trim() ? `\n${indent}${number + 1}. ` : "\n";
    insertTextAtCursorIn(textarea, insert);
    runAfterTextareaChange(textarea);
  }
}

function handleShortcuts(event) {
  const ctrl = event.ctrlKey || event.metaKey;
  if (!ctrl) return;
  const textarea = event.currentTarget;
  if (!textarea || textarea.tagName !== "TEXTAREA") return;

  const afterChange = () => {
    if (textarea === markdownInput) {
      autoResizeEditor();
      renderPreview();
      persistCurrentDoc();
      return;
    }
    if (textarea === outroEditor) {
      autoResizeTextarea(outroEditor);
      renderOutroPreview();
    }
  };

  const key = event.key.toLowerCase();
  const alt = event.altKey;
  const shift = event.shiftKey;

  if (!alt && key === "z") {
    event.preventDefault();
    if (shift) {
      redoTextarea(textarea);
    } else {
      undoTextarea(textarea);
    }
    return;
  }

  if (!alt && key === "y") {
    event.preventDefault();
    redoTextarea(textarea);
    return;
  }

  if (!alt && /^[1-6]$/.test(key)) {
    event.preventDefault();
    setCurrentLineHeadingIn(textarea, Number(key), afterChange);
    return;
  }

  if (!alt && key === "b") { event.preventDefault(); wrapCurrentParagraphIn(textarea, "**", "**", afterChange); return; }
  if (!alt && key === "i") { event.preventDefault(); wrapCurrentLineIn(textarea, "*", "*", afterChange); return; }
  if (!alt && key === "u") { event.preventDefault(); wrapCurrentLineIn(textarea, "<u>", "</u>", afterChange); return; }
  if (!alt && key === "e") { event.preventDefault(); wrapCurrentLineIn(textarea, "`", "`", afterChange); return; }
  if (!alt && key === "m") { event.preventDefault(); wrapCurrentLineIn(textarea, "$", "$", afterChange); return; }
  if (!alt && key === "k") { event.preventDefault(); wrapCurrentLineIn(textarea, "[", "](https://)", afterChange); return; }

  if (alt && key === "x") { event.preventDefault(); wrapCurrentLineIn(textarea, "~~", "~~", afterChange); return; }
  if (alt && key === "q") { event.preventDefault(); prefixCurrentLineIn(textarea, "> ", afterChange); return; }
  if (alt && key === "o") { event.preventDefault(); prefixCurrentLineIn(textarea, "1. ", afterChange); return; }
  if (alt && key === "u") { event.preventDefault(); prefixCurrentLineIn(textarea, "- ", afterChange); return; }
  if (alt && key === "e") { event.preventDefault(); wrapCurrentLineIn(textarea, "```text\n", "\n```", afterChange); return; }
  if (alt && key === "m") { event.preventDefault(); wrapCurrentLineIn(textarea, "$$\n", "\n$$", afterChange); return; }
  if (alt && key === "h") { event.preventDefault(); insertTextAtCursorIn(textarea, "\n\n---\n\n"); afterChange(); return; }
  if (alt && key === "l") {
    event.preventDefault();
    insertTextAtCursorIn(textarea, "\n\n[公众号主页名片](https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=你的biz号#wechat_redirect)\n\n");
    afterChange();
    return;
  }
  if (alt && key === "t") {
    event.preventDefault();
    insertTextAtCursorIn(textarea, "\n\n| 列1 | 列2 |\n| --- | --- |\n| 内容1 | 内容2 |\n\n");
    afterChange();
    return;
  }
  if (alt && key === "i") {
    event.preventDefault();
    insertTextAtCursorIn(textarea, "\n\n![图片描述](https://example.com/image.jpg \"图片注释\")\n\n");
    afterChange();
  }
}

function sanitizeImageName(name) {
  return (name || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, "_")
    .slice(0, 40) || "image";
}

function extractTitle(content, fallback = "未命名文章") {
  const firstLine = (content || "")
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0) || "";
  const clean = firstLine.replace(/^#{1,6}\s+/, "").replace(/[*_`~>\-\[\]()]/g, "").trim();
  return clean.slice(0, 26) || fallback;
}

function pad2(num) {
  return String(num).padStart(2, "0");
}

function formatDateZh(ts) {
  const d = new Date(ts || Date.now());
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return `${y}年${m}月${day}日 ${hh}:${mm}`;
}

function mapToObject(map) {
  const obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

function objectToMap(obj) {
  const map = new Map();
  if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      map.set(key, obj[key]);
    });
  }
  return map;
}

function getCurrentDoc() {
  return docs.find((doc) => doc.id === currentDocId) || null;
}

function persistAllDocs() {
  saveDocsToLocal();
  scheduleDocsSaveToServer();
}

function saveDocsToLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (_err) {}
}

function scheduleDocsSaveToServer() {
  if (docsSaveTimer) clearTimeout(docsSaveTimer);
  docsSaveTimer = setTimeout(() => {
    flushDocsSaveToServer();
  }, 300);
}

async function flushDocsSaveToServer() {
  if (docsSaveInFlight) {
    docsSaveQueued = true;
    return;
  }
  docsSaveInFlight = true;
  const snapshot = JSON.parse(JSON.stringify(docs));
  try {
    await saveDocsToServer(snapshot);
  } catch (err) {
    statusText.textContent = `保存失败：${err.message}`;
  } finally {
    docsSaveInFlight = false;
    if (docsSaveQueued) {
      docsSaveQueued = false;
      flushDocsSaveToServer();
    }
  }
}

async function saveDocsToServer(snapshotDocs = docs) {
  const resp = await fetch(`${API_BASE}/api/docs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docs: snapshotDocs }),
  });
  let data = {};
  try {
    data = await resp.json();
  } catch (_err) {}
  if (!resp.ok) {
    let message = "文件保存失败";
    message = data.error || message;
    throw new Error(message);
  }
  if (!docsSaveQueued && Array.isArray(data.docs)) {
    docs = normalizeDocs(data.docs);
    const current = getCurrentDoc();
    if (current) {
      imageStore.clear();
      objectToMap(current.images).forEach((value, key) => {
        imageStore.set(key, value);
      });
    }
    renderArticleList();
  }
}

async function exportCurrentDocToObsidian() {
  const doc = getCurrentDoc();
  if (!doc) {
    statusText.textContent = "没有可保存到 Obsidian 的文章";
    return;
  }

  persistCurrentDoc();
  if (exportObsidianBtn) exportObsidianBtn.disabled = true;
  statusText.textContent = "正在保存到 Obsidian...";

  try {
    const resp = await fetch(`${API_BASE}/api/obsidian/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: doc.title || "未命名文章",
        content: markdownInput.value || "",
        images: await materializeImageMapForServer(imageStore),
      }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || "保存到 Obsidian 失败");
    }
    const imageText = data.imageCount ? `，图片 ${data.imageCount} 张` : "";
    statusText.textContent = `已保存到 Obsidian：${data.filePath}${imageText}`;
  } catch (err) {
    statusText.textContent = `保存到 Obsidian 失败：${err.message}`;
    window.alert(`保存到 Obsidian 失败：${err.message}`);
  } finally {
    if (exportObsidianBtn) exportObsidianBtn.disabled = false;
  }
}

function persistCurrentDoc() {
  const doc = getCurrentDoc();
  if (!doc) return;
  doc.content = markdownInput.value;
  if (articleSubtitleInput) {
    doc.subtitle = articleSubtitleInput.value.trim();
  }
  doc.images = mapToObject(imageStore);
  doc.updatedAt = Date.now();
  if (!doc.manualTitle) {
    doc.title = extractTitle(doc.content, doc.title || "未命名文章");
  }
  persistAllDocs();
  renderArticleList();
  updateCurrentArticleMeta();
}

function renderArticleList() {
  if (!articleList) return;
  articleList.innerHTML = "";
  const query = (articleSearchInput?.value || "").trim().toLowerCase();
  const visibleDocs = query
    ? docs.filter((doc) => `${doc.title || ""} ${doc.subtitle || ""} ${doc.content || ""}`.toLowerCase().includes(query))
    : docs;
  if (!visibleDocs.length) {
    articleList.innerHTML = `<div class="topic-empty">没有找到匹配的文章。</div>`;
    updateArticleActions();
    return;
  }
  visibleDocs.forEach((doc) => {
    const btn = document.createElement("button");
    btn.className = `article-item${doc.id === currentDocId ? " active" : ""}`;
    const title = doc.title || "未命名文章";
    const date = formatDateZh(doc.createdAt);
    const count = `${String(doc.content || "").length} 字`;
    const state = doc.id === currentDocId ? "编辑中" : "草稿";
    btn.innerHTML = `
      <span class="article-item-title">${escapeHtml(title)}</span>
      <span class="article-meta">
        <span>${escapeHtml(date)}</span>
        <span>${escapeHtml(count)} · ${escapeHtml(state)}</span>
      </span>
    `;
    btn.title = `${title}（${date}）`;
    btn.addEventListener("click", () => switchDoc(doc.id));
    articleList.appendChild(btn);
  });
  updateArticleActions();
}

function updateCurrentArticleMeta() {
  const doc = getCurrentDoc();
  const title = doc?.title || "未命名文章";
  if (currentArticleTitle) currentArticleTitle.textContent = title;
  if (articleTitleInput && document.activeElement !== articleTitleInput) {
    articleTitleInput.value = title;
  }
  if (articleSubtitleInput && document.activeElement !== articleSubtitleInput) {
    articleSubtitleInput.value = doc?.subtitle || "";
  }
}

function updateArticleActions() {
  const hasCurrent = Boolean(getCurrentDoc());
  if (articleActions) {
    articleActions.style.visibility = hasCurrent ? "visible" : "hidden";
  }
  if (renameArticleBtn) renameArticleBtn.disabled = !hasCurrent;
  if (deleteArticleBtn) deleteArticleBtn.disabled = !hasCurrent;
}

function deleteDoc(id) {
  if (docs.length <= 1) {
    statusText.textContent = "至少保留一篇文章，不能全部删除";
    return;
  }
  const target = docs.find((doc) => doc.id === id);
  if (!target) return;
  const ok = window.confirm(`确定删除《${target.title || "未命名文章"}》吗？`);
  if (!ok) return;

  const idx = docs.findIndex((doc) => doc.id === id);
  docs.splice(idx, 1);

  if (currentDocId === id) {
    const fallback = docs[Math.max(0, idx - 1)] || docs[0];
    currentDocId = null;
    switchDoc(fallback.id);
  } else {
    persistAllDocs();
    renderArticleList();
  }
}

function switchDoc(id) {
  const current = getCurrentDoc();
  if (current && current.id !== id) {
    current.content = markdownInput.value;
    if (articleSubtitleInput) current.subtitle = articleSubtitleInput.value.trim();
    current.images = mapToObject(imageStore);
    current.updatedAt = Date.now();
    if (!current.manualTitle) {
      current.title = extractTitle(current.content, current.title || "未命名文章");
    }
  }

  const next = docs.find((doc) => doc.id === id);
  if (!next) return;

  currentDocId = id;
  imageStore.clear();
  objectToMap(next.images).forEach((value, key) => {
    imageStore.set(key, value);
  });
  markdownInput.value = next.content || "";
  if (articleTitleInput) articleTitleInput.value = next.title || "未命名文章";
  if (articleSubtitleInput) articleSubtitleInput.value = next.subtitle || "";
  autoResizeEditor();
  renderPreview();
  updateCurrentArticleMeta();
  resetTextareaHistory(markdownInput);
  renderArticleList();
  persistAllDocs();
}

function createDoc(initialContent = "") {
  const id = `doc_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const count = docs.length + 1;
  const rawTitle = window.prompt("请输入文章标题：", `新文章 ${count}`);
  if (rawTitle === null) return;
  const title = rawTitle.trim() || `新文章 ${count}`;
  const createdAt = Date.now();
  const doc = {
    id,
    title,
    subtitle: "",
    content: initialContent,
    images: {},
    createdAt,
    updatedAt: createdAt,
    manualTitle: true,
  };
  docs.unshift(doc);
  switchDoc(id);
}

function renameCurrentDoc() {
  const doc = getCurrentDoc();
  if (!doc) return;
  const raw = window.prompt("请输入新的文章标题：", doc.title || "未命名文章");
  if (raw === null) return;
  const next = raw.trim();
  if (!next) return;
  doc.title = next;
  doc.manualTitle = true;
  persistAllDocs();
  renderArticleList();
  updateCurrentArticleMeta();
}

function createImageToken() {
  const token = `image://img_${Date.now()}_${imageIdSeed}`;
  imageIdSeed += 1;
  return token;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

async function insertImages(files, options = {}) {
  const targetTextarea = options.targetTextarea || markdownInput;
  const targetStore = options.targetStore || imageStore;
  const afterInsert = typeof options.afterInsert === "function" ? options.afterInsert : null;
  const imageFiles = Array.from(files || []).filter((f) => f && f.type && f.type.startsWith("image/"));
  if (!imageFiles.length) {
    statusText.textContent = "没有检测到图片文件";
    return;
  }

  for (const file of imageFiles) {
    try {
      const dataUrl = await fileToDataUrl(file);
      const token = createImageToken();
      const storedUrl = await saveImageAssetToServer(token, dataUrl).catch(() => "");
      targetStore.set(token, storedUrl || dataUrl);
      insertTextAtCursorIn(targetTextarea, `\n\n![](${token})\n\n`);
    } catch (err) {
      statusText.textContent = `插入失败：${err.message}`;
    }
  }
  if (afterInsert) {
    afterInsert();
  } else {
    renderPreview();
  }
  statusText.textContent = `已插入 ${imageFiles.length} 张图片（已做短代码处理，不会卡编辑区）`;
  if (targetTextarea === markdownInput) {
    persistCurrentDoc();
  }
}

async function saveImageAssetToServer(token, dataUrl) {
  const resp = await fetch(`${API_BASE}/api/assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      data_url: dataUrl,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error || "图片保存失败");
  }
  return data.url || "";
}

function clipboardToImageFiles(event) {
  const items = event.clipboardData?.items;
  if (!items || !items.length) return [];
  const files = [];
  for (const item of items) {
    if (item.kind === "file" && item.type && item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }
  return files;
}

async function compactDataUrlImagesInMarkdown() {
  let changed = 0;
  const replacements = [];
  const nextValue = markdownInput.value.replace(/!\[([^\]]*)\]\((data:image\/[^)\s]+)(?:\s+"([^"]+)")?\)/g, (_, alt, dataUrl, caption) => {
    const token = createImageToken();
    imageStore.set(token, dataUrl);
    replacements.push({ token, dataUrl });
    changed += 1;
    return caption ? `![${alt}](${token} "${caption}")` : `![${alt}](${token})`;
  });

  if (changed > 0) {
    markdownInput.value = nextValue;
    for (const { token, dataUrl } of replacements) {
      const storedUrl = await saveImageAssetToServer(token, dataUrl).catch(() => "");
      if (storedUrl) imageStore.set(token, storedUrl);
    }
    statusText.textContent = `已自动压缩 ${changed} 处图片代码（避免编辑卡顿）`;
    persistCurrentDoc();
  }
}

async function copyHtml() {
  const html = markdownToStyledHtml(markdownInput.value);
  const plain = previewArea.innerText;

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(html);
    }
    statusText.textContent = "已复制整篇 HTML（含内联样式），可直接粘贴到公众号编辑器";
    copyBtn.textContent = "复制成功";
    setTimeout(() => {
      copyBtn.textContent = "复制整篇";
    }, 1200);
  } catch (err) {
    statusText.textContent = `复制失败：${err.message}`;
  }
}

function getPushSettings() {
  try {
    return JSON.parse(localStorage.getItem(PUSH_SETTINGS_KEY) || "{}");
  } catch (_err) {
    return {};
  }
}

function savePushSettings(settings) {
  localStorage.setItem(PUSH_SETTINGS_KEY, JSON.stringify(settings));
}

function getOutroTemplate() {
  const saved = localStorage.getItem(OUTRO_TEMPLATE_KEY);
  return (saved && saved.trim()) || DEFAULT_OUTRO_TEMPLATE;
}

function getOutroTemplateImages() {
  try {
    return JSON.parse(localStorage.getItem(OUTRO_TEMPLATE_IMAGES_KEY) || "{}");
  } catch (_err) {
    return {};
  }
}

function saveOutroTemplateImages() {
  localStorage.setItem(OUTRO_TEMPLATE_IMAGES_KEY, JSON.stringify(mapToObject(outroImageStore)));
}

function renderOutroPreview() {
  if (!outroPreview || !outroEditor) return;
  const html = markdownToStyledHtml(outroEditor.value || "");
  outroPreview.innerHTML = html;
}

function openOutroModal(mode = "edit") {
  if (!outroModal || !outroEditor) return;
  outroModalMode = mode;
  const savedImages = getOutroTemplateImages();
  outroImageStore.clear();
  objectToMap(savedImages).forEach((value, key) => {
    outroImageStore.set(key, value);
  });
  outroEditor.value = getOutroTemplate();
  autoResizeTextarea(outroEditor);
  renderOutroPreview();
  resetTextareaHistory(outroEditor);
  outroModal.classList.remove("hidden");
}

function closeOutroModal() {
  if (!outroModal) return;
  outroModal.classList.add("hidden");
}

function saveOutroTemplateContent() {
  if (!outroEditor) return "";
  const nextTemplate = (outroEditor.value || "").trim();
  const finalTemplate = nextTemplate || DEFAULT_OUTRO_TEMPLATE;
  localStorage.setItem(OUTRO_TEMPLATE_KEY, finalTemplate);
  saveOutroTemplateImages();
  return finalTemplate;
}

function attachOutroImagesToCurrentDoc(template) {
  const tokens = (template.match(/image:\/\/[a-zA-Z0-9_:-]+/g) || []);
  tokens.forEach((token) => {
    if (!imageStore.has(token) && outroImageStore.has(token)) {
      imageStore.set(token, outroImageStore.get(token));
    }
  });
}

function insertOutroTemplate(template) {
  const suffix = markdownInput.value.endsWith("\n") ? "" : "\n";
  markdownInput.value += `${suffix}\n${template}\n`;
  autoResizeEditor();
  renderPreview();
  persistCurrentDoc();
  statusText.textContent = "已插入结尾模板";
}

function stripMarkdown(text) {
  return (text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractWhitelistIp(source) {
  if (!source) return "";
  if (typeof source === "object" && source.whitelist_ip) {
    return String(source.whitelist_ip).trim();
  }
  const raw = typeof source === "string"
    ? source
    : String(source.error || source.message || source.errmsg || "");
  const match = raw.match(/(?:当前出口\s*IP|invalid ip)\s*([0-9]{1,3}(?:\.[0-9]{1,3}){3})/i)
    || raw.match(/\b([0-9]{1,3}(?:\.[0-9]{1,3}){3})\b/);
  if (!match) return "";
  const ip = match[1];
  const parts = ip.split(".").map(Number);
  return parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255) ? ip : "";
}

function getWhitelistIpFromError(err) {
  return String(err?.whitelistIp || extractWhitelistIp(err) || "").trim();
}

function setPushProgress(percent, text) {
  const nextPercent = Math.max(0, Math.min(100, Number(percent) || 0));
  if (pushProgress) pushProgress.classList.remove("hidden");
  if (pushProgressBar) pushProgressBar.style.width = `${nextPercent}%`;
  if (pushProgressText) pushProgressText.textContent = text;
  if (statusText) statusText.textContent = text;
}

function hidePushProgress(delay = 0) {
  window.setTimeout(() => {
    if (pushProgress) pushProgress.classList.add("hidden");
    if (pushProgressBar) pushProgressBar.style.width = "0%";
  }, delay);
}

function makeApiError(data, fallback) {
  const err = new Error(data?.error || fallback);
  const whitelistIp = extractWhitelistIp(data);
  if (whitelistIp) {
    err.whitelistIp = whitelistIp;
  }
  return err;
}

function showWhitelistModal(ip) {
  pendingWhitelistIp = String(ip || "").trim();
  if (!pendingWhitelistIp) return false;
  if (whitelistIpText) whitelistIpText.textContent = pendingWhitelistIp;
  if (whitelistModal) whitelistModal.classList.remove("hidden");
  statusText.textContent = `需要把 ${pendingWhitelistIp} 加到公众号 IP 白名单`;
  return true;
}

async function copyWhitelistIpAndOpenSettings() {
  if (!pendingWhitelistIp) return;
  const settingsWindow = window.open("about:blank", "_blank");
  if (settingsWindow) settingsWindow.opener = null;
  try {
    await navigator.clipboard.writeText(pendingWhitelistIp);
    if (whitelistModal) whitelistModal.classList.add("hidden");
    statusText.textContent = "已复制白名单 IP，正在打开微信设置页";
    if (settingsWindow) {
      settingsWindow.location.href = WECHAT_WHITELIST_URL;
    } else {
      window.open(WECHAT_WHITELIST_URL, "_blank", "noopener,noreferrer");
    }
  } catch (err) {
    if (settingsWindow) settingsWindow.close();
    statusText.textContent = `复制白名单 IP 失败：${err.message}`;
    window.alert(`复制失败，请手动复制：${pendingWhitelistIp}`);
  }
}

function closeWhitelistModal() {
  if (whitelistModal) whitelistModal.classList.add("hidden");
}

function coverPromptTextFromFields(fields) {
  const title = fields.title || "";
  const subtitle = fields.subtitle || "";
  const square = fields.square || "";
  return `{"title":"${title}"（要求文字在同一行）,"subtitle":"${subtitle}"（要求文字在同一行）,"square":"${square}"}`;
}

function coverTitleSubtitleTextFromFields(fields) {
  const title = fields.title || "";
  const subtitle = fields.subtitle || "";
  return `{"title":"${title}"（要求文字在同一行）,"subtitle":"${subtitle}"（要求文字在同一行）}`;
}

function parseCoverPromptFields(text) {
  const raw = (text || "").trim();
  if (!raw) return { ...DEFAULT_COVER_PROMPT_FIELDS };
  try {
    const parsed = JSON.parse(raw);
    return {
      title: parsed.title || DEFAULT_COVER_PROMPT_FIELDS.title,
      subtitle: parsed.subtitle || DEFAULT_COVER_PROMPT_FIELDS.subtitle,
      square: parsed.square || DEFAULT_COVER_PROMPT_FIELDS.square,
    };
  } catch (_err) {
    const pick = (key) => {
      const match = raw.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, "i"));
      return match ? match[1] : "";
    };
    return {
      title: pick("title") || DEFAULT_COVER_PROMPT_FIELDS.title,
      subtitle: pick("subtitle") || DEFAULT_COVER_PROMPT_FIELDS.subtitle,
      square: pick("square") || DEFAULT_COVER_PROMPT_FIELDS.square,
    };
  }
}

function getCoverPromptFields() {
  try {
    const value = localStorage.getItem(COVER_PROMPT_STATE_KEY);
    const trimmed = (value || "").trim();
    const legacyDefault = "{\"title\":\"本地部署真香\",\"subtitle\":\"大模型本地部署，从开始到放弃\",\"square\":\"Codex 手搓小工具\"}";
    if (!trimmed || trimmed === legacyDefault) {
      localStorage.setItem(COVER_PROMPT_STATE_KEY, JSON.stringify(DEFAULT_COVER_PROMPT_FIELDS));
      return { ...DEFAULT_COVER_PROMPT_FIELDS };
    }
    return parseCoverPromptFields(trimmed);
  } catch (_err) {
    return { ...DEFAULT_COVER_PROMPT_FIELDS };
  }
}

function getCurrentCoverPromptFields() {
  return {
    title: coverTitleInput ? coverTitleInput.value.trim() : "",
    subtitle: coverSubtitleInput ? coverSubtitleInput.value.trim() : "",
    square: coverSquareInput ? coverSquareInput.value.trim() : "",
  };
}

function saveCoverPromptFields() {
  localStorage.setItem(COVER_PROMPT_STATE_KEY, JSON.stringify(getCurrentCoverPromptFields()));
}

function initCoverPromptPanel() {
  if (!coverTitleInput || !coverSubtitleInput) return;
  const fields = getCoverPromptFields();
  coverTitleInput.value = fields.title || "";
  coverSubtitleInput.value = fields.subtitle || "";
  if (coverSquareInput) coverSquareInput.value = fields.square || "";
  [coverTitleInput, coverSubtitleInput, coverSquareInput].filter(Boolean).forEach((input) => {
    input.addEventListener("input", saveCoverPromptFields);
  });

  if (copyCoverPromptBtn) {
    copyCoverPromptBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(coverPromptTextFromFields(getCurrentCoverPromptFields()));
      window.open("https://gemini.google.com/gem/5f0c720750a9", "_blank", "noopener,noreferrer");
      statusText.textContent = "已复制封面三项，并打开 Gemini";
    });
  }

  if (copyCoverTitleSubtitleBtn) {
    copyCoverTitleSubtitleBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(coverTitleSubtitleTextFromFields(getCurrentCoverPromptFields()));
      window.open("https://chatgpt.com/g/g-p-69f227ade9bc81919161a9482fbb9340-wei-xin-gong-zhong-hao-tou-tu/project", "_blank", "noopener,noreferrer");
      statusText.textContent = "已复制标题和副标题，并打开 ChatGPT 封面项目";
    });
  }
}

function fileToDataUrlForUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("封面读取失败"));
    reader.readAsDataURL(file);
  });
}

function pickCoverImageFile() {
  return new Promise((resolve) => {
    if (!coverPicker) {
      resolve(null);
      return;
    }
    const onChange = () => {
      const file = coverPicker.files && coverPicker.files[0] ? coverPicker.files[0] : null;
      coverPicker.value = "";
      coverPicker.removeEventListener("change", onChange);
      resolve(file);
    };
    coverPicker.addEventListener("change", onChange, { once: true });
    coverPicker.click();
  });
}

async function uploadCoverToWeChat(file) {
  const dataUrl = await fileToDataUrlForUpload(file);
  const resp = await fetch(`${API_BASE}/api/wechat/cover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name || "cover.png",
      mime: file.type || "image/png",
      data_url: dataUrl,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw makeApiError(data, "封面上传失败");
  }
  return data;
}

function mimeFromDataUrl(dataUrl) {
  const m = /^data:([^;]+);base64,/.exec(dataUrl || "");
  return m ? m[1] : "image/png";
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(blob);
  });
}

async function imageValueToDataUrl(value) {
  const raw = String(value || "");
  if (!raw || raw.startsWith("data:image/")) return raw;
  if (/^https?:\/\/localhost:\d+\/image-assets\//.test(raw) || raw.startsWith("/image-assets/")) {
    const url = raw.startsWith("/") ? `${API_BASE}${raw}` : raw;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("本地图片读取失败");
    return blobToDataUrl(await resp.blob());
  }
  return raw;
}

async function materializeImageMapForServer(map) {
  const out = {};
  for (const [token, value] of map.entries()) {
    out[token] = await imageValueToDataUrl(value);
  }
  return out;
}

async function uploadArticleImageToWeChat({ filename, mime, dataUrl }) {
  const resp = await fetch(`${API_BASE}/api/wechat/article-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename,
      mime,
      data_url: dataUrl,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw makeApiError(data, "正文图片上传失败");
  }
  return data;
}

function countMarkdownImages(markdown) {
  return (String(markdown || "").match(/!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)(\{w:(?:30|50|70|100)\})?/g) || []).length;
}

async function replaceMarkdownImagesForWeChatPush(markdown, onProgress) {
  const imageRe = /!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)(\{w:(?:30|50|70|100)\})?/g;
  const uploadCache = new Map();
  const missingImages = [];
  const totalImages = countMarkdownImages(markdown);
  let out = "";
  let last = 0;
  let index = 0;
  let match;

  while ((match = imageRe.exec(markdown)) !== null) {
    out += markdown.slice(last, match.index);
    const alt = match[1] || "";
    const rawSrc = match[2] || "";
    const caption = match[3] || "";
    const widthSuffix = match[4] || "";

    let finalSrc = rawSrc;
    if (rawSrc.startsWith("image://")) {
      finalSrc = imageStore.get(rawSrc) || "";
      if (!finalSrc) {
        missingImages.push(index + 1);
        out += "";
        last = imageRe.lastIndex;
        index += 1;
        continue;
      }
      finalSrc = await imageValueToDataUrl(finalSrc);
    }

    if (/^data:image\/[^;]+;base64,/.test(finalSrc)) {
      let uploadedUrl = uploadCache.get(rawSrc) || "";
      if (!uploadedUrl) {
        onProgress?.(index + 1, totalImages);
        const uploaded = await uploadArticleImageToWeChat({
          filename: `article_${Date.now()}_${index + 1}.png`,
          mime: mimeFromDataUrl(finalSrc),
          dataUrl: finalSrc,
        });
        uploadedUrl = uploaded.url;
        uploadCache.set(rawSrc, uploadedUrl);
      }
      finalSrc = uploadedUrl;
    }

    const suffix = caption ? ` "${caption}"` : "";
    out += `![${alt}](${finalSrc}${suffix})${widthSuffix}`;
    last = imageRe.lastIndex;
    index += 1;
  }

  out += markdown.slice(last);
  return { markdown: out, missingImages };
}

async function pushToWeChatDraft() {
  const doc = getCurrentDoc();
  if (!doc) {
    statusText.textContent = "没有可推送的文章";
    return;
  }

  const title = doc.title || "未命名文章";
  const digest = stripMarkdown(markdownInput.value).slice(0, 120);
  let content = "";

  pushDraftBtn.disabled = true;
  setPushProgress(5, "第 1/5 步：选择封面图");

  const coverFile = await pickCoverImageFile();
  if (!coverFile) {
    setPushProgress(0, "已取消推送：未选择封面图");
    hidePushProgress(1200);
    pushDraftBtn.disabled = false;
    return;
  }

  let thumbMediaId = "";
  setPushProgress(18, "第 2/5 步：正在上传封面图");
  try {
    const coverResult = await uploadCoverToWeChat(coverFile);
    thumbMediaId = coverResult.media_id;
    setPushProgress(34, "封面上传完成");
  } catch (err) {
    if (showWhitelistModal(getWhitelistIpFromError(err))) {
      pushDraftBtn.disabled = false;
      return;
    }
    const msg = `封面上传失败：${err.message}`;
    setPushProgress(100, msg);
    window.alert(msg);
    hidePushProgress(2400);
    pushDraftBtn.disabled = false;
    return;
  }

  try {
    const totalImages = countMarkdownImages(markdownInput.value);
    setPushProgress(42, totalImages ? `第 3/5 步：准备上传正文图片（共 ${totalImages} 张）` : "第 3/5 步：正文没有待上传图片");
    const { markdown: markdownForPush, missingImages } = await replaceMarkdownImagesForWeChatPush(markdownInput.value, (index, total) => {
      const imagePercent = total ? (index / total) : 1;
      const percent = 42 + Math.round(imagePercent * 30);
      setPushProgress(percent, `第 3/5 步：正在上传正文图片 ${index}/${total}`);
    });
    content = markdownToStyledHtml(markdownForPush);
    const missingNote = missingImages.length
      ? `（已跳过丢失图片：第 ${missingImages.join("、")} 张）`
      : "";
    setPushProgress(76, "第 4/5 步：正文处理完成，正在创建微信草稿");

    const resp = await fetch(`${API_BASE}/api/wechat/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        digest,
        content,
        author: "TOMOAI",
        thumb_media_id: thumbMediaId,
        content_source_url: "",
      }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      if (showWhitelistModal(extractWhitelistIp(data))) {
        return;
      }
      const msg = `推送失败：${data.error || "未知错误"}`;
      setPushProgress(100, msg);
      window.alert(msg);
      hidePushProgress(2400);
      return;
    }
    setPushProgress(100, `第 5/5 步：推送成功，草稿 media_id：${data.media_id}${missingNote}`);
    window.alert(`推送成功，草稿 media_id：${data.media_id}${missingNote}`);
    hidePushProgress(3000);
  } catch (err) {
    if (showWhitelistModal(getWhitelistIpFromError(err))) {
      return;
    }
    const msg = `推送失败：${err.message}`;
    setPushProgress(100, msg);
    window.alert(msg);
    hidePushProgress(2400);
  } finally {
    pushDraftBtn.disabled = false;
  }
}

async function openImaApp() {
  try {
    const resp = await fetch(`${API_BASE}/api/local/open-ima`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || "打开 IMA 失败");
    }
    statusText.textContent = "已尝试打开 IMA";
  } catch (err) {
    statusText.textContent = `IMA 打开失败：${err.message}`;
    window.alert(`IMA 打开失败：${err.message}`);
  }
}

function normalizeTopics(rawTopics) {
  if (!Array.isArray(rawTopics)) return [];
  return rawTopics.map((topic, idx) => ({
    id: topic.id || `topic_legacy_${idx}`,
    title: String(topic.title || `未命名选题 ${idx + 1}`).trim(),
    recommendation: String(topic.recommendation || topic.reason || "").trim(),
    links: normalizeTopicLinks(topic.links || topic.clueLinks || topic.sources),
    done: Boolean(topic.done),
    createdAt: topic.createdAt || Date.now(),
    updatedAt: topic.updatedAt || topic.createdAt || Date.now(),
  }));
}

async function loadTopicsFromServer() {
  try {
    const resp = await fetch(`${API_BASE}/api/topics`);
    if (!resp.ok) return [];
    const data = await resp.json();
    return normalizeTopics(data.topics);
  } catch (_err) {
    return [];
  }
}

async function saveTopicsToServer() {
  try {
    await fetch(`${API_BASE}/api/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topics }),
    });
  } catch (err) {
    statusText.textContent = `选题库保存失败：${err.message}`;
  }
}

function queueTopicsSave() {
  if (topicsSaveTimer) clearTimeout(topicsSaveTimer);
  topicsSaveTimer = setTimeout(() => {
    saveTopicsToServer();
  }, 350);
}

function normalizeTopicLinks(rawLinks) {
  if (!Array.isArray(rawLinks)) return [];
  const seen = new Set();
  return rawLinks
    .map((link) => {
      if (typeof link === "string") {
        return { label: "", url: link.trim() };
      }
      return {
        label: String(link?.label || link?.title || "").trim(),
        url: String(link?.url || link?.href || "").trim(),
      };
    })
    .filter((link) => {
      if (!/^https?:\/\//i.test(link.url) || seen.has(link.url)) return false;
      seen.add(link.url);
      return true;
    });
}

function extractLinksFromText(text) {
  const matches = String(text || "").match(/https?:\/\/[^\s，。；、）)]+/g) || [];
  return normalizeTopicLinks(matches.map((url) => url.replace(/[.,;!?]+$/g, "")));
}

function getTopicLinks(topic) {
  const merged = [...normalizeTopicLinks(topic.links), ...extractLinksFromText(topic.recommendation)];
  return normalizeTopicLinks(merged);
}

function topicLinkLabel(link, index) {
  if (link.label) return link.label;
  try {
    const url = new URL(link.url);
    return `线索 ${index + 1}：${url.hostname.replace(/^www\./, "")}`;
  } catch (_err) {
    return `线索 ${index + 1}`;
  }
}

function renderTopicLinks(topic) {
  const links = getTopicLinks(topic);
  if (!links.length) return "";
  return `
    <div class="topic-links" aria-label="选题线索">
      <span class="topic-links-label">线索</span>
      ${links.map((link, index) => `
        <a class="topic-source-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(topicLinkLabel(link, index))}</a>
      `).join("")}
    </div>
  `;
}

function updateTopicBulkControls(todoTopics) {
  const todoIds = new Set(todoTopics.map((topic) => topic.id));
  selectedTodoTopicIds = new Set([...selectedTodoTopicIds].filter((id) => todoIds.has(id)));
  const selectedCount = selectedTodoTopicIds.size;
  if (deleteSelectedTopicsBtn) {
    deleteSelectedTopicsBtn.disabled = selectedCount === 0;
    deleteSelectedTopicsBtn.textContent = selectedCount ? `删除选中（${selectedCount}）` : "删除选中";
  }
  if (selectAllTodoTopics) {
    selectAllTodoTopics.checked = todoTopics.length > 0 && selectedCount === todoTopics.length;
    selectAllTodoTopics.indeterminate = selectedCount > 0 && selectedCount < todoTopics.length;
    selectAllTodoTopics.disabled = todoTopics.length === 0;
  }
}

function renderTopics() {
  const renderList = (target, list, emptyText, mode = "all") => {
    if (!target) return;
    if (!list.length) {
      target.innerHTML = `<div class="topic-empty">${emptyText}</div>`;
      return;
    }
    const isTodo = mode === "todo";
    const isDone = mode === "done";
    target.innerHTML = list.map((topic) => `
      <div class="topic-item ${topic.done ? "done" : ""} ${isTodo ? "topic-item-todo" : ""}" data-topic-id="${escapeHtml(topic.id)}">
        ${isTodo
          ? `<input class="topic-select" type="checkbox" ${selectedTodoTopicIds.has(topic.id) ? "checked" : ""} aria-label="选择删除" />`
          : `<input class="topic-check" type="checkbox" ${topic.done ? "checked" : ""} aria-label="${isDone ? "取消确定要写" : "标记完成"}" />`
        }
        <div class="topic-edit-fields">
          <input class="topic-title-input" data-topic-field="title" value="${escapeHtml(topic.title)}" placeholder="选题标题" />
          <textarea class="topic-recommendation-input" data-topic-field="recommendation" rows="7" placeholder="用 Markdown 写清楚：类型、商单潜力、切口、读者能带走什么">${escapeHtml(topic.recommendation || "")}</textarea>
          ${renderTopicLinks(topic)}
        </div>
        ${isTodo ? `<button class="topic-mark-btn" type="button" data-topic-action="mark-done">确定写</button>` : ""}
        <button class="topic-delete-btn" type="button" data-topic-action="delete">删除</button>
      </div>
    `).join("");
  };

  if (!topics.length) {
    renderList(topicList, [], "暂无选题。之后可以让我用 CLI 加进去。");
    renderList(topicTodoList, [], "暂无未写选题。");
    renderList(topicDoneList, [], "暂无确定要写的选题。");
    updateTopicBulkControls([]);
    return;
  }

  const todoTopics = topics.filter((topic) => !topic.done);
  const doneTopics = topics.filter((topic) => topic.done);
  renderList(topicList, topics, "暂无选题。之后可以让我用 CLI 加进去。");
  renderList(topicTodoList, todoTopics, "暂无未写选题。", "todo");
  renderList(topicDoneList, doneTopics, "暂无确定要写的选题。", "done");
  updateTopicBulkControls(todoTopics);
}

function createTopicId() {
  return `topic_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

async function addTopicFromForm() {
  const title = (topicTitleInput?.value || "").trim();
  const recommendation = (topicRecommendationInput?.value || "").trim();
  if (!title) {
    statusText.textContent = "先输入选题标题";
    topicTitleInput?.focus();
    return;
  }
  const now = Date.now();
  topics.unshift({
    id: createTopicId(),
    title,
    recommendation,
    done: false,
    createdAt: now,
    updatedAt: now,
  });
  if (topicTitleInput) topicTitleInput.value = "";
  if (topicRecommendationInput) topicRecommendationInput.value = "";
  renderTopics();
  await saveTopicsToServer();
  statusText.textContent = "已加入选题";
}

function updateTopicField(topicId, field, value) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic || !["title", "recommendation"].includes(field)) return;
  topic[field] = String(value || "").trim();
  topic.updatedAt = Date.now();
  queueTopicsSave();
}

async function deleteTopic(topicId) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) return;
  const ok = window.confirm(`确定删除选题《${topic.title || "未命名选题"}》吗？`);
  if (!ok) return;
  selectedTodoTopicIds.delete(topicId);
  topics = topics.filter((item) => item.id !== topicId);
  renderTopics();
  await saveTopicsToServer();
  statusText.textContent = "已删除选题";
}

async function deleteSelectedTodoTopics() {
  const selectedIds = new Set([...selectedTodoTopicIds].filter((id) => topics.some((topic) => topic.id === id && !topic.done)));
  if (!selectedIds.size) return;
  const ok = window.confirm(`确定删除选中的 ${selectedIds.size} 个未写选题吗？`);
  if (!ok) return;
  topics = topics.filter((topic) => !selectedIds.has(topic.id));
  selectedTodoTopicIds.clear();
  renderTopics();
  await saveTopicsToServer();
  statusText.textContent = `已删除 ${selectedIds.size} 个选题`;
}

function openTopicModal() {
  if (!topicModal) return;
  renderTopics();
  topicModal.classList.remove("hidden");
}

function closeTopicModal() {
  if (!topicModal) return;
  topicModal.classList.add("hidden");
}

function handleTopicListChange(event) {
  const item = event.target.closest(".topic-item");
  if (!item || event.target.type !== "checkbox") return;
  if (event.target.classList.contains("topic-select")) {
    if (event.target.checked) {
      selectedTodoTopicIds.add(item.dataset.topicId);
    } else {
      selectedTodoTopicIds.delete(item.dataset.topicId);
    }
    updateTopicBulkControls(topics.filter((topic) => !topic.done));
    return;
  }
  toggleTopic(item.dataset.topicId, event.target.checked);
}

function handleTopicListInput(event) {
  const field = event.target.dataset.topicField;
  const item = event.target.closest(".topic-item");
  if (!field || !item) return;
  updateTopicField(item.dataset.topicId, field, event.target.value);
  if (field === "recommendation") {
    const topic = topics.find((entry) => entry.id === item.dataset.topicId);
    const oldLinks = item.querySelector(".topic-links");
    const nextLinks = renderTopicLinks(topic);
    if (oldLinks) oldLinks.remove();
    if (nextLinks) {
      event.target.insertAdjacentHTML("afterend", nextLinks);
    }
  }
}

function handleTopicListClick(event) {
  const button = event.target.closest("[data-topic-action]");
  const item = event.target.closest(".topic-item");
  if (!button || !item) return;
  const action = button.dataset.topicAction;
  if (action === "delete") {
    deleteTopic(item.dataset.topicId);
    return;
  }
  if (action === "mark-done") {
    toggleTopic(item.dataset.topicId, true);
  }
}

async function toggleTopic(topicId, done) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) return;
  topic.done = done;
  topic.updatedAt = Date.now();
  selectedTodoTopicIds.delete(topicId);
  renderTopics();
  await saveTopicsToServer();
  statusText.textContent = done ? "已加入确定要写" : "已移回未写选题";
}

async function initTopics() {
  topics = await loadTopicsFromServer();
  topics.sort((a, b) => Number(a.done) - Number(b.done) || (b.updatedAt || 0) - (a.updatedAt || 0));
  renderTopics();
}

function normalizeDocs(rawDocs) {
  if (!Array.isArray(rawDocs)) return [];
  return rawDocs.map((doc, idx) => ({
    id: doc.id || `doc_legacy_${idx}`,
    title: doc.title || `未命名文章 ${idx + 1}`,
    subtitle: doc.subtitle || "",
    content: doc.content || "",
    images: doc.images || {},
    createdAt: doc.createdAt || Date.now(),
    updatedAt: doc.updatedAt || doc.createdAt || Date.now(),
    manualTitle: Boolean(doc.manualTitle),
  }));
}

function mergeDocsByFreshness(serverDocs, localDocs) {
  const byId = new Map();
  [...serverDocs, ...localDocs].forEach((doc) => {
    const current = byId.get(doc.id);
    const nextTime = doc.updatedAt || doc.createdAt || 0;
    const currentTime = current ? (current.updatedAt || current.createdAt || 0) : -1;
    if (!current || nextTime >= currentTime) {
      byId.set(doc.id, doc);
    }
  });
  return Array.from(byId.values());
}

function loadDocsFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeDocs(JSON.parse(raw));
  } catch (_err) {
    return [];
  }
}

async function loadDocsFromServer() {
  try {
    const resp = await fetch(`${API_BASE}/api/docs`);
    if (!resp.ok) return [];
    const data = await resp.json();
    return normalizeDocs(data.docs);
  } catch (_err) {
    return [];
  }
}

async function initDocs() {
  const serverDocs = await loadDocsFromServer();
  const localDocs = loadDocsFromLocal();
  docs = serverDocs.length > 0 ? mergeDocsByFreshness(serverDocs, localDocs) : localDocs;

  if (docs.length === 0) {
    const createdAt = Date.now();
    docs = [{
      id: `doc_${createdAt}_1`,
      title: "未命名文章 1",
      subtitle: "",
      content: defaultMd,
      images: {},
      createdAt,
      updatedAt: createdAt,
      manualTitle: false,
    }];
  }

  docs.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

  currentDocId = docs[0].id;
  switchDoc(currentDocId);
  await compactDataUrlImagesInMarkdown();
  autoResizeEditor();
  renderPreview();
  persistCurrentDoc();
}

initDocs();
initTopics();
initCoverPromptPanel();

markdownInput.addEventListener("input", () => {
  autoResizeEditor();
  renderPreview();
  persistCurrentDoc();
  recordTextareaHistory(markdownInput);
});

if (previewArea) {
  previewArea.addEventListener("click", handlePreviewSourceClick);
}

if (articleSearchInput) {
  articleSearchInput.addEventListener("input", renderArticleList);
}

if (articleTitleInput) {
  articleTitleInput.addEventListener("input", () => {
    const doc = getCurrentDoc();
    if (!doc) return;
    doc.title = articleTitleInput.value.trim() || "未命名文章";
    doc.manualTitle = true;
    doc.updatedAt = Date.now();
    persistAllDocs();
    renderArticleList();
    updateCurrentArticleMeta();
  });
}

if (articleSubtitleInput) {
  articleSubtitleInput.addEventListener("input", () => {
    const doc = getCurrentDoc();
    if (!doc) return;
    doc.subtitle = articleSubtitleInput.value.trim();
    doc.updatedAt = Date.now();
    persistAllDocs();
    renderArticleList();
  });
}

if (convertBtn) {
  convertBtn.addEventListener("click", () => {
    renderPreview();
    persistCurrentDoc();
  });
}

copyBtn.addEventListener("click", copyHtml);
pushDraftBtn.addEventListener("click", pushToWeChatDraft);
if (exportObsidianBtn) {
  exportObsidianBtn.addEventListener("click", exportCurrentDocToObsidian);
}
if (openImaBtn) {
  openImaBtn.addEventListener("click", openImaApp);
}
if (openTopicLibraryBtn) {
  openTopicLibraryBtn.addEventListener("click", openTopicModal);
}
if (addTopicBtn) {
  addTopicBtn.addEventListener("click", addTopicFromForm);
}
if (topicTitleInput) {
  topicTitleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTopicFromForm();
  });
}
if (topicRecommendationInput) {
  topicRecommendationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) addTopicFromForm();
  });
}
if (topicList) {
  topicList.addEventListener("change", handleTopicListChange);
  topicList.addEventListener("input", handleTopicListInput);
  topicList.addEventListener("click", handleTopicListClick);
}
if (topicTodoList) {
  topicTodoList.addEventListener("change", handleTopicListChange);
  topicTodoList.addEventListener("input", handleTopicListInput);
  topicTodoList.addEventListener("click", handleTopicListClick);
}
if (topicDoneList) {
  topicDoneList.addEventListener("change", handleTopicListChange);
  topicDoneList.addEventListener("input", handleTopicListInput);
  topicDoneList.addEventListener("click", handleTopicListClick);
}
if (selectAllTodoTopics) {
  selectAllTodoTopics.addEventListener("change", () => {
    const todoIds = topics.filter((topic) => !topic.done).map((topic) => topic.id);
    selectedTodoTopicIds = selectAllTodoTopics.checked ? new Set(todoIds) : new Set();
    renderTopics();
  });
}
if (deleteSelectedTopicsBtn) {
  deleteSelectedTopicsBtn.addEventListener("click", deleteSelectedTodoTopics);
}
if (closeTopicModalBtn) {
  closeTopicModalBtn.addEventListener("click", closeTopicModal);
}
if (topicModal) {
  topicModal.addEventListener("click", (event) => {
    if (event.target === topicModal) closeTopicModal();
  });
}
if (copyWhitelistIpBtn) {
  copyWhitelistIpBtn.addEventListener("click", copyWhitelistIpAndOpenSettings);
}
if (closeWhitelistModalBtn) {
  closeWhitelistModalBtn.addEventListener("click", closeWhitelistModal);
}
if (whitelistModal) {
  whitelistModal.addEventListener("click", (event) => {
    if (event.target === whitelistModal) closeWhitelistModal();
  });
}
if (insertOutroBtn) {
  insertOutroBtn.addEventListener("click", () => {
    const template = getOutroTemplate();
    const savedImages = getOutroTemplateImages();
    outroImageStore.clear();
    objectToMap(savedImages).forEach((value, key) => {
      outroImageStore.set(key, value);
    });
    attachOutroImagesToCurrentDoc(template);
    insertOutroTemplate(template);
  });
}
if (editOutroBtn) {
  editOutroBtn.addEventListener("click", () => openOutroModal("edit"));
}

newArticleBtn.addEventListener("click", () => {
  createDoc("**你好啊，这里是智井。**\n\n# 写在最后\n\n");
  persistCurrentDoc();
});

renameArticleBtn.addEventListener("click", () => {
  renameCurrentDoc();
});

deleteArticleBtn.addEventListener("click", () => {
  if (currentDocId) deleteDoc(currentDocId);
});

if (insertImageBtn) {
  insertImageBtn.addEventListener("click", () => {
    imagePicker.click();
  });
}

if (autoMarkdownBtn) {
  autoMarkdownBtn.addEventListener("click", autoMarkdownizeEditor);
}
if (openAiProviderBtn) {
  openAiProviderBtn.addEventListener("click", openAiProviderModal);
}
if (closeAiProviderBtn) {
  closeAiProviderBtn.addEventListener("click", closeAiProviderModal);
}
if (aiProviderModal) {
  aiProviderModal.addEventListener("click", (event) => {
    if (event.target === aiProviderModal) closeAiProviderModal();
  });
}
if (aiProviderForm) {
  aiProviderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (aiProviderSummary) aiProviderSummary.textContent = "正在保存 API 配置...";
    try {
      await saveAiProviderConfig();
      if (aiProviderSummary) aiProviderSummary.textContent = "已保存。整理 Markdown 会优先调用这个中转站。";
      statusText.textContent = "API 设置已保存";
    } catch (err) {
      if (aiProviderSummary) aiProviderSummary.textContent = err.message;
      statusText.textContent = `API 设置保存失败：${err.message}`;
    }
  });
}
if (testAiProviderBtn) {
  testAiProviderBtn.addEventListener("click", async () => {
    testAiProviderBtn.disabled = true;
    if (aiProviderSummary) aiProviderSummary.textContent = "正在保存并测试连接...";
    try {
      await saveAiProviderConfig();
      const resp = await fetch(`${API_BASE}/api/ai-providers/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.ok) throw new Error(data.error || "测试连接失败");
      setAiProviderInfo(data.provider, null);
      if (aiProviderSummary) aiProviderSummary.textContent = `连接成功：${data.provider?.model || "AI Provider"}`;
      statusText.textContent = "API 连接测试成功";
    } catch (err) {
      if (aiProviderSummary) aiProviderSummary.textContent = err.message;
      statusText.textContent = `API 连接测试失败：${err.message}`;
    } finally {
      testAiProviderBtn.disabled = false;
    }
  });
}
if (clearFormattingBtn) {
  clearFormattingBtn.addEventListener("click", () => {
    markdownInput.value = stripMarkdownFormatting(markdownInput.value);
    runAfterTextareaChange(markdownInput);
    statusText.textContent = "已清空 Markdown 格式";
  });
}
if (openTableBuilderBtn) {
  openTableBuilderBtn.addEventListener("click", openTableBuilder);
}
if (tableRefreshBtn) {
  tableRefreshBtn.addEventListener("click", renderTableBuilderGrid);
}
if (tableColCount) {
  tableColCount.addEventListener("change", renderTableBuilderGrid);
}
if (tableRowCount) {
  tableRowCount.addEventListener("change", renderTableBuilderGrid);
}
if (tableCancelBtn) {
  tableCancelBtn.addEventListener("click", closeTableBuilder);
}
if (tableInsertBtn) {
  tableInsertBtn.addEventListener("click", insertBuiltTable);
}
if (tableBuilderModal) {
  tableBuilderModal.addEventListener("click", (event) => {
    if (event.target === tableBuilderModal) {
      closeTableBuilder();
    }
  });
}

imagePicker.addEventListener("change", async (event) => {
  await insertImages(event.target.files);
  imagePicker.value = "";
});

markdownInput.addEventListener("dragover", (event) => {
  event.preventDefault();
});

markdownInput.addEventListener("drop", async (event) => {
  event.preventDefault();
  await insertImages(event.dataTransfer.files);
});

markdownInput.addEventListener("paste", async (event) => {
  const imageFiles = clipboardToImageFiles(event);
  if (imageFiles.length) {
    event.preventDefault();
    await insertImages(imageFiles);
    statusText.textContent = `已从剪贴板粘贴 ${imageFiles.length} 张图片`;
    return;
  }
  handleMarkdownTextPaste(event, markdownInput);
});

markdownInput.addEventListener("keydown", handleShortcuts);
markdownInput.addEventListener("keydown", handleAutoListOnEnter);
bindSelectionToolbarToTextarea(markdownInput);

if (outroEditor) {
  outroEditor.addEventListener("input", () => {
    autoResizeTextarea(outroEditor);
    renderOutroPreview();
    recordTextareaHistory(outroEditor);
  });
  outroEditor.addEventListener("keydown", handleShortcuts);
  outroEditor.addEventListener("keydown", handleAutoListOnEnter);
  bindSelectionToolbarToTextarea(outroEditor);
  outroEditor.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  outroEditor.addEventListener("drop", async (event) => {
    event.preventDefault();
    await insertImages(event.dataTransfer.files, {
      targetTextarea: outroEditor,
      targetStore: outroImageStore,
      afterInsert: () => {
        autoResizeTextarea(outroEditor);
        renderOutroPreview();
      },
    });
  });
  outroEditor.addEventListener("paste", async (event) => {
    const imageFiles = clipboardToImageFiles(event);
    if (imageFiles.length) {
      event.preventDefault();
      await insertImages(imageFiles, {
        targetTextarea: outroEditor,
        targetStore: outroImageStore,
        afterInsert: () => {
          autoResizeTextarea(outroEditor);
          renderOutroPreview();
        },
      });
      statusText.textContent = `结尾模板已粘贴 ${imageFiles.length} 张图片`;
      return;
    }
    handleMarkdownTextPaste(event, outroEditor);
  });
}

if (selectionToolbar) {
  selectionToolbar.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  selectionToolbar.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    applySelectionAction(activeToolbarTextarea, btn.dataset.action);
    hideSelectionToolbar();
  });
}

document.addEventListener("pointerdown", (event) => {
  if (!selectionToolbar || selectionToolbar.classList.contains("hidden")) return;
  if (selectionToolbar.contains(event.target) || event.target === activeToolbarTextarea) return;
  hideSelectionToolbar();
});

document.addEventListener("selectionchange", () => {
  if (document.activeElement === activeToolbarTextarea) {
    updateSelectionToolbarFor(activeToolbarTextarea);
  } else {
    hideSelectionToolbar();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideSelectionToolbar();
});

document.addEventListener("scroll", () => {
  if (activeToolbarTextarea) {
    updateSelectionToolbarFor(activeToolbarTextarea);
  }
}, true);

if (imgSize30) {
  imgSize30.addEventListener("click", () => applyImageResize(30));
}
if (imgSize50) {
  imgSize50.addEventListener("click", () => applyImageResize(50));
}
if (imgSize70) {
  imgSize70.addEventListener("click", () => applyImageResize(70));
}
if (imgSize100) {
  imgSize100.addEventListener("click", () => applyImageResize(100));
}
if (imgRow) {
  imgRow.addEventListener("click", arrangeSelectedImagesInRow);
}
if (imgCut) {
  imgCut.addEventListener("click", cutSelectedImageMarkdown);
}
if (imgDelete) {
  imgDelete.addEventListener("click", deleteSelectedImageMarkdown);
}
if (imgSizeCancel) {
  imgSizeCancel.addEventListener("click", closeImageResizeModal);
}
if (imageResizeModal) {
  imageResizeModal.addEventListener("click", (event) => {
    if (event.target === imageResizeModal) {
      closeImageResizeModal();
    }
  });
}

if (outroInsertImageBtn && outroImagePicker) {
  outroInsertImageBtn.addEventListener("click", () => {
    outroImagePicker.click();
  });
  outroImagePicker.addEventListener("change", async (event) => {
    await insertImages(event.target.files, {
      targetTextarea: outroEditor,
      targetStore: outroImageStore,
      afterInsert: () => {
        autoResizeTextarea(outroEditor);
        renderOutroPreview();
      },
    });
    outroImagePicker.value = "";
  });
}

if (outroSaveBtn) {
  outroSaveBtn.addEventListener("click", () => {
    saveOutroTemplateContent();
    statusText.textContent = "结尾模板已保存";
    closeOutroModal();
  });
}

if (outroSaveInsertBtn) {
  outroSaveInsertBtn.addEventListener("click", () => {
    const template = saveOutroTemplateContent();
    attachOutroImagesToCurrentDoc(template);
    insertOutroTemplate(template);
    closeOutroModal();
  });
}

if (outroCancelBtn) {
  outroCancelBtn.addEventListener("click", () => {
    closeOutroModal();
  });
}

if (outroModal) {
  outroModal.addEventListener("click", (event) => {
    if (event.target === outroModal) {
      closeOutroModal();
    }
  });
}
