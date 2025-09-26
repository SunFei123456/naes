import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import newsbanner from '@/assets/images/news-banner.png';
import { useNewsList } from '@/hooks/useNews';
import { NewsItem } from '@/types/news';
import LoadingSpinner from '@/components/LoadingSpinner';

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { news, loading } = useNewsList();

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
              {t('news.title', 'News & Updates')}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t(
                'news.subtitle',
                'Stay updated with the latest news and developments from Nature Essential',
              )}
            </p>
          </div>

          {/* 加载状态 */}
          {loading && <LoadingSpinner className="py-12" />}

          {/* 新闻列表 */}
          {!loading &&
            news.map((item: NewsItem) => (
              <NewsCard
                key={item.article_id}
                item={item}
                language={i18n.language as 'zh' | 'en'}
              />
            ))}
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
            {item.title[language]}
          </h3>

          {/* 分割线 */}
          <div className="mb-6 h-px bg-gray-300 transition-colors duration-300 group-hover:bg-white/30"></div>

          {/* 描述 */}
          <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-white md:text-base">
            {item.description[language]}
          </p>

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
