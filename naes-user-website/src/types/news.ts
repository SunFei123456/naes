// 新闻相关类型定义
export interface NewsItem {
  article_id: string;
  cover_image_url?: string;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  publish_date: string;
}

export interface NewsListResponse {
  code: number;
  message: string;
  data: {
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
    list: NewsItem[];
  };
}

export interface NewsDetailResponse {
  code: number;
  message: string;
  data: {
    article_id: string;
    publish_details: {
      publisher: string;
      publish_date: string;
      view_count: number;
      status: number;
    };
    status_enum_mapping: Array<{
      value: number;
      label_zh: string;
      label_en: string;
    }>;
    zh: {
      title: string;
      body: string;
    };
    en: {
      title: string;
      body: string;
    };
  };
}

export interface NewsListParams {
  page?: number;
  pageSize?: number;
  status?: number;
}