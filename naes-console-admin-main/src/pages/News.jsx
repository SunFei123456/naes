import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DataTablePro from '../components/DataTablePro';
import SearchBarPro from '../components/SearchBarPro';
import ConfirmDialog from '../components/ConfirmDialog';
import SimplePagination from '../components/SimplePagination';
import Icon from '../components/Icon';
import { getNewsList, deleteNews, offlineNews } from '../services/news';

export default function News() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // 状态管理
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });
  const [sorting, setSorting] = useState([]);
  const [total, setTotal] = useState(0);
  
  // 搜索条件
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  
  // 确认对话框
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // 图片预览状态
  const [preview, setPreview] = useState({ open: false, url: '' });
  useEffect(() => {
    if (!preview.open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setPreview({ open: false, url: '' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview.open]);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams
      };
      
      console.log('请求参数:', params); // 调试信息
      const result = await getNewsList(params);
      console.log('API返回结果:', result); // 调试信息
      
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和依赖更新
  useEffect(() => {
    loadData();
  }, [pagination, searchParams]);

  // 搜索处理
  const handleSearch = (params) => {
    setSearchParams(params);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      startDate: '',
      endDate: '',
      status: ''
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 分页处理
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  // 每页条数变化处理
  const handlePageSizeChange = (pageSize) => {
    setPagination(prev => ({ 
      current: 1, 
      pageSize 
    }));
  };

  // 删除文章
  const handleDelete = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDialog({
      open: true,
      title: t('news.delete'),
      message: t('news.confirm.delete'),
      onConfirm: async () => {
        try {
          await deleteNews(record.article_id); // 使用 article_id 而不是 id
          loadData();
          setConfirmDialog({ open: false });
        } catch (error) {
          console.error('删除失败:', error);
          alert('删除失败，请重试');
        }
      }
    });
  };

  // 下架文章
  const handleOffline = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDialog({
      open: true,
      title: t('news.offline'),
      message: t('news.confirm.offline'),
      onConfirm: async () => {
        try {
          await offlineNews(record.article_id); // 使用 article_id 而不是 id
          loadData();
          setConfirmDialog({ open: false });
        } catch (error) {
          console.error('下架失败:', error);
          alert('下架失败，请重试');
        }
      }
    });
  };

  // 编辑文章
  const handleEdit = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/news/edit/${record.article_id}`); // 使用 article_id 而不是 id
  };

  // 新增文章
  const handleAdd = () => {
    navigate('/news/add');
  };

  // 表格列配置
  const columns = useMemo(() => [
    {
      key: 'article_id',
      title: '文章ID',
      dataIndex: 'article_id',
      width: 200,
      enableSorting: false,
      render: (value) => (
        <div className="truncate max-w-xs font-mono text-xs" title={value}>
          {value || '-'}
        </div>
      )
    },
    {
      key: 'title',
      title: t('news.articleTitle'),
      dataIndex: 'title',
      width: 300,
      align: 'left',
      enableSorting: false,
      render: (value, record) => (
        <div className="space-y-1">
          <div className="truncate max-w-sm font-medium" title={record.title}>
            中文: {record.title || '-'}
          </div>
          <div className="truncate max-w-sm text-sm text-gray-500" title={record.titleEn}>
            English: {record.titleEn || '-'}
          </div>
        </div>
      )
    },
    {
      key: 'cover_image_url',
      title: '封面图',
      dataIndex: 'cover_image_url',
      width: 120,
      enableSorting: false,
      render: (value) => (
        <div className="flex justify-center">
          {value ? (
            <img
              src={value}
              alt="封面图"
              title="点击预览"
              className="w-16 h-12 object-cover rounded border cursor-zoom-in"
              onClick={() => setPreview({ open: true, url: value })}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <div
            className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center text-xs text-gray-400"
            style={{ display: value ? 'none' : 'flex' }}
          >
            无图片
          </div>
        </div>
      )
    },
    {
      key: 'publishTime',
      title: t('news.publishTime'),
      dataIndex: 'publishTime',
      width: 180,
      enableSorting: true,
      render: (value) => value || '-'
    },
    {
      key: 'readCount',
      title: t('news.readCount'),
      dataIndex: 'readCount',
      width: 100,
      enableSorting: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'status',
      title: t('news.status'),
      dataIndex: 'status',
      width: 120,
      enableSorting: false,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'published' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {value === 'published' ? t('news.publish') : t('news.draft')}
        </span>
      )
    },
    {
      key: 'operation',
      title: t('news.operation'),
      width: 200,
      enableSorting: false,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.status === 'published' ? (
            <>
              <button
                type="button"
                onClick={(e) => handleOffline(e, record)}
                className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
              >
                {t('news.offline')}
              </button>
              <button
                type="button"
                disabled
                className="px-2 py-1 text-xs bg-gray-100 text-gray-400 rounded cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
              >
                {t('news.edit')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="px-2 py-1 text-xs bg-gray-100 text-gray-400 rounded cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
              >
                {t('news.offline')}
              </button>
              <button
                type="button"
                onClick={(e) => handleEdit(e, record)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                {t('news.edit')}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={(e) => handleDelete(e, record)}
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
          >
            {t('news.delete')}
          </button>
        </div>
      )
    }
  ], [t, pagination, handleEdit, handleDelete, handleOffline]);

  // 搜索表单配置
  const searchFields = [
    {
      key: 'keyword',
      type: 'text',
      label: t('search.keyword'),
      placeholder: '请输入关键词'
    },
    {
      key: 'startDate',
      type: 'date',
      label: '开始日期'
    },
    {
      key: 'endDate',
      type: 'date',
      label: '结束日期'
    },
    {
      key: 'status',
      type: 'select',
      label: t('news.status'),
      options: [
        { value: '', label: '全部' },
        { value: 'published', label: t('news.publish') },
        { value: 'draft', label: t('news.draft') }
      ]
    }
  ];

  return (
    <div>
      {/* 搜索栏 */}
      <SearchBarPro
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        initialValues={searchParams}
        extraActions={
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            <Icon name="plus" className="w-4 h-4" />
            {t('news.add')}
          </button>
        }
      />

      {/* 数据表格 */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
        <DataTablePro
          columns={columns}
          data={data}
          loading={loading}
          sorting={sorting}
          onSortingChange={setSorting}
          enableColumnResizing={false}
          emptyText="暂无新闻数据"
        />
        
        {/* 分页器 */}
        {!loading && data.length > 0 && (
          <SimplePagination
            current={pagination.current}
            total={total}
            pageSize={pagination.pageSize}
            onChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* 图片预览弹层 */}
      {preview.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setPreview({ open: false, url: '' })}
          />
          {/* 图片容器 */}
          <div className="relative z-10 max-w-[90vw] max-h-[85vh] p-2 bg-white/5 rounded">
            <img
              src={preview.url}
              alt="封面预览"
              className="max-w-[88vw] max-h-[80vh] object-contain rounded shadow-lg"
            />
            <button
              className="absolute -top-3 -right-3 bg-white text-gray-700 rounded-full shadow p-1 hover:bg-gray-100"
              aria-label="关闭"
              onClick={() => setPreview({ open: false, url: '' })}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 确认对话框 */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ open: false })}
      />
    </div>
  );
}