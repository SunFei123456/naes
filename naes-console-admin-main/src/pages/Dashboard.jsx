import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import DataTablePro from '../components/DataTablePro'
import UPlotChart from '../components/UPlotChart'
import NivoBar from '../components/NivoBar'
import dayjs from 'dayjs'
import { useThemeStore } from '../stores/theme'
import { useNavigate } from 'react-router-dom'
import { fetchMessagePage } from '../services/message'

export default function Dashboard() {
  const { t } = useTranslation()
  const theme = useThemeStore(s => s.theme)
  const isDark = theme === 'dark'
  const nav = useNavigate()
  // 源数据（来自真实接口）
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        setLoading(true)
        // 取最近 200 条用于趋势、Top 公司和最近 10 条；总数从后端分页信息读取
        const { list, total } = await fetchMessagePage({ page: 1, pageSize: 200 })
        if (!mounted) return
        setList(Array.isArray(list) ? list : [])
        setTotal(Number(total) || 0)
      } catch (_) {
        if (!mounted) return
        setList([])
        setTotal(0)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  // 统计：总数(来自后端) / 近7天新增 / 最近一条时间 / 公司数
  const last7Start = dayjs().startOf('day').subtract(6, 'day')
  const added7d = useMemo(() => list.filter(m => dayjs(m.createdAt).isAfter(last7Start)).length, [list, last7Start])
  const latestAt = useMemo(() => (list.length ? dayjs(list[0].createdAt).format('YYYY-MM-DD') : '-'), [list])
  const companyCount = useMemo(() => new Set(list.map(m => m.company)).size, [list])

  // 趋势：最近30天每日新增（uPlot 数据）
  const days = useMemo(() => Array.from({ length: 30 }).map((_, i) => dayjs().startOf('day').subtract(29 - i, 'day')), [])
  const trend = useMemo(() => days.map(d => ({
    date: d.format('MM-DD'),
    // uPlot 对 time 轴通常使用“秒”为单位，这里改为 Unix 秒
    ts: d.unix(),
    count: list.filter(m => dayjs(m.createdAt).isAfter(d) && dayjs(m.createdAt).isBefore(d.add(1, 'day'))).length,
  })), [days, list])
  const maxCount = useMemo(() => Math.max(1, ...trend.map(x => x.count)), [trend])
  // x 轴传入秒，确保与 uPlot scales.time 一致
  const uplotData = useMemo(() => [trend.map(x => x.ts), trend.map(x => x.count)], [trend])

  // Top 5 公司
  const companyMap = list.reduce((acc, cur) => {
    acc[cur.company] = (acc[cur.company] || 0) + 1
    return acc
  }, {})
  const topCompanies = Object.entries(companyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // 最近10条
  const recent = useMemo(() => list.slice(0, 10), [list])
  const [recentSorting, setRecentSorting] = useState([])
  const sortedRecent = useMemo(() => {
    if (!recent || recent.length === 0) return []
    if (!recentSorting || recentSorting.length === 0) return recent
    const { id: sortField, desc } = recentSorting[0] || {}
    if (!sortField) return recent
    const order = desc ? 'desc' : 'asc'
    const next = [...recent]
    next.sort((a, b) => {
      let av = a?.[sortField]
      let bv = b?.[sortField]
      // 日期类型
      if (String(sortField).toLowerCase().includes('at') || String(sortField).toLowerCase().includes('time') || String(sortField).toLowerCase().includes('date')) {
        av = av ? new Date(av).getTime() : 0
        bv = bv ? new Date(bv).getTime() : 0
      } else {
        if (typeof av === 'string') av = av.toLowerCase()
        if (typeof bv === 'string') bv = bv.toLowerCase()
      }
      if (av < bv) return order === 'asc' ? -1 : 1
      if (av > bv) return order === 'asc' ? 1 : -1
      return 0
    })
    return next
  }, [recent, recentSorting])
  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 140 },
    { key: 'company', title: 'Company', dataIndex: 'company', width: 140 },
    { key: 'email', title: 'Email', dataIndex: 'email', width: 220 },
    { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', width: 140, render: (v) => dayjs(v).format('YYYY-MM-DD') },
  ]

  // Nivo 数据
  const topBarData = topCompanies.map(([company, count]) => ({ company, count }))

  return (
    <div className="container-page">
      <PageHeader title={t('menu.dashboard')} />

      {/* KPI 区 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-kpi-total">
          <div className="text-xs text-gray-500 mb-1">Total Messages</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="list" className="w-5 h-5" />
            {loading ? '…' : total}
          </div>
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-kpi-7d">
          <div className="text-xs text-gray-500 mb-1">New in 7d</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="gauge" className="w-5 h-5" />
            {loading ? '…' : added7d}
          </div>
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-kpi-latest">
          <div className="text-xs text-gray-500 mb-1">Latest Date</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="globe" className="w-5 h-5" />
            {loading ? '…' : latestAt}
          </div>
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-kpi-companies">
          <div className="text-xs text-gray-500 mb-1">Companies</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="home" className="w-5 h-5" />
            {loading ? '…' : companyCount}
          </div>
        </div>
      </div>

      {/* 中部：趋势 + Top 公司 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* 趋势（占两列） */}
        <div className="lg:col-span-2 p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-trend">
          <div className="mb-3 text-sm font-medium">New Messages - Last 30 days</div>
          <UPlotChart
            data={uplotData}
            className="w-full"
            options={{ scales: { x: { time: true } } }}
            isDark={isDark}
            // 这里的 ts 为“秒”，显示时转回毫秒给 dayjs
            xTickFormatter={(ts) => dayjs(ts * 1000).format('MM-DD')}
          />
        </div>

        {/* Top 公司 */}
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-top">
          <div className="mb-3 text-sm font-medium">Top Companies</div>
          <NivoBar
            data={topBarData}
            height={240}
            isDark={isDark}
            onBarClick={(d) => {
              const company = d?.data?.company || d?.indexValue || ''
              if (company) nav(`/message?company=${encodeURIComponent(company)}`)
            }}
          />
        </div>
      </div>

      {/* 最近消息表 */}
      <div className="rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" data-guide="dash-recent">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 text-sm font-medium">Recent Messages</div>
        <div className="p-3">
          <DataTablePro
            columns={columns}
            data={sortedRecent}
            rowKey="id"
            density="compact"
            stickyHeader
            enableColumnResizing={false}
            sorting={recentSorting}
            onSortingChange={setRecentSorting}
          />
        </div>
      </div>
    </div>
  )
}
