import axios from 'axios'
import { loadingBegin, loadingEnd } from '../stores/loading'

// 动态选择 API 根路径：开发环境统一走本地代理 '/api'，生产走线上地址
let baseURL = 'https://beta-admin.natureessential.ltd/api'
try {
  // 优先使用打包时注入的 NODE_ENV
  // rspack 会在打包期替换 process.env.NODE_ENV
  // 开发环境 -> '/api'
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    baseURL = '/api'
  } else if (typeof window !== 'undefined') {
    // 兜底：本地/局域网/HTTP 也走 '/api'
    const { protocol, hostname } = window.location || {}
    const isLocalName = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname || '')
    const isLan = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname || '')
    const isHttp = protocol === 'http:'
    if (isLocalName || isLan || isHttp) {
      baseURL = '/api'
    }
  }
} catch (_) {}

const http = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截：按 key 计数，默认使用 'global'，支持最小展示时长
http.interceptors.request.use((config) => {
  const key = config.loadingKey || 'global'
  if (config.enableLoading !== false) {
    loadingBegin(key)
  }
  // 自动附带鉴权头
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = config.headers || {}
      // 后端通常采用 Bearer 方案，如不同请告知调整
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (_) {
    // 忽略本地存储异常
  }
  return config
})

// 响应拦截：结束计数，应用最小展示时长（默认 300ms）
http.interceptors.response.use(
  (resp) => {
    const cfg = resp.config || {}
    const key = cfg.loadingKey || 'global'
    if (cfg.enableLoading !== false) {
      loadingEnd(key, cfg.loadingMinDuration || 300)
    }
    return resp
  },
  (err) => {
    const cfg = (err && err.config) || {}
    const key = cfg.loadingKey || 'global'
    if (cfg && cfg.enableLoading !== false) {
      loadingEnd(key, cfg.loadingMinDuration || 300)
    }
    // 统一 401 处理：清理登录态并跳转登录页
    const status = err?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      } catch (_) {}
      const from = typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname + window.location.search) : ''
      if (typeof window !== 'undefined') {
        window.location.href = `/login${from ? `?from=${from}` : ''}`
      }
    }
    return Promise.reject(err)
  }
)

export default http
