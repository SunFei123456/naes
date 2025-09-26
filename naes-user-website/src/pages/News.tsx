import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import newsbanner from '@/assets/images/news-banner.png';
import { useNewsList } from '@/hooks/useNews';
import { NewsItem } from '@/types/news';
import LoadingSpinner from '@/components/LoadingSpinner';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { news, loading, pagination } = useNewsList({ 
    pageNo: currentPage, 
    pageSize: 5 
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="mt-header h-[300px] w-full bg-cover bg-bottom md:h-[320px]"
        style={{
          backgroundImage: `url(${newsbanner})`,
          backgroundPosition: 'center 32%',
        }}
      ></div>
      <Breadcrumbs />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              {i18n.language === 'zh' ? '新闻动态' : 'News & Updates'}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {i18n.language === 'zh' 
                ? '了解来自天然必需品的最新新闻和发展动态'
                : 'Stay updated with the latest news and developments from Nature Essential'
              }
            </p>
          </div>

          {/* 加载状态 */}
          {loading && <LoadingSpinner className="py-12" />}

          {/* 新闻列表 */}
          {!loading && news.length > 0 &&
            news.map((item: NewsItem) => (
              <NewsCard
                key={item.article_id}
                item={item}
                language={i18n.language as 'zh' | 'en'}
              />
            ))}
          
          {/* 空状态 */}
          {!loading && news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {i18n.language === 'zh' ? '暂无新闻内容' : 'No news available'}
              </p>
            </div>
          )}
          
          {/* 分页组件 */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {/* 上一页按钮 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i18n.language === 'zh' ? '上一页' : 'Previous'}
                </button>
                
                {/* 页码按钮 */}
                {Array.from({ length: pagination.totalPages }, (_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-[#12994f] text-white border-[#12994f]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {/* 下一页按钮 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i18n.language === 'zh' ? '下一页' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 新闻卡片组件
interface NewsCardProps {
  item: NewsItem;
  language: 'zh' | 'en';
}

const NewsCard: React.FC<NewsCardProps> = ({ item, language }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 截断描述内容到150字符
  const truncatedDescription = item.description.length > 150 
    ? item.description.substring(0, 150) + '...' 
    : item.description;

  return (
    <div className="group mb-12 bg-[#eef2f5] p-6 transition-all duration-300 hover:bg-[#12994f]">
      <div className="flex flex-col md:flex-row">
        {/* 左侧图片区域 */}
        <div className="overflow-hidden md:w-1/3 lg:w-1/4">
          <div
            className="h-56 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 md:h-full"
            style={{
              backgroundImage: `url(${item.cover_image_url})`,
              backgroundColor: '#f3f4f6', // 备用背景色
            }}
          ></div>
        </div>

        {/* 右侧内容区域 */}
        <div className="pl-8 md:w-2/3 lg:w-3/4">
          {/* 标题 */}
          <h3 className="mb-6 text-xl font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-white md:text-2xl">
            {item.title}
          </h3>

          {/* 分割线 */}
          <div className="mb-6 h-px bg-gray-300 transition-colors duration-300 group-hover:bg-white/30"></div>

          {/* 描述 */}
          <div className="mb-8 text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-white md:text-base">
            <MarkdownRenderer 
              content={truncatedDescription}
              className="line-clamp-3 [&_*]:text-gray-600 group-hover:[&_*]:text-white [&_*]:transition-colors [&_*]:duration-300"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center text-sm text-gray-500 transition-colors duration-300 group-hover:text-white">
              <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {language === 'zh' ? '日期: ' : 'Date: '}
              {formatDate(item.publish_date)}
            </div>
            <Link
              to={`/news/${item.article_id}`}
              className="text-sm font-medium text-blue-600 transition-colors duration-300 hover:underline group-hover:text-white"
            >
              {language === 'zh' ? '更多' : 'Read More'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
