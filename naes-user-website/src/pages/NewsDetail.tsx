import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { newsService } from '@/services/newsService';
import { NewsDetailResponse } from '@/types/news';
import LoadingSpinner from '@/components/LoadingSpinner';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const NewsDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const [newsDetail, setNewsDetail] = useState<NewsDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await newsService.getNewsDetail(id);
        if (response.code === 200) {
          setNewsDetail(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch news detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const language = i18n.language as 'zh' | 'en';
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner className="py-12" />
        </div>
      </Layout>
    );
  }

  if (!newsDetail) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
            <button
              onClick={() => navigate('/news')}
              className="px-4 py-2 bg-[#12994f] text-white rounded hover:bg-[#0f7a3c]"
            >
              返回新闻列表
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const language = i18n.language as 'zh' | 'en';
  const content = newsDetail[language];

  return (
    <Layout>
      <div className="mt-header h-[60px] w-full "></div>
      <Breadcrumbs newsTitle={content.title} />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
            {/* 文章头部信息 */}
            <header className="px-8 pt-12 pb-8 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
              {content.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {language === 'zh' ? '发布时间：' : 'Published: '}
                {formatDate(newsDetail.publish_details.publish_date)}
              </div>
              
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {language === 'zh' ? '阅读量：' : 'Views: '}
                {newsDetail.publish_details.view_count.toLocaleString()}
              </div>
              
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                {language === 'zh' ? '发布者：' : 'Publisher: '}
                {newsDetail.publish_details.publisher}
              </div>
            </div>
          </header>

            {/* 文章内容 */}
            <article className="px-8 py-8">
              <MarkdownRenderer 
                content={content.body}
                className="text-gray-700 leading-relaxed"
              />
            </article>

            {/* 返回按钮 */}
            <div className="px-8 pb-12 pt-8 border-t border-gray-100">
              <button
                onClick={() => navigate('/news')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {language === 'zh' ? '返回新闻列表' : 'Back to News'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;