import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';

/**
 * 通用搜索栏组件
 * @param {Array} fields - 搜索字段配置
 * @param {Function} onSearch - 搜索回调
 * @param {Function} onReset - 重置回调
 * @param {Object} initialValues - 初始值
 * @param {React.ReactNode} extraActions - 额外的操作按钮
 */
export default function SearchBarPro({ fields = [], onSearch, onReset, initialValues = {}, extraActions }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialValues);

  // 同步外部初始值变化
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // 处理输入变化
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 处理搜索
  const handleSearch = () => {
    onSearch?.(formData);
  };

  // 处理重置
  const handleReset = () => {
    const resetData = {};
    fields.forEach(field => {
      resetData[field.key] = '';
    });
    setFormData(resetData);
    onReset?.(resetData);
  };

  // 渲染字段
  const renderField = (field) => {
    const { key, type, label, placeholder, options } = field;
    const value = formData[key] || '';

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            placeholder={placeholder}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
        {fields.map(field => (
          <div key={field.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        {/* 操作按钮 */}
        <div className="flex gap-2 md:col-span-2 lg:col-span-4 xl:col-span-2 justify-end">
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Icon name="search" className="w-4 h-4" />
            {t('common.search')}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Icon name="close" className="w-4 h-4" />
            {t('common.reset')}
          </button>
          {extraActions}
        </div>
      </div>
    </div>
  );
}