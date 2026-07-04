# TOMOAI OPC 后台 Agent MD 索引

这个文件夹已经放到桌面：

`TOMOAI_OPC_Agent_MD_后台文件`

桌面上的文件夹是项目 `agents` 目录的实时入口，不是复制件。你在桌面里改这些 md，网站后台下一次调用对应功能时会直接读取新内容。

## 主功能入口

- `profile-account.md`：00 账号定位
- `evaluate-topic.md`：选题线索判断
- `generate-topic-card.md`：生成详细选题策划卡
- `generate-daily-digest.md`：生成 AI 工具号日报
- `generate-ip-framework.md`：生成 IP 文框架
- `revise-ip-framework.md`：根据反馈修改 IP 文框架
- `generate-ip-draft.md`：根据确认后的框架生成 IP 文正文
- `revise-ip-draft.md`：根据反馈修改 IP 文正文
- `generate-brief-package.md`：生成稿前包
- `generate-article-skeleton.md`：从稿前包生成 Markdown 文章骨架
- `generate-article-framework.md`：生成日常 / 商稿文章框架
- `revise-article-framework.md`：根据反馈修改文章框架
- `generate-article-draft.md`：根据确认后的框架生成公众号正文草稿
- `generate-headline-options.md`：生成公众号标题备选
- `analyze-sponsored-brief.md`：解析商稿 Brief 并生成客户确认版内容方案
- `extract-sponsored-analytics.md`：从商稿数据截图识别标题、日期和互动数据
- `check-article-before-publish.md`：写文工具台里的发布检查
- `remove-ai-smell.md`：发布检查后的去 AI 味整理
- `generate-analytics-recap.md`：数据复盘
- `chat-profile-account.md`：账号定位结果的对话式调整
- `chat-analytics-recap.md`：数据复盘结果的对话式追问
- `chat-cover-prompt.md`：封面提示词的对话式调整
- `extract-author-style.md`：从代表作里萃取写作风格
- `organize-markdown.md`：整理成适合公众号编辑器继续排版的 Markdown
- `knowledge-agent-record.md`：根据指令更新 Agent 记录
- `knowledge-agent-qa.md`：回答知识库相关问题
- `knowledge-compact.md`：压缩过长知识库 Markdown

## 组合型 Skill 文件

- `_shared/content-boundary.md`：所有 agent 共用的内容边界
- `profile-account/SKILL.md`：账号定位的详细工作说明
- `profile-account/knowledge/direction-map.md`：账号方向映射知识
- `generate-daily-digest/SKILL.md`：日报生成的详细工作说明
- `generate-daily-digest/knowledge/topic-conversion.md`：热点转选题规则
- `generate-daily-digest/formats/output-json.md`：日报输出格式要求

## 修改提醒

- 尽量保留“只输出 JSON”的要求，否则网页可能解析失败。
- 可以改判断标准、语气、字段解释、反例和方法论。
- 不要把 API Key、账号密码、cookie 之类内容写进 md。
- 改完 md 后不一定要重启服务；下一次点击生成功能时，后端会重新读取这些文件。
