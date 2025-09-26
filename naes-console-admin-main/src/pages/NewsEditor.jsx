import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { getNewsById, createNews, updateNews, editNews, fetchNewsDetail } from '../services/news';
import dayjs from 'dayjs';

export default function NewsEditor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    article_id: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 加载文章数据（编辑模式）
  useEffect(() => {
    if (isEdit) {
      loadArticle();
    }
  }, [id, isEdit]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const article = await fetchNewsDetail(id);
      setFormData({
        title: article.title,
        titleEn: article.titleEn,
        content: article.content,
        contentEn: article.contentEn,
        article_id: article.article_id
      });
    } catch (error) {
      console.error('加载文章失败:', error);
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  // 表单输入处理
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 保存文章
  const handleSave = async (status = 'draft') => {
    if (!formData.title.trim()) {
      alert('请输入中文标题');
      return;
    }
    
    if (!formData.titleEn.trim()) {
      alert('请输入英文标题');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('请输入中文内容');
      return;
    }
    
    if (!formData.contentEn.trim()) {
      alert('请输入英文内容');
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: formData.title,
        titleEn: formData.titleEn,
        content: formData.content,
        contentEn: formData.contentEn,
        status,
        publish_date: dayjs().toISOString() // 默认为当前系统时间
      };

      if (isEdit && formData.article_id) {
        await editNews(formData.article_id, data);
      } else {
        await createNews(data);
      }

      navigate('/news');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    navigate('/news');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Icon name="spinner" className="w-5 h-5 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon name="arrowLeft" className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? t('news.edit') : t('news.add')} - {t('news.editor.title')}
          </h1>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {t('news.editor.cancel')}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 text-gray-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Icon name="spinner" className="w-4 h-4 animate-spin" />
                保存中...
              </span>
            ) : (
              t('news.editor.saveDraft')
            )}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Icon name="spinner" className="w-4 h-4 animate-spin" />
                发布中...
              </span>
            ) : (
              t('news.editor.publish')
            )}
          </button>
        </div>
      </div>

      {/* 编辑表单 */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 space-y-6">
        {/* 中文标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            中文标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="请输入中文标题"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
          />
        </div>

        {/* 英文标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            英文标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.titleEn}
            onChange={(e) => handleInputChange('titleEn', e.target.value)}
            placeholder="Please enter English title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100"
          />
        </div>

        {/* 中文内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            中文内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="请输入中文内容"
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 resize-none"
          />
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            中文字数统计: {formData.content.length}
          </div>
        </div>

        {/* 英文内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            英文内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.contentEn}
            onChange={(e) => handleInputChange('contentEn', e.target.value)}
            placeholder="Please enter English content"
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 resize-none"
          />
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            English word count: {formData.contentEn.length}
          </div>
        </div>

        {/* 编辑提示 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">编辑说明：</p>
              <ul className="space-y-1 text-xs">
                <li>• 保存为草稿：文章将保存但不会发布，可以继续编辑</li>
                <li>• 发布文章：文章将立即发布并对外可见</li>
                <li>• 已发布的文章只能进行下架和删除操作，无法直接编辑</li>
                <li>• 下架后的文章状态将变为草稿，可以重新编辑</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}