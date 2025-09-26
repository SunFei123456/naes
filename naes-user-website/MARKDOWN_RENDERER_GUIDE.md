# Markdown 渲染器使用指南

## 概述

项目已集成专业的 `react-markdown` 渲染器，支持完整的 Markdown 语法和自定义样式。

## 已安装的依赖

```bash
pnpm add react-markdown remark-gfm rehype-highlight rehype-raw
```

## 功能特性

### ✅ 支持的 Markdown 语法
- **标题** (H1-H6)
- **段落和换行**
- **粗体和斜体**
- **无序和有序列表**
- **链接** (自动在新窗口打开)
- **图片** (响应式显示，懒加载)
- **代码块和内联代码**
- **表格**
- **引用块**
- **分割线**
- **GitHub Flavored Markdown (GFM)**

### ✅ 自定义样式
- 响应式设计
- 优雅的排版
- 代码高亮样式
- 图片阴影和圆角
- 悬停效果

## 使用方法

### 基本使用

```tsx
import MarkdownRenderer from '@/components/MarkdownRenderer';

const MyComponent = () => {
  const markdownContent = `
# 标题

这是一个段落。

## 二级标题

- 列表项 1
- 列表项 2

![图片](image-url.jpg)
  `;

  return (
    <MarkdownRenderer 
      content={markdownContent}
      className="custom-styles"
    />
  );
};
```

### 在新闻详情页中的使用

```tsx
// NewsDetail.tsx
<article>
  <MarkdownRenderer 
    content={content.body}
    className="text-gray-700 leading-relaxed"
  />
</article>
```

## 样式定制

### CSS 类名
- `.markdown-content` - 主容器
- 所有标准 HTML 元素都有对应的样式

### 自定义样式文件
`src/styles/markdown.css` 包含了完整的样式定义，可以根据需要修改。

## 解决的问题

### DOM 嵌套警告
- ✅ 修复了 `<p>` 标签内不能包含 `<div>` 的问题
- ✅ 图片组件使用正确的 HTML 结构
- ✅ 段落检测和智能渲染

### 性能优化
- ✅ 图片懒加载
- ✅ 响应式图片显示
- ✅ 优化的 CSS 样式

## 扩展功能

### 代码高亮
如需要语法高亮，可以添加：

```bash
pnpm add highlight.js
```

然后在 MarkdownRenderer 中配置：

```tsx
import 'highlight.js/styles/github.css';

// 在 components 中添加
code: ({ inline, className, children }) => {
  // 代码高亮逻辑
}
```

### 数学公式
如需要数学公式支持，可以添加：

```bash
pnpm add remark-math rehype-katex
```

### 目录生成
可以添加 `remark-toc` 插件自动生成目录。

## 最佳实践

1. **内容安全**: 使用 `rehype-raw` 时要确保内容来源可信
2. **图片优化**: 建议使用 CDN 和适当的图片格式
3. **性能**: 对于长文章考虑虚拟滚动
4. **SEO**: 确保标题结构合理，有利于搜索引擎优化

## 故障排除

### 常见问题

1. **图片不显示**: 检查图片 URL 是否可访问
2. **样式不生效**: 确保导入了 CSS 文件
3. **DOM 警告**: 检查自定义组件的 HTML 结构

### 调试技巧

```tsx
// 开启调试模式
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
  // 添加调试属性
  skipHtml={false}
  allowDangerousHtml={true}
>
  {content}
</ReactMarkdown>
```