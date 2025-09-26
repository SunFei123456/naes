# 新闻系统使用说明

## 概述

基于 mock.md 中的接口设计，已完成新闻列表和详情页面的改造，支持中英双语内容展示和动态数据加载。

## 文件结构

```
src/
├── types/news.ts              # 新闻相关类型定义
├── services/newsService.ts    # API 服务和 Mock 数据
├── hooks/useNews.ts           # 新闻数据获取 Hook
├── utils/markdownRenderer.ts  # Markdown 内容渲染工具
├── components/LoadingSpinner.tsx # 加载状态组件
├── pages/
│   ├── News.tsx              # 新闻列表页面
│   └── NewsDetail.tsx        # 新闻详情页面
```

## 主要功能

### 1. 新闻列表页面 (News.tsx)

- ✅ 支持中英双语显示
- ✅ 响应式卡片布局
- ✅ 悬停效果和动画
- ✅ 加载状态显示
- ✅ 动态数据渲染
- ✅ 日期格式化
- ✅ 点击跳转到详情页

### 2. 新闻详情页面 (NewsDetail.tsx)

- ✅ 支持中英双语内容
- ✅ Markdown 内容渲染
- ✅ 文章元信息显示（发布时间、阅读量、发布者）
- ✅ 响应式布局
- ✅ 返回按钮
- ✅ 加载和错误状态处理

### 3. 数据管理

- ✅ TypeScript 类型安全
- ✅ Mock 数据支持
- ✅ 易于切换到真实 API
- ✅ 错误处理

## 使用方法

### 1. 新闻列表

访问 `/news` 路由即可查看新闻列表，系统会自动：

- 根据当前语言显示对应内容
- 加载已发布状态的新闻
- 显示加载状态

### 2. 新闻详情

点击新闻卡片的"更多"按钮或访问 `/news/:id` 路由查看详情：

- 自动根据 URL 参数获取文章 ID
- 根据当前语言显示对应内容
- 渲染 Markdown 格式的文章内容

### 3. 切换到真实 API

在 `src/services/newsService.ts` 中：

```typescript
// 将 Mock 数据替换为真实 API 调用
export const newsService = {
  async getNewsList(params: NewsListParams = {}): Promise<NewsListResponse> {
    const response = await fetch(`/api/news?${new URLSearchParams(params as any)}`);
    return response.json();
  },

  async getNewsDetail(articleId: string): Promise<NewsDetailResponse> {
    const response = await fetch(`/api/news/${articleId}`);
    return response.json();
  }
};
```

## 接口规范

### 新闻列表接口

- **URL**: `GET /api/news`
- **参数**: `page`, `pageSize`, `status`
- **响应**: 包含分页信息和新闻列表

### 新闻详情接口

- **URL**: `GET /api/news/:id`
- **响应**: 包含完整的新闻内容和元信息

## 扩展功能

### 1. 分页支持

在 `useNews.ts` Hook 中已预留分页逻辑，可以轻松添加分页组件。

### 2. 搜索和筛选

可以扩展 `NewsListParams` 类型和相应的 UI 组件来支持搜索和筛选功能。

### 3. 更丰富的 Markdown 渲染

当前使用简单的正则表达式渲染 Markdown，建议在生产环境中使用 `react-markdown` 或类似库。

### 4. SEO 优化

可以添加 `react-helmet` 来动态设置页面标题和 meta 信息。

## 注意事项

1. **图片加载**: 确保图片 URL 可访问，建议添加图片加载失败的备用处理
2. **错误处理**: 已包含基本错误处理，可根据需要扩展
3. **性能优化**: 大量新闻时建议添加虚拟滚动或懒加载
4. **缓存策略**: 可以添加数据缓存来提升用户体验

## 开发建议

1. 使用 React Query 或 SWR 来管理服务端状态
2. 添加单元测试覆盖关键功能
3. 考虑添加骨架屏来改善加载体验
4. 实现图片懒加载和优化
