const http = require("http");

function request(path, method = "GET", body = null) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: process.env.PORT || 8788,
        path,
        method,
        headers: payload
          ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
          : {}
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 400) return reject(new Error(`${method} ${path} -> ${res.statusCode}: ${data}`));
          resolve(data);
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const workspace = JSON.parse(await request("/api/workspace"));
  if (!workspace.workspace) throw new Error("workspace missing");
  const providers = JSON.parse(await request("/api/ai-providers"));
  if (providers.provider && providers.provider.apiKey) throw new Error("apiKey leaked");
  const profile = JSON.parse(
    await request("/api/ai/profile-account", "POST", {
      input: {
        name: "Smoke Test",
        background: "内容运营",
        resources: "能测试 AI 工具",
        contentAbility: "能写实操教程",
        targetReaders: "想用 AI 提效的职场人",
        toolCategories: "AI 办公, AI 写作",
        sustainableTopics: "工具测评"
      }
    })
  );
  if (!profile.profile || !profile.profile.recommendedDirection) throw new Error("profile generation failed");
  console.log("smoke ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
