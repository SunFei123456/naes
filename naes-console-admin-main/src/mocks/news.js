// 新闻文章 Mock 数据
export const newsData = [
  {
    id: 1,
    title: "NAES平台重大更新发布",
    content: "我们很高兴地宣布NAES平台的重大更新已经发布，包含了多项新功能和性能优化...",
    publisher: "张三",
    publishTime: "2024-12-15 10:30:00",
    readCount: 1250,
    status: "published", // published | draft
    createdAt: "2024-12-15 09:00:00",
    updatedAt: "2024-12-15 10:30:00"
  },
  {
    id: 2,
    title: "系统维护通知",
    content: "为了提供更好的服务体验，我们将在本周末进行系统维护...",
    publisher: "李四",
    publishTime: "2024-12-14 16:00:00",
    readCount: 890,
    status: "published",
    createdAt: "2024-12-14 15:30:00",
    updatedAt: "2024-12-14 16:00:00"
  },
  {
    id: 3,
    title: "新功能预览：智能数据分析",
    content: "即将推出的智能数据分析功能将为用户提供更深入的数据洞察...",
    publisher: "王五",
    publishTime: null,
    readCount: 0,
    status: "draft",
    createdAt: "2024-12-13 14:20:00",
    updatedAt: "2024-12-13 14:20:00"
  },
  {
    id: 4,
    title: "用户隐私政策更新",
    content: "根据最新的法规要求，我们对用户隐私政策进行了更新...",
    publisher: "赵六",
    publishTime: "2024-12-12 09:15:00",
    readCount: 2100,
    status: "published",
    createdAt: "2024-12-11 17:45:00",
    updatedAt: "2024-12-12 09:15:00"
  },
  {
    id: 5,
    title: "API接口升级说明",
    content: "为了提供更稳定和高效的API服务，我们将对部分接口进行升级...",
    publisher: "孙七",
    publishTime: null,
    readCount: 0,
    status: "draft",
    createdAt: "2024-12-10 11:30:00",
    updatedAt: "2024-12-10 11:30:00"
  },
  {
    id: 6,
    title: "移动端应用正式上线",
    content: "经过数月的开发和测试，NAES移动端应用现已正式上线...",
    publisher: "周八",
    publishTime: "2024-12-08 14:00:00",
    readCount: 3200,
    status: "published",
    createdAt: "2024-12-08 10:00:00",
    updatedAt: "2024-12-08 14:00:00"
  },
  {
    id: 7,
    title: "安全漏洞修复公告",
    content: "我们发现并修复了一个潜在的安全漏洞，建议所有用户及时更新...",
    publisher: "吴九",
    publishTime: "2024-12-07 20:30:00",
    readCount: 1800,
    status: "published",
    createdAt: "2024-12-07 18:00:00",
    updatedAt: "2024-12-07 20:30:00"
  },
  {
    id: 8,
    title: "年度总结报告",
    content: "回顾2024年，NAES平台在各个方面都取得了显著的进展...",
    publisher: "郑十",
    publishTime: null,
    readCount: 0,
    status: "draft",
    createdAt: "2024-12-05 16:45:00",
    updatedAt: "2024-12-05 16:45:00"
  },
  {
    id: 9,
    title: "数据备份与恢复策略",
    content: "为确保数据安全，我们制定了完善的数据备份与恢复策略...",
    publisher: "陈一",
    publishTime: "2024-12-04 11:20:00",
    readCount: 950,
    status: "published",
    createdAt: "2024-12-04 09:30:00",
    updatedAt: "2024-12-04 11:20:00"
  },
  {
    id: 10,
    title: "用户体验优化计划",
    content: "基于用户反馈，我们启动了全面的用户体验优化计划...",
    publisher: "林二",
    publishTime: "2024-12-03 15:45:00",
    readCount: 1680,
    status: "published",
    createdAt: "2024-12-03 14:00:00",
    updatedAt: "2024-12-03 15:45:00"
  },
  {
    id: 11,
    title: "新版本功能预告",
    content: "下个版本将带来更多令人兴奋的功能，敬请期待...",
    publisher: "黄三",
    publishTime: null,
    readCount: 0,
    status: "draft",
    createdAt: "2024-12-02 13:15:00",
    updatedAt: "2024-12-02 13:15:00"
  }
];

// 模拟API延迟
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 获取新闻列表
export const getNewsList = async (params = {}) => {
  await delay();
  
  let result = [...newsData];
  
  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
    );
  }
  
  // 发布时间筛选
  if (params.startDate && params.endDate) {
    result = result.filter(item => {
      if (!item.publishTime) return false;
      const publishDate = new Date(item.publishTime);
      return publishDate >= new Date(params.startDate) && publishDate <= new Date(params.endDate);
    });
  }
  
  // 状态筛选
  if (params.status) {
    result = result.filter(item => item.status === params.status);
  }
  
  // 排序
  result.sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt);
    const timeB = new Date(b.updatedAt || b.createdAt);
    return timeB - timeA;
  });
  
  // 分页
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: result.slice(start, end),
    total: result.length,
    page,
    pageSize
  };
};

// 获取单篇文章
export const getNewsById = async (id) => {
  await delay();
  const article = newsData.find(item => item.id === parseInt(id));
  if (!article) {
    throw new Error('文章不存在');
  }
  return article;
};

// 创建文章
export const createNews = async (data) => {
  await delay();
  const newId = Math.max(...newsData.map(item => item.id)) + 1;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  // 随机分配发布人
  const publishers = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'];
  const randomPublisher = publishers[Math.floor(Math.random() * publishers.length)];
  
  const newArticle = {
    id: newId,
    title: data.title,
    content: data.content,
    publisher: randomPublisher,
    publishTime: data.status === 'published' ? now : null,
    readCount: 0,
    status: data.status || 'draft',
    createdAt: now,
    updatedAt: now
  };
  
  newsData.unshift(newArticle);
  return newArticle;
};

// 更新文章
export const updateNews = async (id, data) => {
  await delay();
  const index = newsData.findIndex(item => item.id === parseInt(id));
  if (index === -1) {
    throw new Error('文章不存在');
  }
  
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const article = newsData[index];
  
  // 如果从草稿变为发布，设置发布时间
  if (article.status === 'draft' && data.status === 'published') {
    data.publishTime = now;
  }
  
  // 如果从发布变为草稿，清除发布时间
  if (article.status === 'published' && data.status === 'draft') {
    data.publishTime = null;
  }
  
  newsData[index] = {
    ...article,
    ...data,
    updatedAt: now
  };
  
  return newsData[index];
};

// 删除文章
export const deleteNews = async (id) => {
  await delay();
  const index = newsData.findIndex(item => item.id === parseInt(id));
  if (index === -1) {
    throw new Error('文章不存在');
  }
  
  newsData.splice(index, 1);
  return true;
};

// 下架文章（发布状态变为草稿状态）
export const offlineNews = async (id) => {
  await delay();
  const index = newsData.findIndex(item => item.id === parseInt(id));
  if (index === -1) {
    throw new Error('文章不存在');
  }
  
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  newsData[index] = {
    ...newsData[index],
    status: 'draft',
    publishTime: null,
    updatedAt: now
  };
  
  return newsData[index];
};