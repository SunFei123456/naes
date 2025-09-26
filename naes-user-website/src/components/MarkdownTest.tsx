import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const testMarkdown = `
# 测试标题

这是一个测试段落，用来验证 Markdown 渲染器是否正常工作。

## 二级标题

### 功能测试

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

**粗体文本** 和 *斜体文本*

\`内联代码\` 示例

\`\`\`javascript
// 代码块示例
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> 这是一个引用块
> 可以包含多行内容

[链接示例](https://example.com)

![测试图片](https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Test+Image)

---

| 表格 | 示例 |
|------|------|
| 单元格1 | 单元格2 |
| 单元格3 | 单元格4 |
`;

const MarkdownTest: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Markdown 渲染器测试</h1>
      <MarkdownRenderer content={testMarkdown} />
    </div>
  );
};

export default MarkdownTest;