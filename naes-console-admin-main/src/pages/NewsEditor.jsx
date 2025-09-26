import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { getNewsById, createNews, updateNews, editNews, fetchNewsDetail } from '../services/news';
import dayjs from 'dayjs';

// Cloudinary 配置（与 NewsAdd.jsx 保持一致）
const CLOUDINARY_CONFIG = {
  cloud_name: 'dazdjqzwd', // 与 NewsAdd.jsx 相同的配置
  upload_preset: 'nase-console' // 与 NewsAdd.jsx 相同的配置
};

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
    cover_image_url: '', // 添加封面图片字段
    id: '', // 使用数字ID而不是article_id
    article_id: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // 图片上传状态
  const [uploadProgress, setUploadProgress] = useState(0); // 上传进度

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
      console.log('加载的文章数据:', article); // 调试信息
      setFormData({
        title: article.title || '',
        titleEn: article.titleEn || '',
        content: article.content || '',
        contentEn: article.contentEn || '',
        cover_image_url: article.cover_image_url || '', // 加载封面图片数据
        id: article.id, // 保存数字ID
        article_id: article.article_id || ''
      });
      console.log('设置的表单数据:', {
        title: article.title || '',
        titleEn: article.titleEn || '',
        content: article.content || '',
        contentEn: article.contentEn || '',
        cover_image_url: article.cover_image_url || '',
        id: article.id,
        article_id: article.article_id || ''
      }); // 调试信息
    } catch (error) {
      console.error('加载文章失败:', error);
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  // 图片上传处理（参考 NewsAdd.jsx 的实现）
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    
    // 验证文件大小 (限制为 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件大小不能超过 10MB');
      return;
    }
    
    setUploadingImage(true);
    setUploadProgress(0);
    
    try {
      // 创建 FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      
      // 上传到 Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
        {
          method: 'POST',
          body: uploadFormData,
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        // 如果有错误信息，显示详细错误
        const errorMessage = result.error?.message || result.message || `HTTP ${response.status}`;
        throw new Error(`上传失败: ${errorMessage}`);
      }
      
      // 保存 Cloudinary URL
      handleInputChange('cover_image_url', result.secure_url);
      
      setUploadProgress(100);
      alert('图片上传成功！');
      
    } catch (error) {
      console.error('图片上传失败:', error);
      alert(`图片上传失败: ${error.message}`);
    } finally {
      setUploadingImage(false);
      // 3秒后隐藏进度条
      setTimeout(() => setUploadProgress(0), 3000);
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
    
    // 编辑模式下，封面图片不是必须的（可能已经有了）
    // 新增模式下，封面图片是必须的
    if (!isEdit && !formData.cover_image_url.trim()) {
      alert('请上传封面图片');
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
        cover_image_url: formData.cover_image_url, // 添加封面图片
        content: formData.content,
        contentEn: formData.contentEn,
        status,
        publish_date: dayjs().toISOString() // 默认为当前系统时间
      };

      if (isEdit && formData.id) {
        await editNews(formData.id, data);
        alert('文章更新成功！');
      } else {
        await createNews(data);
        alert('文章创建成功！');
      }

      navigate('/news');
    } catch (error) {
      console.error('保存失败:', error);
      alert(`保存失败: ${error.message || '请重试'}`);
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

        {/* 封面图片 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            封面图片 {!isEdit && <span className="text-red-500">*</span>}
            {isEdit && <span className="text-gray-500 text-xs ml-1">(可选)</span>}
          </label>
          
          {/* 图片预览区域 */}
          <div className="space-y-3">
            {/* 文件上传 */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {/* 上传进度条 */}
            {uploadingImage && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            {/* 上传状态文字 */}
            {uploadingImage && (
              <p className="text-sm text-blue-600">正在上传图片...</p>
            )}
            
            {/* 图片预览 */}
            {formData.cover_image_url && (
              <div className="space-y-2">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 比例 */ }}>
                  <img
                    src={formData.cover_image_url}
                    alt="封面图预览"
                    className="absolute inset-0 w-full h-full object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="absolute inset-0 w-full h-full bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center text-sm text-gray-400"
                    style={{ display: 'none' }}
                  >
                    图片加载失败
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-green-600">✓ 图片上传成功</p>
                  <button
                    type="button"
                    onClick={() => handleInputChange('cover_image_url', '')}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    删除图片
                  </button>
                </div>
              </div>
            )}
          </div>
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
      </div>

      {/* 右侧悬浮编辑提示 */}
      <div className="fixed top-1/3 right-6 transform -translate-y-1/2 z-40 w-72">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <Icon name="info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-2">编辑说明：</p>
              <ul className="space-y-1.5 text-xs leading-relaxed">
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