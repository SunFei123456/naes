import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Icon from '../components/Icon';
import { useThemeStore } from '../stores/theme';
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
  const theme = useThemeStore(state => state.theme);
  const isEdit = Boolean(id);

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '', // 英文标题
    coverImageUrl: '', // 存储 Cloudinary URL 而不是文件对象
    publishTime: dayjs().format('YYYY-MM-DDTHH:mm'), // 默认为当前本地系统时间
    id: '', // 使用数字ID而不是article_id
    article_id: ''
  });
  
  // 文章内容状态 - 支持中英文
  const [content, setContent] = useState({
    zh: '',
    en: ''
  });
  
  // 当前编辑的语言
  const [currentLang, setCurrentLang] = useState('zh');
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 图片上传状态
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        title: article.title || '',
        titleEn: article.titleEn || '',
        coverImageUrl: article.cover_image_url || '', // 加载封面图片数据
        publishTime: article.publish_date ? dayjs(article.publish_date).format('YYYY-MM-DDTHH:mm') : dayjs().format('YYYY-MM-DDTHH:mm'),
        id: article.id, // 保存数字ID
        article_id: article.article_id || ''
      });
      setContent({
        zh: article.content || '',
        en: article.contentEn || ''
      });
    } catch (error) {
      console.error('加载文章失败:', error);
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理图片上传到 Cloudinary
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
      setFormData(prev => ({
        ...prev,
        coverImageUrl: result.secure_url
      }));
      
      setUploadProgress(100);
      
    } catch (error) {
      console.error('图片上传失败:', error);
      alert(`图片上传失败: ${error.message}`);
    } finally {
      setUploadingImage(false);
      // 3秒后隐藏进度条
      setTimeout(() => setUploadProgress(0), 3000);
    }
  };

  // 处理内容变化
  const handleContentChange = (value) => {
    setContent(prev => ({
      ...prev,
      [currentLang]: value || ''
    }));
  };

  // 编辑模式下的保存功能
  const handleEditSave = async () => {
    // 表单验证
    if (!formData.title.trim()) {
      alert('请输入中文标题');
      return;
    }
    
    if (!formData.titleEn.trim()) {
      alert('请输入英文标题');
      return;
    }
    
    if (!content.zh.trim()) {
      alert('请输入中文内容');
      return;
    }
    
    if (!content.en.trim()) {
      alert('请输入英文内容');
      return;
    }
    
    setLoading(true);
    try {
      const newsData = {
        title: formData.title,
        titleEn: formData.titleEn,
        cover_image_url: formData.coverImageUrl,
        content: content.zh,
        contentEn: content.en,
        publish_date: formData.publishTime ? dayjs(formData.publishTime).toISOString() : dayjs().toISOString()
        // 注意：这里不传递status，保持原有状态
      };
      
      await editNews(formData.id, newsData);
      alert('文章保存成功！');
      navigate('/news');
    } catch (error) {
      console.error('保存失败:', error);
      alert(`保存失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 保存草稿（仅新增模式使用）
  const handleSaveDraft = async () => {
    // 表单验证 - 草稿也需要所有字段
    if (!formData.title.trim()) {
      alert('请输入中文标题');
      return;
    }
    
    if (!formData.titleEn.trim()) {
      alert('请输入英文标题');
      return;
    }
    
    if (!formData.coverImageUrl.trim()) {
      alert('请上传首页配图');
      return;
    }
    
    if (!content.zh.trim()) {
      alert('请输入中文内容');
      return;
    }
    
    if (!content.en.trim()) {
      alert('请输入英文内容');
      return;
    }
    
    setLoading(true);
    try {
      const newsData = {
        title: formData.title,
        titleEn: formData.titleEn,
        cover_image_url: formData.coverImageUrl,
        content: content.zh,
        contentEn: content.en,
        status: 'draft',
        publish_date: formData.publishTime ? dayjs(formData.publishTime).toISOString() : dayjs().toISOString()
      };
      
      const result = await createNews(newsData);
      if (result.success) {
        alert('草稿保存成功！');
      } else {
        throw new Error(result.error?.cause || '保存失败');
      }
    } catch (error) {
      console.error('保存草稿失败:', error);
      alert(`保存草稿失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-4">
      {/* 返回按钮 */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/news')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Icon name="arrow-left" className="w-5 h-5" />
        </button>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧：基本信息表单 */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            基本信息
          </h2>
          
          <div className="space-y-4">
            {/* 文章标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                中文标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                placeholder="请输入中文标题"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                placeholder="Please enter English title"
              />
            </div>

            {/* 首页配图 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                首页配图 {!isEdit && <span className="text-red-500">*</span>}
                {isEdit && <span className="text-gray-500 text-xs ml-1">(可选)</span>}
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                {formData.coverImageUrl && (
                  <div className="mt-2">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 比例 */ }}>
                      <img
                        src={formData.coverImageUrl}
                        alt="封面预览"
                        className="absolute inset-0 w-full h-full object-cover rounded-md border"
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-green-600">✓ 图片上传成功</p>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: '' }))}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        删除图片
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 发布时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                发布时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.publishTime}
                onChange={(e) => handleInputChange('publishTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4">
              {isEdit ? (
                // 编辑模式：取消 + 保存
                <>
                  <button
                    onClick={() => navigate('/news')}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                </>
              ) : (
                // 新增模式：保存草稿 + 确认发布
                <>
                  <button
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '保存中...' : '保存草稿'}
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '发布中...' : '确认发布'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：文章内容编辑器 */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              文章内容 <span className="text-red-500">*</span>
            </h2>
            
            {/* 语言切换 */}
            <div className="flex bg-gray-100 dark:bg-zinc-700 rounded-md p-1">
              <button
                onClick={() => setCurrentLang('zh')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'zh'
                    ? 'bg-white dark:bg-zinc-600 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-3 py-1 text-sm rounded ${
                  currentLang === 'en'
                    ? 'bg-white dark:bg-zinc-600 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Markdown 编辑器 */}
          <div className="h-96">
            <MDEditor
              value={content[currentLang]}
              onChange={handleContentChange}
              height={384}
              data-color-mode={theme}
              visibleDragBar={false}
            />
          </div>
          
          {/* 内容提示 */}
          <div className="mt-2 text-sm text-gray-500">
            当前编辑: {currentLang === 'zh' ? '中文内容 (必填)' : '英文内容 (必填)'}
          </div>
        </div>
      </div>
    </div>
  );
}