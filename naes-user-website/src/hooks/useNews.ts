import { useState, useEffect } from 'react';
import { NewsItem, NewsListParams } from '@/types/news';
import { newsService } from '@/services/newsService';
import { useTranslation } from 'react-i18next';

export const useNewsList = (params: NewsListParams = {}) => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      // 根据当前语言设置 lang 参数
      const lang = i18n.language === 'en' ? 'en-US' : 'zh-CN';
      
      const response = await newsService.getNewsList({
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 5,
        lang,
        ...params
      });
      
      if (response.code === 0) { // API 返回 code: 0 表示成功
        setNews(response.data.list);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      // 在实际部署时，可以添加错误处理逻辑
      setNews([]);
      setPagination({
        currentPage: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [params.pageNo, params.pageSize, i18n.language]); // 添加语言变化的监听

  return { news, loading, pagination, refetch: fetchNews };
};