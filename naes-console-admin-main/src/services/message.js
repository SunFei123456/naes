import http from './http'
import dayjs from 'dayjs'

// 后端分页查询 /naes/console/message/page
// 参数：page, pageSize, keyword(映射为 name 模糊), startAt, endAt, sortField, sortOrder
export async function fetchMessagePage({
  page = 1,
  pageSize = 20,
  keyword = '',
  startAt,
  endAt
} = {}) {
  // 将 UI 的 keyword 映射为后端的 name 模糊检索
  // 将日期转换为后端要求的 ISO8601(UTC, 带 Z)，且起止分别取当天 00:00:00.000 和 23:59:59.999
  const params = {
    pageNo: page,
    pageSize,
    name: keyword || undefined,
    startTime: startAt ? dayjs(startAt).startOf('day').toISOString() : undefined,
    endTime: endAt ? dayjs(endAt).endOf('day').toISOString() : undefined
  }

  const resp = await http.get('/naes/console/message/page', {
    params,
    loadingKey: 'list'
  })
  const root = resp?.data ?? {}
  const wrapped = root?.data ?? root
  const pageInfo = root?.page || {}

  // 兼容不同字段名：submit_at -> createdAt
  let rawList
  if (Array.isArray(wrapped)) {
    rawList = wrapped
  } else {
    rawList = wrapped?.list || wrapped?.records || wrapped?.data || []
  }
  const list = (rawList || []).map(item => ({
    ...item,
    createdAt: item.createdAt || item.submit_at || item.submitAt || item.created_at
  }))
  const total = pageInfo?.totalSize ?? wrapped?.total ?? wrapped?.count ?? list.length
  const currentPage = pageInfo?.pageNo ?? page
  const currentSize = pageInfo?.pageSize ?? pageSize
  return { list, total, page: currentPage, pageSize: currentSize }
}
