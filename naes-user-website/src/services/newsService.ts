import { api } from '@/services/api';
import {
  NewsListResponse,
  NewsDetailResponse,
  NewsListParams,
  ComponentPagination,
} from '@/types/news';

// API 服务函数
export const newsService = {
  // 获取新闻列表 - GET /api/news/list
  async getNewsList(params: NewsListParams = {}): Promise<{
    code: number;
    message: string;
    data: {
      list: any[];
      pagination: ComponentPagination;
    };
  }> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams({
        pageNo: String(params.pageNo || 1),
        pageSize: String(params.pageSize || 5),
        lang: params.lang || 'zh-CN',
      });
      
      const response: NewsListResponse = await api.get(`/news/list?${queryParams}`);
      
      // 转换为组件需要的格式
      return {
        code: response.code,
        message: response.message,
        data: {
          list: response.data,
          pagination: {
            currentPage: response.page.pageNo,
            pageSize: response.page.pageSize,
            totalItems: response.page.totalSize,
            totalPages: response.page.totalPage,
          },
        },
      };
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      throw error;
    }
  },

  // 获取新闻详情 - GET /api/news/{article_id}
  async getNewsDetail(articleId: string, lang: 'zh-CN' | 'en-US' = 'zh-CN'): Promise<NewsDetailResponse> {
    try {
      const queryParams = new URLSearchParams({ lang });
      const response: NewsDetailResponse = await api.get(`/news/${articleId}?${queryParams}`);
      return response;
    } catch (error) {
      console.error('获取新闻详情失败:', error);
      throw error;
    }
  },
};
