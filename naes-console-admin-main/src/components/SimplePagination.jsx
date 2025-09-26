import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';

/**
 * 简洁分页器 - 类似截图样式
 * @param {number} current - 当前页码 (1-based)
 * @param {number} total - 总条数
 * @param {number} pageSize - 每页条数
 * @param {Function} onChange - 页码变化回调
 * @param {Function} onPageSizeChange - 每页条数变化回调
 */
export default function SimplePagination({
  current = 1,
  total = 0,
  pageSize = 10,
  onChange,
  onPageSizeChange,
  className = ''
}) {
  const { t } = useTranslation();
  const [jumpValue, setJumpValue] = useState('');
  
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 计算显示范围
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);
  
  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, current - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };
  
  // 处理页码点击
  const handlePageClick = (page) => {
    if (page !== current && page >= 1 && page <= totalPages) {
      onChange?.(page);
    }
  };
  
  // 处理快速跳转
  const handleJump = () => {
    const page = parseInt(jumpValue);
    if (page >= 1 && page <= totalPages) {
      handlePageClick(page);
      setJumpValue('');
    }
  };
  
  // 处理回车键跳转
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };
  
  if (total === 0) return null;
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-200 dark:border-zinc-700 ${className}`}>
      {/* 左侧：数据统计和每页条数 */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Icon name="list" className="w-4 h-4 text-blue-500" />
          <span className="font-medium">
            {startItem}-{endItem} of {total}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>显示</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>条/页</span>
        </div>
      </div>
      
      {/* 右侧：分页控制 */}
      <div className="flex items-center gap-3">
        {/* 快速跳转 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">跳转至</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-12 px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-center text-sm bg-white dark:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-gray-600 dark:text-gray-400">页</span>
        </div>
        
        {/* 分页导航 */}
        <div className="flex items-center gap-1">
          {/* 首页 */}
          <button
            onClick={() => handlePageClick(1)}
            disabled={current === 1}
            className={`
              px-2 py-1 text-sm rounded transition-colors
              ${current === 1
                ? 'text-gray-400 cursor-not-allowed dark:text-zinc-500'
                : 'text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700'
              }
            `}
          >
            首页
          </button>
          
          {/* 上一页 */}
          <button
            onClick={() => handlePageClick(current - 1)}
            disabled={current <= 1}
            className={`
              px-2 py-1 text-sm rounded transition-colors
              ${current <= 1
                ? 'text-gray-400 cursor-not-allowed dark:text-zinc-500'
                : 'text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700'
              }
            `}
          >
            上一页
          </button>
          
          {/* 页码 */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`
                px-3 py-1 text-sm rounded transition-all duration-200
                ${page === current
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700'
                }
              `}
            >
              {page}
            </button>
          ))}
          
          {/* 下一页 */}
          <button
            onClick={() => handlePageClick(current + 1)}
            disabled={current >= totalPages}
            className={`
              px-2 py-1 text-sm rounded transition-colors
              ${current >= totalPages
                ? 'text-gray-400 cursor-not-allowed dark:text-zinc-500'
                : 'text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700'
              }
            `}
          >
            下一页
          </button>
          
          {/* 尾页 */}
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={current === totalPages}
            className={`
              px-2 py-1 text-sm rounded transition-colors
              ${current === totalPages
                ? 'text-gray-400 cursor-not-allowed dark:text-zinc-500'
                : 'text-gray-600 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:bg-zinc-700'
              }
            `}
          >
            尾页
          </button>
        </div>
        
        {/* 页面信息 */}
        <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          第 {current} 页，共 {totalPages} 页
        </div>
      </div>
    </div>
  );
}