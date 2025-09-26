import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Icon from '../components/Icon';
import { useThemeStore } from '../stores/theme';

// Cloudinary 配置
// 请在 Cloudinary 控制台获取以下信息：
// 1. cloud_name: 在控制台首页可以找到
// 2. upload_preset: 需要创建一个 unsigned upload preset
//    在 Settings > Upload > Upload presets 中创建
const CLOUDINARY_CONFIG = {
  cloud_name: 'dazdjqzwd', // 请替换为您的 cloud_name
  upload_preset: 'nase-console' // 原始 preset，修改为 unsigned 模式
};

export default function NewsAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useThemeStore(state => state.theme);
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImageUrl: '', // 存储 Cloudinary URL 而不是文件对象
    publisher: '',
    publishTime: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
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

  // 保存草稿
  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // 这里调用保存草稿的API
      console.log('保存草稿:', {
        ...formData,
        content,
        status: 'draft'
      });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('草稿保存成功！');
    } catch (error) {
      console.error('保存草稿失败:', error);
      alert('保存草稿失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 确认发布
  const handlePublish = async () => {
    // 表单验证
    if (!formData.title.trim()) {
      alert('请输入文章标题');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('请输入文章描述');
      return;
    }
    
    if (!content.zh.trim() && !content.en.trim()) {
      alert('请输入文章内容');
      return;
    }
    
    setLoading(true);
    try {
      // 这里调用发布文章的API
      console.log('发布文章:', {
        ...formData,
        content,
        status: 'published'
      });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('文章发布成功！');
      navigate('/news');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

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
                文章标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                placeholder="请输入文章标题"
              />
            </div>

            {/* 文章描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文章描述 * (最多300字)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={300}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white resize-none"
                placeholder="请输入文章描述，最多300字"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.description.length}/300
              </div>
            </div>

            {/* 首页配图 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                首页配图
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

            {/* 发布人 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                发布人
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => handleInputChange('publisher', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                placeholder="请输入发布人姓名"
              />
            </div>

            {/* 发布时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                发布时间
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
            </div>
          </div>
        </div>

        {/* 右侧：文章内容编辑器 */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              文章内容
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
            当前编辑: {currentLang === 'zh' ? '中文内容' : '英文内容'}
          </div>
        </div>
      </div>
    </div>
  );
}