const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PROFILE_DIR = path.join(ROOT, "data", "wechat-chrome-profile");
const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((item) => item.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function findChrome() {
  const found = CHROME_PATHS.find((item) => item && fs.existsSync(item));
  if (!found) throw new Error("没有找到 Chrome 或 Edge，无法启动公众号后台采集器。");
  return found;
}

async function getJson(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`CDP 请求失败：${resp.status}`);
  return resp.json();
}

async function waitForCdp(port) {
  for (let i = 0; i < 80; i += 1) {
    try {
      return await getJson(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome 调试端口没有启动成功。");
}

async function openTab(port, url) {
  const existing = await getJson(`http://127.0.0.1:${port}/json/list`).catch(() => []);
  const loggedIn = existing.find((item) => item.type === "page" && /mp\.weixin\.qq\.com/.test(item.url || "") && /[?&]token=\d+/.test(item.url || ""));
  if (loggedIn) return loggedIn;
  try {
    const resp = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
    if (resp.ok) return resp.json();
  } catch {}
  const list = existing.length ? existing : await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = list.find((item) => item.type === "page");
  if (!page) throw new Error("没有找到可用的 Chrome 页面。");
  return page;
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (!data.id || !pending.has(data.id)) return;
    const { resolve, reject } = pending.get(data.id);
    pending.delete(data.id);
    if (data.error) reject(new Error(data.error.message || "CDP 调用失败"));
    else resolve(data.result);
  });
  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const callId = ++id;
          ws.send(JSON.stringify({ id: callId, method, params }));
          return new Promise((callResolve, callReject) => {
            pending.set(callId, { resolve: callResolve, reject: callReject });
            setTimeout(() => {
              if (!pending.has(callId)) return;
              pending.delete(callId);
              callReject(new Error(`CDP 调用超时：${method}`));
            }, 30000);
          });
        },
        close() {
          try { ws.close(); } catch {}
        }
      });
    });
    ws.addEventListener("error", () => reject(new Error("无法连接 Chrome 调试端口。")));
  });
}

async function evaluate(client, expression, timeout = 30000) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    timeout
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "页面脚本执行失败");
  }
  return result.result?.value;
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
}

async function waitForToken(client, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const info = await evaluate(client, `({ href: location.href, title: document.title, text: document.body.innerText.slice(0, 1000) })`);
    const token = String(info.href || "").match(/[?&]token=(\d+)/)?.[1] || "";
    if (token) return token;
    await sleep(1500);
  }
  throw new Error("等待公众号后台登录超时。请在弹出的 Chrome 窗口扫码登录后重试。");
}

async function waitForPublishRows(client, timeoutMs, begin = null) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const info = await evaluate(client, `({
      href: location.href,
      count: document.querySelectorAll('.publish_hover_content').length
    })`);
    const expectedBegin = begin == null || String(info.href || "").includes(`begin=${begin}`);
    if (expectedBegin && Number(info.count) > 0) return Number(info.count);
    await sleep(1000);
  }
  throw new Error("已登录，但没有读取到发表记录列表。请确认账号有发表记录权限。");
}

function scrapeVisibleExpression(today) {
  return `(${async function ({ today, pages }) {
    const clean = (s) => String(s || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    const num = (s) => Number(String(s || "").replace(/,/g, "").match(/\d+/)?.[0] || 0);
    const pad = (n) => String(n).padStart(2, "0");
    const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const parseDateLabel = (label) => {
      const base = new Date(`${today}T12:00:00+08:00`);
      if (/昨天/.test(label)) {
        base.setDate(base.getDate() - 1);
        return formatDate(base);
      }
      const weekMap = { "星期日": 0, "星期一": 1, "星期二": 2, "星期三": 3, "星期四": 4, "星期五": 5, "星期六": 6 };
      const week = Object.keys(weekMap).find((key) => label.includes(key));
      if (week) {
        let diff = base.getDay() - weekMap[week];
        if (diff <= 0) diff += 7;
        base.setDate(base.getDate() - diff);
        return formatDate(base);
      }
      const md = label.match(/(\d{1,2})月(\d{1,2})日/);
      if (md) return `${base.getFullYear()}-${pad(md[1])}-${pad(md[2])}`;
      return label;
    };
    return Array.from(document.querySelectorAll(".publish_hover_content")).map((row) => {
      const link = row.querySelector(".weui-desktop-mass-appmsg__title");
      const sendHref = row.querySelector('a[href*="send_time="]')?.href || "";
      const sendTime = sendHref.match(/[?&]send_time=(\d+)/)?.[1] || "";
      const dateLabel = clean(row.querySelector(".weui-desktop-mass__time")?.textContent || row.querySelector("em")?.textContent || "");
      const metric = (cls) => num(row.querySelector(cls)?.textContent);
      const title = clean(link?.textContent || "")
        .replace(/\s+原创.*$/, "")
        .replace(/\s+已修改.*$/, "")
        .trim();
      return {
        date: sendTime ? formatDate(new Date(Number(sendTime) * 1000)) : parseDateLabel(dateLabel),
        title,
        views: metric(".appmsg-view"),
        likes: metric(".appmsg-like"),
        favorites: metric(".appmsg-haokan"),
        shares: metric(".appmsg-share"),
        comments: metric(".appmsg-comment"),
        url: link?.href || ""
      };
    }).filter((item) => item.title);
  }.toString()})(${JSON.stringify({ today, pages: 1 })})`;
}

async function main() {
  const port = Number(arg("port", "9322"));
  const pages = Number(arg("pages", "12"));
  const timeoutMs = Number(arg("timeout", "180000"));
  const today = arg("today", new Date().toISOString().slice(0, 10));
  let client = null;
  fs.mkdirSync(PROFILE_DIR, { recursive: true });

  const chrome = spawn(findChrome(), [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${PROFILE_DIR}`,
    "--no-first-run",
    "--no-default-browser-check",
    "https://mp.weixin.qq.com/"
  ], { detached: true, stdio: "ignore" });
  chrome.unref();

  await waitForCdp(port);
  const tab = await openTab(port, "https://mp.weixin.qq.com/");
  try {
    client = await connect(tab.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    const token = await waitForToken(client, timeoutMs);
    const records = [];
    const seen = new Set();
    for (let page = 0; page < pages; page += 1) {
      const begin = page * 10;
      await navigate(client, `https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=${begin}&count=10&token=${token}&lang=zh_CN`);
      const rowCount = await waitForPublishRows(client, 60000, begin);
      const rows = await evaluate(client, scrapeVisibleExpression(today), 30000);
      for (const row of rows) {
        const key = `${row.date}|${row.title}|${row.url}`;
        if (seen.has(key)) continue;
        seen.add(key);
        records.push(row);
      }
      if (rowCount < 10 || rows.length < 10) break;
      await sleep(500);
    }
    process.stdout.write(JSON.stringify({ ok: true, records }, null, 2));
  } finally {
    if (client) client.close();
  }
}

main().catch((err) => {
  process.stdout.write(JSON.stringify({ ok: false, error: err.message || String(err) }, null, 2), () => {
    process.exit(1);
  });
});
