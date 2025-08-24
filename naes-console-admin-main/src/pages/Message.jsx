import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import DataTablePro from '../components/DataTablePro';
import { SkeletonTable, SkeletonLine } from '../components/Skeleton';
import Icon from '../components/Icon';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchMessagePage } from '../services/message';
import { loadingBegin, loadingEnd, useLoadingStore } from '../stores/loading';
import { useLocation } from 'react-router-dom';

export default function Message() {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  // 默认时间倒序排序（最新在前）
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
  const [density, setDensity] = useState('default'); // 'default' | 'compact'
  const [columnVisibility, setColumnVisibility] = useState({});
  const listLoading = useLoadingStore(s => Boolean(s.pendingCount['list']));

  const [detailOpen, setDetailOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const location = useLocation();

  const columns = useMemo(() => ([
    { key: 'name', title: t('message.name'), dataIndex: 'name' },
    { key: 'email', title: t('message.email'), dataIndex: 'email' },
    { key: 'createdAt', title: t('message.createdAt'), dataIndex: 'createdAt', render: v => dayjs(v).format('YYYY-MM-DD HH:mm') },
  ]), [t])

  // 统一获取当前排序参数
  const getSortParams = () => {
    const s = sorting && sorting.length > 0 ? sorting[0] : null
    return {
      sortField: s?.id || '',
      sortOrder: s?.desc ? 'desc' : (s ? 'asc' : ''),
    }
  }

  // 初始化列可见性（默认全部可见）
  useEffect(() => {
    const next = {};
    columns.forEach(c => { next[c.key] = true; });
    setColumnVisibility(prev => ({ ...next, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length])

  const runSearch = async (_page = 1, _pageSize = pageSize, sortField = '', sortOrder = '', kwOverride) => {
    loadingBegin('list');
    const { list, total } = await fetchMessagePage({ 
      page: _page, 
      pageSize: _pageSize, 
      keyword: kwOverride !== undefined ? kwOverride : keyword, 
      startAt, 
      endAt,
      sortField,
      sortOrder
    });
    // 前端排序：由于后端暂未提供排序能力，这里根据 sorting 条件对 list 进行排序
    let next = Array.isArray(list) ? [...list] : []
    if (sortField) {
      next.sort((a, b) => {
        let av = a?.[sortField]
        let bv = b?.[sortField]
        // 日期字段
        if (sortField.toLowerCase().includes('at') || sortField.toLowerCase().includes('time') || sortField.toLowerCase().includes('date')) {
          av = av ? new Date(av).getTime() : 0
          bv = bv ? new Date(bv).getTime() : 0
        } else {
          // 字符串统一小写比较
          if (typeof av === 'string') av = av.toLowerCase()
          if (typeof bv === 'string') bv = bv.toLowerCase()
        }
        if (av < bv) return sortOrder === 'asc' ? -1 : 1
        if (av > bv) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    } else {
      // 无显式排序字段时，默认按 createdAt 倒序（最新在前）
      next.sort((a, b) => {
        const at = a?.createdAt ? new Date(a.createdAt).getTime() : 0
        const bt = b?.createdAt ? new Date(b.createdAt).getTime() : 0
        return bt - at
      })
    }
    setList(next);
    setTotal(total);
    setPage(_page);
    setPageSize(_pageSize);
    loadingEnd('list', 400);
  };

  // 处理排序变化
  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      runSearch(1, pageSize, id, desc ? 'desc' : 'asc');
    } else {
      runSearch(1, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  // 初次加载 + 侦听 URL 查询参数 company
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const company = params.get('company');
    if (company) {
      if (company !== keyword) setKeyword(company);
      const { sortField, sortOrder } = getSortParams()
      runSearch(1, pageSize, sortField, sortOrder, company);
    } else {
      const { sortField, sortOrder } = getSortParams()
      runSearch(1, pageSize, sortField, sortOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const onReset = () => {
    setKeyword('')
    setStartAt('')
    setEndAt('')
    const { sortField, sortOrder } = getSortParams()
    runSearch(1, pageSize, sortField, sortOrder)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="container-page h-full flex flex-col min-h-0">
      <PageHeader title={t('message.title')} />

      <div className="mb-4">
        <SearchBar
          keyword={keyword} setKeyword={setKeyword}
          startAt={startAt} setStartAt={setStartAt}
          endAt={endAt} setEndAt={setEndAt}
          onSearch={() => {
            const { sortField, sortOrder } = getSortParams()
            runSearch(1, pageSize, sortField, sortOrder)
          }}
          onReset={onReset}
        />
      </div>

      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {listLoading ? (
          <SkeletonLine width={120} height={14} />
        ) : (
          `Total: ${total}`
        )}
      </div>

      {/* 表格区域：占满剩余空间并在内部滚动 */}
      <div className="flex-1 min-h-0 relative">
        <DataTablePro
          columns={columns}
          data={list}
          rowKey="id"
          loading={listLoading}
          onRowClick={(row) => { setCurrent(row); setDetailOpen(true); }}
          className="h-full border border-gray-200 dark:border-zinc-800 rounded"
          pagination={{
            pageIndex: page - 1,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
          }}
          onPaginationChange={(updater) => {
            const newPagination = typeof updater === 'function' 
              ? updater({ pageIndex: page - 1, pageSize }) 
              : updater;
            const { sortField, sortOrder } = getSortParams()
            runSearch(newPagination.pageIndex + 1, newPagination.pageSize, sortField, sortOrder);
          }}
          sorting={sorting}
          onSortingChange={setSorting}
          enableColumnResizing={true}
          stickyHeader={true}
          density={density}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>

      {/* 底部工具栏：总数 + 分页 + 页大小 + 密度切换 + 列控制 */}
      <div className="mt-3 flex items-center justify-between gap-3">
        {/* 左侧：总数 */}
        <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px]">
          {listLoading ? (
            <SkeletonLine width={120} height={14} />
          ) : (
            `Total: ${total}`
          )}
        </div>

        {/* 中间：分页 */}
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-1 disabled:opacity-50" disabled={page <= 1} onClick={() => runSearch(page - 1, pageSize)}>
            <Icon name="chevronLeft" className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <span className="text-sm">{page} / {totalPages}</span>
          <button className="px-2 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-1 disabled:opacity-50" disabled={page >= totalPages} onClick={() => runSearch(page + 1, pageSize)}>
            <span>Next</span>
            <Icon name="chevronRight" className="w-4 h-4" />
          </button>
          <select
            className="ml-2 px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={pageSize}
            onChange={e => runSearch(1, Number(e.target.value))}
          >
            {[10,20,50,100].map(sz => (
              <option
                key={sz}
                value={sz}
                className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-200"
              >
                {sz}/page
              </option>
            ))}
          </select>
        </div>

        {/* 右侧：密度切换（已移除 Columns 按钮） */}
        <div className="relative flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border dark:border-zinc-700 text-sm inline-flex items-center gap-1"
            onClick={() => setDensity(density === 'default' ? 'compact' : 'default')}
            title="Density"
          >
            <Icon name="list" className="w-3.5 h-3.5" />
            <span>{density === 'default' ? 'Density: Default' : 'Density: Compact'}</span>
          </button>
        </div>
      </div>

      {/* 详情弹窗，字段顺序：name+email+submit_at -> others -> message(置底) */}
      <ConfirmDialog
        open={detailOpen}
        title={current ? `${current.name} <${current.email}>` : ''}
        onOk={() => setDetailOpen(false)}
        onCancel={() => setDetailOpen(false)}
        okText={t('common.ok')}
        cancelText={t('common.cancel')}
      >
        {current && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('message.createdAt')}: {dayjs(current.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>company: {current.company || '-'}</div>
              <div>phone: {current.phone || '-'}</div>
              <div>whatsapp: {current.whatsapp || '-'}</div>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800">
              <div className="text-sm font-medium mb-1">message</div>
              <div className="whitespace-pre-wrap break-words text-sm leading-6">{current.message}</div>
            </div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  )
}
