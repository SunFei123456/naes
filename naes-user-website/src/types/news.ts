// 新闻相关类型定义
export interface NewsItem {
  article_id: string;
  cover_image_url?: string;
  title: string; // 直接是字符串，不是多语言对象
  description: string; // 直接是字符串，不是多语言对象
  publish_date: string;
}

// API 响应的分页信息
export interface ApiPagination {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
}

// 新闻列表响应类型
export interface NewsListResponse {
  code: number;
  message: string;
  data: NewsItem[];
  page: ApiPagination;
}

// 用于组件的分页信息（保持与原有组件兼容）
export interface ComponentPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 新闻详情响应类型
export interface NewsDetailResponse {
  code: number;
  message: string;
  data: {
    article_id: string;
    title: string;
    body: string; // Markdown 内容
    cover_image_url?: string;
    publish_date: string;
    view_count?: number;
  };
}

// 新闻列表查询参数
export interface NewsListParams {
  pageNo?: number;
  pageSize?: number;
  lang?: 'zh-CN' | 'en-US';
}