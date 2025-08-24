## 项目概览（Frontend）

### 技术栈与配置
- **框架**: React 18 + TypeScript
- **路由**: `react-router-dom@7`
- **样式**: Tailwind CSS
- **国际化**: `i18next` + `react-i18next` + 浏览器语言探测
- **构建**: Vite（别名 `@` → `src`，`base: './'` 便于相对子目录部署）
- 可能的遗留/未用：`next.config.mjs`、`@types/next`、`antd`（代码中未检出使用）

### 入口与全局
- 入口链路：`index.html` → `src/main.tsx` → `src/App.tsx`
- `App.tsx`：挂载 `BrowserRouter`、`ScrollToTop`、`AppRoutes`
- 全局样式：`src/index.css`、`src/styles/globals.css`（定义 `--header-height`、滚动条等）
- 别名配置：`vite.config.ts`、`tsconfig.json` 同步配置 `@/*`

### 路由结构
- `/` 首页（`Home` 自带 `Header/Footer`）
- `/about`、`/why-choose-us`、`/products`、`/contact`、`/qa`
- 子路由：
  - `/products/:productId`
  - `/qa/:categoryId`
  - `/qa/:categoryId/:questionId`
- 注意：
  - `src/routes/AppRoutes.tsx` 中 `/contact` 路由重复声明（建议删除一条）
  - 未配置通配 `*` 到 `NotFound`（已有组件，可补充 404 兜底）

### 页面与组件
- 页面：`src/pages/*`（`Home/About/WhyChooseUs/Contact/Products/...`）
- 布局：`src/components/Layout`（含 `Header`、`Footer`，多数页面通过 `Layout` 包裹）
- 首页 `Home` 自行引入 `Header/Footer`，与其他页面的 `Layout` 方式略不一致（可统一）
- 导航与语言切换：`src/components/Header`（中英切换、国旗图标、社媒链接在部分路径显示）
- 面包屑：`src/components/Breadcrumbs`（对 QA 分类和问题做了简化映射）

### 数据与国际化
- 产品静态数据：`src/data/products.ts` + 类型 `src/types/product.d.ts`
- 详情页：`src/components/product/ProductDetailTemplate` + `src/hooks/useProductTranslations`
- 文案与多语言：`src/locales/en|zh/*.json`；默认 `zh`，回退 `en`；`Header` 提供语言切换
- `qa.md` 提供与 QA 相关的中英资料，页面文案主要走 i18n JSON

### 启动与构建
```bash
cd frontend
npm i
npm run dev
# 构建
npm run build
```

### 可优化点（建议）
- 去重 `src/routes/AppRoutes.tsx` 的 `/contact` 路由
- 增加通配 `*` → `NotFound`
- 统一布局用法（让 `Home` 也使用 `Layout`）
- 清理未用依赖/文件（`antd`、`next.config.mjs`、`@types/next` 等）
- 产品规格表中占位 “-” 较多，可按数据隐藏空列或补全文案


