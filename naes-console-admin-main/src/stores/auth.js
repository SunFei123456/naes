import { create } from 'zustand'
import http from '../services/http'

// 鉴权：调用后端接口，持久化 token/user，并支持初始化恢复
export const useAuthStore = create((set, get) => {
  // 初始化：尝试从本地恢复
  let initialToken = null
  let initialUser = null
  try {
    initialToken = localStorage.getItem('auth_token') || null
    const userStr = localStorage.getItem('auth_user')
    initialUser = userStr ? JSON.parse(userStr) : null
  } catch (_) {}

  return {
    token: initialToken,
    user: initialUser,
    /**
     * 登录
     * @param {{userName?: string, username?: string, password: string}} payload
     * @returns {Promise<{ok: boolean, message?: string}>}
     */
    login: async (payload) => {
      const userName = payload.userName || payload.username || ''
      const password = payload.password || ''
      if (!userName || !password) {
        return { ok: false, message: '用户名或密码不能为空' }
      }
      try {
        // 与后端约定：路径以 http 实例 baseURL 为根
        const resp = await http.post('/naes/console/login', {
          userName,
          password
        }, {
          loadingKey: 'login'
        })

        const data = resp?.data || {}
        // 兼容常见响应结构 + 响应头
        const wrapped = data?.data ?? data
        let token = wrapped?.token
        if (!token) {
          const headerToken = resp?.headers?.['x-auth-token'] || resp?.headers?.['X-Auth-Token'] || resp?.headers?.get?.('x-auth-token')
          if (headerToken) token = headerToken
        }
        const user = wrapped?.user ?? { userName }

        if (!token) {
          const msg = wrapped?.message || data?.message || '登录失败：未返回 token'
          return { ok: false, message: msg }
        }

        // 持久化
        try {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('auth_user', JSON.stringify(user))
        } catch (_) {}

        set({ token, user })
        return { ok: true }
      } catch (err) {
        // 兼容后端错误结构
        const msg = err?.response?.data?.message || err?.message || '登录失败'
        return { ok: false, message: msg }
      }
    },
    logout: () => {
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      } catch (_) {}
      set({ token: null, user: null })
    },
    isAuthed: () => Boolean(get().token)
  }
})
