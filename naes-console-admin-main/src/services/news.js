import http from './http'
import dayjs from 'dayjs'

/**
 * 新闻管理服务
 * 使用 hzes-website API 接口
 */

// ================================
// 1. 分页查询新闻列表
// ================================
/**
 * 分页查询新闻列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNo - 页码，从1开始
 * @param {number} params.pageSize - 每页数量，最大1000
 * @param {number} params.status - 状态：0草稿，1发布（默认1）
 * @returns {Promise<Object>} 新闻列表数据
 */
export async function fetchNewsList({
  pageNo = 1,
  pageSize = 10,
  status = 1
} = {}) {
  try {
    const params = {
      pageNo,
      pageSize,
      status
    }

    const response = await http.get('/naes/console/news/list', {
      params,
      loadingKey: 'newsList'
    })

    const data = response.data
    
    // 转换数据格式以适配现有组件
    const list = (data.data || []).map(item => ({
      id: item.id,
      article_id: item.article_id,
      title: item.title?.['zh-CN'] || '',
      titleEn: item.title?.['en-US'] || '',
      publishTime: item.publish_date ? dayjs(item.publish_date).format('YYYY-MM-DD HH:mm:ss') : null,
      readCount: item.read_count || 0,
      status: item.status === 1 ? 'published' : 'draft',
      cover_image_url: item.cover_image_url
    }))

    return {
      data: list,
      total: data.page?.totalSize || 0,
      page: data.page?.pageNo || pageNo,
      pageSize: data.page?.pageSize || pageSize
    }
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    throw error
  }
}

// ================================
// 2. 创建新闻
// ================================
/**
 * 创建新闻
 * @param {Object} newsData - 新闻数据
 * @param {string} newsData.title - 中文标题
 * @param {string} newsData.titleEn - 英文标题
 * @param {string} newsData.cover_image_url - 封面图片URL
 * @param {string} newsData.content - 中文内容
 * @param {string} newsData.contentEn - 英文内容
 * @param {number} newsData.status - 状态：0草稿，1发布
 * @param {string} newsData.publish_date - 发布日期
 * @returns {Promise<Object>} 创建结果
 */
export async function createNews(newsData) {
  try {
    // 转换数据格式以匹配API要求
    const apiData = {
      title: {
        'zh-CN': newsData.title || '',
        'en-US': newsData.titleEn || newsData.title || ''
      },
      cover_image_url: newsData.cover_image_url || newsData.coverImageUrl || '',
      content: {
        'zh-CN': newsData.content || '',
        'en-US': newsData.contentEn || newsData.content || ''
      },
      status: newsData.status === 'published' ? 1 : 0,
      publish_date: newsData.publish_date || newsData.publishTime || dayjs().toISOString()
    }

    const response = await http.post('/naes/console/news/create', apiData, {
      loadingKey: 'createNews'
    })

    return {
      success: true,
      data: response.data,
      articleId: response.data?.data?.article_id
    }
  } catch (error) {
    console.error('创建新闻失败:', error)
    throw error
  }
}

// ================================
// 3. 查询新闻详情
// ================================
/**
 * 查询新闻详情
 * @param {string|number} id - 新闻ID（数字类型的主键ID）
 * @returns {Promise<Object>} 新闻详情数据
 */
export async function fetchNewsDetail(id) {
  try {
    const response = await http.get(`/naes/console/news/${id}`, {
      loadingKey: 'newsDetail'
    })

    const data = response.data?.data
    if (!data) {
      throw new Error('新闻不存在')
    }

    // 根据API文档转换数据格式
    // API返回格式: {id, article_id, "zh-CN": {title, body}, "en-US": {title, body}}
    return {
      id: data.id,
      article_id: data.article_id,
      title: data['zh-CN']?.title || '',
      titleEn: data['en-US']?.title || '',
      content: data['zh-CN']?.body || '',
      contentEn: data['en-US']?.body || '',
      cover_image_url: data.cover_image_url,
      status: data.status === 1 ? 'published' : 'draft',
      publish_date: data.publish_date,
      read_count: data.read_count || 0
    }
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    throw error
  }
}

// ================================
// 4. 编辑新闻
// ================================
/**
 * 编辑新闻
 * @param {string|number} id - 新闻数字ID（主键，非article_id）
 * @param {Object} newsData - 新闻数据（只传递修改的字段）
 * @returns {Promise<Object>} 编辑结果
 */
export async function editNews(id, newsData) {
  try {
    // 根据API文档，编辑接口需要数字类型的id作为必填字段
    const apiData = {
      id: parseInt(id) // 确保是数字类型
    }

    // 只添加实际传递的字段到API请求中
    if (newsData.title || newsData.titleEn) {
      apiData.title = {
        'zh-CN': newsData.title || '',
        'en-US': newsData.titleEn || newsData.title || ''
      }
    }

    if (newsData.cover_image_url || newsData.coverImageUrl) {
      apiData.cover_image_url = newsData.cover_image_url || newsData.coverImageUrl
    }

    if (newsData.content || newsData.contentEn) {
      apiData.content = {
        'zh-CN': newsData.content || '',
        'en-US': newsData.contentEn || newsData.content || ''
      }
    }

    // 状态字段处理
    if ('status' in newsData) {
      apiData.status = typeof newsData.status === 'number' ? newsData.status : (newsData.status === 'published' ? 1 : 0)
    }

    // 发布时间字段处理
    if (newsData.publish_date || newsData.publishTime) {
      apiData.publish_date = newsData.publish_date || newsData.publishTime
    }


    const response = await http.post('/naes/console/news/edit', apiData, {
      loadingKey: 'editNews'
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('编辑新闻失败:', error)
    throw error
  }
}

// ================================
// 5. 删除新闻
// ================================
/**
 * 删除新闻
 * @param {string|number} id - 新闻数字ID（主键）
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteNews(id) {
  try {
    // 根据API文档，删除接口需要传递数字数组作为请求体
    const response = await http.delete('/naes/console/news', {
      data: [parseInt(id)], // 传递数字数组
      loadingKey: 'deleteNews'
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('删除新闻失败:', error)
    throw error
  }
}

// ================================
// 6. 兼容旧版本的函数（为了不破坏现有代码）
// ================================

// 兼容旧版本的获取新闻列表
export async function getNewsList(params = {}) {
  // 转换参数格式
  const apiParams = {
    pageNo: params.page || 1,
    pageSize: params.pageSize || 10,
    status: params.status === 'draft' ? 0 : 1 // 默认显示发布状态
  }

  return fetchNewsList(apiParams)
}

// 兼容旧版本的获取单篇文章
export async function getNewsById(id) {
  return fetchNewsDetail(id)
}

// 兼容旧版本的更新文章
export async function updateNews(id, data) {
  // 直接使用数字ID进行编辑
  try {
    return editNews(id, data)
  } catch (error) {
    console.error('更新新闻失败:', error)
    throw error
  }
}

// 兼容旧版本的下架文章
export async function offlineNews(id) {
  try {
    // 下架只需要传递status: 0即可
    return editNews(id, {
      status: 0 // 0表示草稿/下架状态
    })
  } catch (error) {
    console.error('下架新闻失败:', error)
    throw error
  }
}

// 默认导出
export default {
  // 新版本API
  fetchNewsList,
  createNews,
  fetchNewsDetail,
  editNews,
  deleteNews,
  
  // 兼容旧版本
  getNewsList,
  getNewsById,
  updateNews,
  offlineNews
}