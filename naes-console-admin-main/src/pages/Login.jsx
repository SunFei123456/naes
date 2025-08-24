import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/auth'

export default function Login() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const loc = useLocation()
  const login = useAuthStore(s => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successTip, setSuccessTip] = useState('')
  const [errorTip, setErrorTip] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login({ userName: username, password })
    setLoading(false)
    if (res?.ok) {
      // 显示右上角成功提示，稍后跳转
      setSuccessTip('登录成功,正在跳转控台页')
      const params = new URLSearchParams(loc.search)
      const from = params.get('from') || '/'
      setTimeout(() => {
        nav(from, { replace: true })
      }, 1000)
    }
    else {
      const msg = res?.message || '登录失败'
      setError(msg)
      setErrorTip(msg)
      setTimeout(() => setErrorTip(''), 5000)
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* 顶部右侧成功/错误提示 */}
      {successTip && (
        <div className="fixed top-4 right-4 z-50 px-3 py-2 rounded bg-green-600 text-white shadow-lg text-sm">
          {successTip}
        </div>
      )}
      {errorTip && (
        <div className="fixed top-4 right-4 z-50 px-3 py-2 rounded bg-red-600 text-white shadow-lg text-sm">
          {errorTip}
        </div>
      )}
      <form onSubmit={onSubmit} autoComplete="on" className="w-full max-w-sm p-6 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <h1 className="text-2xl font-semibold text-center">{t('login.title')}</h1>
        <label className="block">
          <span className="text-sm mb-1 block">{t('login.username')}</span>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 rounded border dark:border-zinc-700 bg-transparent"
            name="username"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm mb-1 block">{t('login.password')}</span>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 rounded border dark:border-zinc-700 bg-transparent"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className={`w-full px-3 py-2 rounded text-white dark:text-black ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 dark:bg-gray-100'}`}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              正在登录...
            </span>
          ) : (
            t('login.submit')
          )}
        </button>
      </form>
    </div>
  )
}
