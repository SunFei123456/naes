# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

项目总览
- 本仓库包含两个可独立开发与构建的前端应用：
  - naes-console-admin-main/：内部管理控制台（React + Rspack + Tailwind）。
  - naes-user-website/：对外用户站点（React + Vite + TypeScript + Tailwind）。
- 以下命令均需在对应子目录中执行。

常用命令
管理控制台（naes-console-admin-main/）
- 安装依赖：npm install
- 启动开发服务（默认 http://localhost:8080）：npm run dev
- 生产构建：npm run build
- 本地预览生产构建：npm run preview
- 接口约定：通过 axios 以 /api 作为基路径；请在本地/部署环境为 /api 配置反向代理到后端。

用户站点（naes-user-website/）
- 安装依赖：npm install
- 启动开发服务（默认 http://localhost:5173）：npm run dev
- 生产构建：npm run build
- 本地预览生产构建：npm run preview
- 接口约定：默认以 /api 为基路径；可通过环境变量 VITE_API_BASE_URL 覆盖。开发与预览环境已将 /api 代理到 https://beta.natureessential.ltd（见 vite.config.ts）。

Lint / Test
- 两个子项目均未定义独立的 lint 或 test 脚本。用户站点引入了 ESLint 相关依赖与 Vite ESLint 插件，开发时会进行基本校验，但没有单独的 npm run lint；目前也未配置测试框架与单测命令。

高层架构与关键模块
管理控制台（React + Rspack）
- 路由与访问控制：
  - src/router/index.jsx 定义 Routes，并通过 ProtectedRoute 读取鉴权状态（Zustand 的 auth store）保护主路由。未登录会重定向到 /login。
  - 通过嵌套路由将 MainLayout 作为壳层，子路由包含 dashboard、message、news（列表/新增/编辑）、profile 等。
- 布局与系统壳：
  - src/layouts/MainLayout.jsx 负责整体布局（Header、可收缩侧边栏、面包屑、内容区）。
  - 集成 intro.js 提供新手引导；Header 内含主题切换、语言切换、全屏开关与登出。
- 状态与国际化：
  - Zustand stores：auth（登录/登出、token 与 user 的 localStorage 持久化）、theme（明暗主题切换）、lang（语言选择，持久化）。
  - i18n：i18next + react-i18next，默认中文 zh，回退 en；文案资源位于 src/i18n/locales/zh.json 与 en.json。
- 网络层：
  - src/services/http.js 基于 axios，统一 baseURL '/api'；请求拦截注入 Authorization 头；响应拦截统一处理 401（清理本地登录态并跳转 /login）；集成加载指示计数与最小展示时长。
- 图表与组件：
  - 组件目录下包含 DataTablePro（服务端分页/排序、列可见、密度切换、固定表头、骨架/空态）、UPlotChart、NivoBar、（可选）EChart 等通用封装。

用户站点（React + Vite + TypeScript）
- 构建与别名：
  - Vite + TS；vite.config.ts 配置 '@' 指向 src，base './'，构建产物 dist/ 且文件名带 hash。
- 路由与页面：
  - src/routes/AppRoutes.tsx 定义路由；大多数页面在共享的 Layout 中渲染。包含 Home、WhyChooseUs、Products 与 ProductDetail、News 与 NewsDetail、Contact 等；支持 /products/:productId、/news/:id 动态路由。
- 网络层：
  - src/services/api.ts 提供轻量 fetch 封装：自动拼接基路径（VITE_API_BASE_URL 或 '/api'），支持 get/post 与响应类型；在开发模式输出调试日志，并附带响应 headers/status 到返回数据，便于上层读取。
- 国际化与样式：
  - 多语言资源位于 src/locales/zh 与 src/locales/en；预留 useLanguageInit 钩子以便后续扩展语言初始化逻辑。
  - Tailwind 用于全局样式与组件样式。

端口与代理
- 默认开发端口：管理控制台 8080，用户站点 5173（见根 README 与各自 README）。
- /api 代理：
  - 用户站点在开发与预览环境已就绪（vite.config.ts）。
  - 管理控制台需在本地/部署侧通过反向代理或网关将 /api 指向真实后端（axios 实例默认同源 /api）。

文档要点（来自仓库内 README）
- 根 README：说明了“控台 + 前台”的目的、角色、典型流程、快速本地体验与默认端口。
- 管理控制台 README：列举技术栈（React + Rspack + Tailwind、Zustand、React Router、i18next）、Dashboard 模块构成（KPI、近 30 天趋势、Top Companies、最近消息表）与常用脚本。

跨项目约定
- 两个应用均假定后端以 /api 暴露；请在开发与部署环境确保 /api 能正确代理到目标后端。
- 两个应用相互独立，可分别安装依赖与启动，不存在运行时的直接耦合。