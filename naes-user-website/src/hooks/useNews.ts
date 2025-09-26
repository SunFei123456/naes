import { useState, useEffect } from 'react';
import { NewsItem, NewsListParams } from '@/types/news';
import { newsService } from '@/services/newsService';

export const useNewsList = (params: NewsListParams = {}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsService.getNewsList({
        page: 1,
        pageSize: 10,
        status: 1, // 默认只获取已发布的新闻
        ...params
      });
      
      if (response.code === 200) {
        setNews(response.data.list);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { news, loading, pagination, refetch: fetchNews };
};