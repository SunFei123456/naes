import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DataTablePro from '../components/DataTablePro';
import SearchBarPro from '../components/SearchBarPro';
import ConfirmDialog from '../components/ConfirmDialog';
import SimplePagination from '../components/SimplePagination';
import Icon from '../components/Icon';
import { getNewsList, deleteNews, offlineNews } from '../mocks/news';

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

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams
      };
      
      const result = await getNewsList(params);
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
  const handleDelete = (record) => {
    setConfirmDialog({
      open: true,
      title: t('news.delete'),
      message: t('news.confirm.delete'),
      onConfirm: async () => {
        try {
          await deleteNews(record.id);
          loadData();
          setConfirmDialog({ open: false });
        } catch (error) {
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 下架文章
  const handleOffline = (record) => {
    setConfirmDialog({
      open: true,
      title: t('news.offline'),
      message: t('news.confirm.offline'),
      onConfirm: async () => {
        try {
          await offlineNews(record.id);
          loadData();
          setConfirmDialog({ open: false });
        } catch (error) {
          console.error('下架失败:', error);
        }
      }
    });
  };

  // 编辑文章
  const handleEdit = (record) => {
    navigate(`/news/edit/${record.id}`);
  };

  // 新增文章
  const handleAdd = () => {
    navigate('/news/add');
  };

  // 表格列配置
  const columns = useMemo(() => [
    {
      key: 'sequence',
      title: t('news.sequence'),
      dataIndex: 'id',
      width: 80,
      enableSorting: false,
      render: (value, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      }
    },
    {
      key: 'title',
      title: t('news.articleTitle'),
      dataIndex: 'title',
      width: 300,
      align: 'left',
      enableSorting: false,
      render: (value) => (
        <div className="truncate max-w-xs" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'publisher',
      title: t('news.publisher'),
      dataIndex: 'publisher',
      width: 120,
      enableSorting: false,
      render: (value) => value || '-'
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
                onClick={() => handleOffline(record)}
                className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
              >
                {t('news.offline')}
              </button>
              <button
                disabled
                className="px-2 py-1 text-xs bg-gray-100 text-gray-400 rounded cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
              >
                {t('news.edit')}
              </button>
            </>
          ) : (
            <>
              <button
                disabled
                className="px-2 py-1 text-xs bg-gray-100 text-gray-400 rounded cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
              >
                {t('news.offline')}
              </button>
              <button
                onClick={() => handleEdit(record)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                {t('news.edit')}
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(record)}
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
    <div className="space-y-4">
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