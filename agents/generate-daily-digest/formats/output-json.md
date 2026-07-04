# 输出 JSON 格式

必须返回 JSON 对象：

```json
{
  "title": "YYYY-MM-DD AI 工具号选题日报",
  "sourceSummary": "今天读取了哪些来源或线索",
  "accountDirection": "当前账号方向",
  "headline": "今天最重要的判断",
  "recommendedTopics": [
    {
      "title": "可直接进入选题策划卡的标题",
      "source": "来源名称",
      "url": "原始来源链接",
      "sourceTitle": "原始新闻或工具线索标题",
      "sourceUrl": "原始新闻或工具线索链接",
      "sourceFreshness": "今日新内容 / 补位：YYYY-MM-DD",
      "publishedAt": "原始发布时间",
      "publishedDate": "YYYY-MM-DD",
      "isToday": true,
      "whatHappened": "这条新闻/更新到底是什么",
      "summary": "热点摘要",
      "whyWrite": "为什么 TOMOAI 值得写它，写给谁看，能实测什么",
      "reason": "为什么值得写",
      "format": "测评 / 教程 / 对比 / 案例 / 商业判断",
      "risk": "写的时候要避开什么"
    }
  ],
  "avoidTopics": ["不建议追的方向"],
  "nextActions": ["下一步动作"]
}
```
