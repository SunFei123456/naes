# 验证码模块说明

本文档说明前端验证码的整体流程、接口约定、前端实现、开发代理与常见问题排查。

---

## 目录
- 概览
- 接口与返回结构
- 前端实现
  - API 封装 `src/services/api.ts`
  - 验证码服务 `src/services/contact.ts`
  - 页面使用 `src/pages/Contact.tsx`
  - Vite 代理 `vite.config.ts`
- 生命周期与缓存
- 常见问题排查
- 环境切换与配置
- 变更记录

---

## 概览
- 目标：在联系表单中获取验证码图片与 `uuid`，用户填写答案后连同 `uuid` 一并提交。
- 后端可能有两种返回形式：
  1) JSON：包含 base64 图片与 `uuid`（推荐）
  2) Blob：图片流，`uuid`/`ttl` 在响应头中
- 前端已兼容两种形式，并统一返回 `{ uuid, ttl?, blobUrl }` 给页面使用，其中 `blobUrl` 可能是 `data:` URL 或 `blob:` URL。

---

## 接口与返回结构

- 获取验证码
  - 路径：`GET /captcha/code`
  - 可能返回：
    - JSON（示例）
      ```json
      {
        "data": {
          "uuid": "<uuid>",
          "captchaImage": "<base64 或 data:image/png;base64,...>",
          "ttl": 120
        }
      }
      ```
      可兼容字段名：
      - 图片：`captchaImage`/`image`/`base64`/`captchaBase64`
      - 标识：`uuid`/`captchaUuid`/`captchaId`/`id`
      - 过期：`ttl`/`expiresIn`/`expire`/`expireIn`，或 `expireAt`/`expiresAt`
    - Blob：图片流，相关信息在响应头（可选）：
      - `x-captcha-uuid`/`captcha-uuid`/`uuid`/`x-uuid`
      - `x-captcha-ttl`/`captcha-ttl`/`ttl`

- 发送联系消息
  - 路径：`POST /contact/message/send`
  - Body：表单字段 + `uuid` + `answer`
    ```json
    {
      "name": "",
      "email": "",
      "company": "",
      "phone": "",
      "whatsapp": "",
      "message": "",
      "uuid": "<同验证码uuid>",
      "answer": "<用户填写的验证码>"
    }
    ```

---

## 前端实现

### API 封装 `src/services/api.ts`
- 开发环境（`import.meta.env.DEV`）强制使用 `'/api'` 作为基址，确保所有请求通过 Vite 代理，规避 CORS。
- 仅当响应 `content-type` 为 `text/html` 且 base 非 `'/api'` 时，才尝试一次 `'/api'` 代理重试（避免无意义日志与循环）。
- 支持 `responseType: 'json' | 'blob' | 'text'`。

### 验证码服务 `src/services/contact.ts`
- `getCaptcha()`：
  1) 优先按 JSON 解析，抽取 `uuid`、图片、`ttl`，将图片标准化为 `data:` URL，返回 `{ uuid, ttl, blobUrl }`。
  2) 若 JSON 无图片，回退为 Blob：从响应头读取 `uuid`/`ttl`，并用 `URL.createObjectURL()` 产出 `blob:` URL，返回 `{ uuid, ttl, blobUrl }`。
- `sendContactMessage(payload, uuid, answer)`：向 `/contact/message/send` 提交表单。

### 页面使用 `src/pages/Contact.tsx`
- 加载与刷新验证码：
  - `loadCaptcha(force?: boolean)` 调用 `getCaptcha()` 后设置 `captchaImgUrl` 与 `captchaUUID`。
  - 刷新前若旧 URL 为 `blob:`，使用 `URL.revokeObjectURL()` 回收，避免内存泄漏。
  - 组件卸载时亦只对 `blob:` URL 进行回收。
- 输入与提交：用户输入 `answer`，提交时将 `uuid`、`answer` 与表单一并发送。

### Vite 代理 `vite.config.ts`
```ts
server: {
  proxy: {
    '/api': {
      target: 'https://beta.natureessential.ltd',
      changeOrigin: true,
      secure: false,
      // 注：是否需要 rewrite 取决于后端真实路由：
      // 如果上游路径是 /captcha/code（无 /api 前缀），启用：
      // rewrite: (path) => path.replace(/^\/api/, ''),
      // 如果上游路径是 /api/captcha/code（有 /api 前缀），不要 rewrite。
    },
  },
},
```
- 当前环境已验证“不 rewrite”可用，即上游需要带 `/api` 前缀。
- 每次修改代理后，需重启开发服务器。

---

## 生命周期与缓存
- 本地缓存 `localStorage`：
  - `captcha_uuid`：上次获取的 uuid
  - `captcha_expire_at`：过期时间戳（ms）
- `Contact.tsx` 会在加载时尝试读取缓存，但即使有缓存，也会重新取一次图片以更新视觉。
- `ttl` 若提供，用于计算 `expire_at`。

---

## 常见问题排查
- 返回 HTML（`text/html`）
  - 多因代理路径与上游不匹配，或开发服务器未重启。
  - 检查：Network 中 `/api/captcha/code` 的 `Request URL` 与上游 `Remote Address`。
  - 处理：根据上游是否带 `/api` 前缀，调整 `rewrite`。

- CORS 报错
  - 开发环境必须通过 Vite 代理；`api.ts` 已强制 `base='/api'`，不要在浏览器里改 `window.__API_BASE_URL` 或 `localStorage.API_BASE_URL`。

- 图片不展示或反复占用内存
  - 确认 `Contact.tsx` 在刷新前回收旧的 `blob:` URL，`data:` URL 不需要回收。

---

## 环境切换与配置
- 生产环境基址：
  - `VITE_API_BASE_URL`（`.env.production`）
  - 若未配置，`api.ts` 使用 fallback：`https://beta.natureessential.ltd/api`（当前默认）。
- 开发环境：固定 `'/api'`。
- 如需在浏览器临时覆写（不建议开发时使用）：
  ```js
  // 覆盖仅对非 DEV 生效；DEV 恒为 '/api'
  localStorage.setItem('API_BASE_URL', 'https://example.com/api');
  ```

---

## 变更记录
- 2025-08-24
  - DEV 强制 `base='/api'`，移除“绝对地址兜底重试”。
  - `getCaptcha()` 兼容 JSON(base64) 与 Blob 两种返回，统一 `{ uuid, ttl, blobUrl }`。
  - `Contact.tsx` 在刷新与卸载时仅对 `blob:` URL 执行 `URL.revokeObjectURL()`。
  - 依据后端验证，代理采用“不 rewrite”以保留 `/api` 前缀。
