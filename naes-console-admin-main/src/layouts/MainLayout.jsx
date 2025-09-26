import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../stores/theme'
import { useLangStore } from '../stores/lang'
import { useAuthStore } from '../stores/auth'
import introJs from 'intro.js'
import 'intro.js/minified/introjs.min.css'
import Icon from '../components/Icon'
import LangSelect from '../components/LangSelect'

// 简易布局：左侧侧边栏 + 顶部工具条（主题/语言/登出）+ 面包屑 + 主内容
export default function MainLayout() {
  const { t } = useTranslation()
  const theme = useThemeStore(s => s.theme)
  const toggleTheme = useThemeStore(s => s.toggle)
  const lang = useLangStore(s => s.lang)
  const setLang = useLangStore(s => s.setLang)
  const logout = useAuthStore(s => s.logout)
  const nav = useNavigate()
  const loc = useLocation()

  const crumbs = loc.pathname.split('/').filter(Boolean)

  // 侧边栏收缩状态，持久化到 localStorage
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === '1'
  })
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  const steps = useMemo(() => ([
    // 侧边栏（按顺序）
    { element: '[data-guide="nav-dashboard"]', intro: '面板' },
    { element: '[data-guide="nav-message"]', intro: '消息管理' },
    { element: '[data-guide="nav-profile"]', intro: '个人信息' },
    // 顶部 Header（按顺序）
    { element: '[data-guide="theme"]', intro: '主题设置' },
    { element: '[data-guide="lang"]', intro: '语言选择' },
    { element: '[data-guide="guide"]', intro: '开启引导' },
    { element: '[data-guide="fullscreen"]', intro: '全屏切换' },
    // 页面内容区域
    { element: '[data-guide="content"]', intro: '主内容区域' },
    // Dashboard 页面关键模块（在 Dashboard 页面时会显示，不存在则自动跳过）
    { element: '[data-guide="dash-kpi-total"]', intro: '总消息数' },
    { element: '[data-guide="dash-kpi-7d"]', intro: '近 7 天新增' },
    { element: '[data-guide="dash-kpi-latest"]', intro: '最新日期' },
    { element: '[data-guide="dash-kpi-companies"]', intro: '公司数' },
    { element: '[data-guide="dash-trend"]', intro: '30 天趋势图' },
    { element: '[data-guide="dash-top"]', intro: 'Top 公司' },
    { element: '[data-guide="dash-recent"]', intro: '最近消息表' }
  ]), [t])

  const startGuide = () => {
    introJs().setOptions({
      steps,
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: true,
      scrollToElement: true,
      nextLabel: '下一步',
      prevLabel: '上一步',
      skipLabel: '跳过',
      doneLabel: '完成'
    }).start()
  }

  // 全屏切换：状态与监听
  const [isFullscreen, setIsFullscreen] = useState(false)
  useEffect(() => {
    const onFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement
      setIsFullscreen(Boolean(fsEl))
    }
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    document.addEventListener('msfullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
      document.removeEventListener('msfullscreenchange', onFsChange)
    }
  }, [])

  const enterFullscreen = () => {
    const el = document.documentElement
    if (el.requestFullscreen) return el.requestFullscreen()
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen()
    if (el.msRequestFullscreen) return el.msRequestFullscreen()
  }

  const exitFullscreen = () => {
    if (document.exitFullscreen) return document.exitFullscreen()
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen()
    if (document.msExitFullscreen) return document.msExitFullscreen()
  }

  useEffect(() => {
    // 首次进入触发新手引导
    const key = 'guide_done_v1'
    if (!localStorage.getItem(key)) {
      setTimeout(() => {
        try {
          startGuide()
          localStorage.setItem(key, '1')
        } catch {}
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* 顶部 Header：左 logo+text，右 操作按钮 */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Icon name="home" className="w-4 h-4" />
          <span className="font-semibold">{t('app.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 主题切换 */}
          <button className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2" onClick={toggleTheme} data-guide="theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-4 h-4" />
            {theme === 'dark' ? t('theme.light') : t('theme.dark')}
          </button>
          {/* 语言切换（自定义下拉） */}
          <span data-guide="lang">
            <LangSelect value={lang} onChange={setLang} />
          </span>
          {/* 引导按钮 */}
          <button
            className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2"
            onClick={startGuide}
            data-guide="guide"
          >
            <Icon name="question" className="w-4 h-4" />
            {t('guide.start')}
          </button>
          {/* 全屏切换 */}
          <button
            className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2"
            onClick={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
            title={isFullscreen ? t('action.exitFullscreen') : t('action.fullscreen')}
            aria-label={isFullscreen ? t('action.exitFullscreen') : t('action.fullscreen')}
            data-guide="fullscreen"
          >
            <Icon name={isFullscreen ? 'compress' : 'expand'} className="w-4 h-4" />
            <span className="hidden sm:inline">{isFullscreen ? t('action.exitFullscreen') : t('action.fullscreen')}</span>
          </button>
          {/* 登出 */}
          <button
            className="px-3 py-1 rounded border border-red-300 text-red-600 dark:border-red-700 inline-flex items-center gap-2"
            onClick={() => { logout(); nav('/login', { replace: true }) }}
          >
            <Icon name="logout" className="w-4 h-4" />
            {t('menu.logout')}
          </button>
        </div>
      </header>

      {/* 下方两栏：左侧侧边栏（可收缩）+ 右侧内容区 */}
      <div className="flex-1 flex">
        {/* 侧边栏 */}
        <aside
          className={`${collapsed ? 'w-16' : 'w-56'} transition-all duration-200 ease-in-out shrink-0 border-r border-gray-200 dark:border-zinc-800 p-3 flex flex-col`}
          data-guide="sidebar"
        >
          <nav className="flex flex-col gap-2 flex-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
              data-guide="nav-dashboard"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="gauge" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.dashboard')}</span>}
              </span>
            </NavLink>
            <NavLink
              to="/message"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
              data-guide="nav-message"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="list" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.message')}</span>}
              </span>
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
              data-guide="nav-news"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="newspaper" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.news')}</span>}
              </span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
              data-guide="nav-profile"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="user" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.profile')}</span>}
              </span>
            </NavLink>
          </nav>

          {/* 侧边栏底部：收缩/展开开关 */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
            <button
              className="w-full px-2 py-2 rounded border dark:border-zinc-700 inline-flex items-center justify-center gap-2"
              onClick={() => setCollapsed(v => !v)}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} className="w-4 h-4" />
              {!collapsed && <span className="text-sm">{collapsed ? t('action.expand') : t('action.collapse')}</span>}
            </button>
          </div>
        </aside>

        {/* 右侧主区域 */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 面包屑（右内容区域左上角） */}
          <div className="h-10 px-4 flex items-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded px-2 py-1">
              <Icon name="home" className="w-3.5 h-3.5" />
              {crumbs.length === 0 ? (
                <span>home</span>
              ) : (
                crumbs.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <Icon name="angleRight" className="w-3 h-3 opacity-60" />
                    <span>{c === 'dashboard' ? t('menu.dashboard') : c === 'message' ? t('menu.message') : c === 'news' ? t('menu.news') : c === 'profile' ? t('menu.profile') : c}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 主内容 */}
          <main className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 56px - 40px)' }} data-guide="content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
