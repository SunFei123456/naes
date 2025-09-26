接口响应
## 1. 新闻列表接口 
分页获取新闻列表接口 (GET /api/news?page=1&pageSize=10&) 的 mock 响应
Request Method(请求方法): GET 
API Endpoint(接口端点): GET /api/news
Query Parameters(查询参数):

参数名	类型	是否必需	默认值	描述
page	Integer	否	1	请求的页码。
pageSize	Integer	否	10	每页返回的项目数量。
status	Integer	否	1	文章的状态。根据状态枚举 (0=草稿, 1=发布, 2=下架) 进行筛选。


这个status 你后端直接设置为默认的发布:1 即可, 前台默认请求的就是发布的新闻


```json
{
  "code": 200,
  "message": "成功获取新闻列表",
  "data": {
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 98,
      "totalPages": 10
    },
    "list": [
      {
        "article_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
        "cover_image_url": "https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/v2/cover/FPoQbxsRYoESbTxWmDac4Wa9nOd/?fallback_source=1&height=1280&mount_node_token=XQjsdpOnhonIYUxYSKPc57sYnnd&mount_point=docx_image&policy=allow_down&width=1280",
        "title": {
          "zh": "β- 烟酰胺单核苷酸 (NMN)：解码天然抗衰原料的科学密码",
          "en": "β-Nicotinamide Mononucleotide (NMN): Decoding the Science Behind Nature's Anti-Aging Ingredient"
        },
        "description": {
          "zh": "在全球抗衰保健品市场中，β- 烟酰胺单核苷酸（NMN）无疑是最受关注的 “明星原料”。本文将全面解析其科学原理、原料特性与应用场景...",
          "en": "In the global anti-aging supplement market, β-Nicotinamide Mononucleotide (NMN) is the star ingredient. This article provides a comprehensive analysis of its science, properties, and applications..."
        },
        "publish_date": "2025-08-11T09:00:00Z"
      },
      {
        "article_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "cover_image_url": "https://example.com/images/market_trends_cover.jpg",
        "title": {
          "zh": "2025年第三季度 NMN 全球市场趋势分析",
          "en": "NMN Global Market Trends Analysis for Q3 2025"
        },
        "description": {
          "zh": "最新报告显示，北美和亚太地区对高纯度NMN原料的需求持续增长。消费者越来越关注产品的溯源性与安全性...",
          "en": "The latest report indicates sustained growth in demand for high-purity NMN raw materials in North America and Asia-Pacific. Consumers are increasingly focused on product traceability and safety..."
        },
        "publish_date": "2025-07-28T14:30:00Z"
      },
      {
        "article_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "cover_image_url": "https://example.com/images/sports_nutrition_cover.jpg",
        "title": {
          "zh": "运动营养新突破：NMN 如何提升耐力与恢复速度",
          "en": "A Breakthrough in Sports Nutrition: How NMN Boosts Endurance and Recovery"
        },
        "description": {
          "zh": "探讨 NMN 如何通过激活 AMPK 信号通路，改善细胞能量代谢，帮助运动员提升运动表现并加速身体恢复...",
          "en": "Exploring how NMN enhances athletic performance and accelerates recovery by activating the AMPK signaling pathway to improve cellular energy metabolism..."
        },
        "publish_date": "2025-07-15T11:00:00Z"
      }
    ]
  }
}
```


## 2.  新闻详情接口

当用户点击列表中的第一篇文章时，前端会使用其 article_id (d290f1ee-6c54-4b01-90e6-d701748f0851) 来请求详情接口

**Request Method(请求方法): GET**
**API Endpoint(接口端点): /api/news/{article_id}**
**Query Parameters(查询参数):**
参数	类型	位置	是否必需	描述
article_id	UUID	Path	是	要获取详情的文章的唯一标识符。


```json
{
  "code": 200,
  "message": "成功获取文章详情",
  "data": {
    "article_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "publish_details": {
      "publisher": "内容管理员",
      "publish_date": "2025-08-11T09:00:00Z",
      "view_count": 21578,
      "status": 1
    },
    "status_enum_mapping": [
      {
        "value": 0,
        "label_zh": "草稿",
        "label_en": "Draft"
      },
      {
        "value": 1,
        "label_zh": "发布",
        "label_en": "Published"
      },
      {
        "value": 2,
        "label_zh": "下架",
        "label_en": "Archived"
      }
    ],
    "zh": {
      "title": "β- 烟酰胺单核苷酸 (NMN)：解码天然抗衰原料的科学密码",
      "body": "在全球抗衰保健品市场中，β- 烟酰胺单核苷酸（NMN）无疑是最受关注的 “明星原料”。从实验室的突破性研究到终端产品的热销，NMN 凭借扎实的科学背书与明确的功效，成为连接前沿生物学与大众健康需求的桥梁。作为专注于 NMN 外贸供应的企业，我们将从科学原理、原料特性、应用场景到全球监管等维度，全面解析这一 “抗衰新星”。\n\n![烟酰胺单核苷酸](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/v2/cover/FPoQbxsRYoESbTxWmDac4Wa9nOd/?fallback_source=1&height=1280&mount_node_token=XQjsdpOnhonIYUxYSKPc57sYnnd&mount_point=docx_image&policy=allow_down&width=1280)\n\n## 一、NMN 是什么？从分子结构到天然来源\n\nβ- 烟酰胺单核苷酸（NMN）是一种天然存在于生物体内的核苷酸衍生物，其分子结构由烟酰胺、核糖和磷酸基团组成，是人体内重要辅酶 NAD+（烟酰胺腺嘌呤二核苷酸）的直接前体。NAD + 在细胞能量代谢、DNA 修复、细胞衰老调控等过程中发挥核心作用，但随着年龄增长，人体 NAD + 水平会以每 10 年下降约 50% 的速度递减，这也是衰老相关疾病的重要诱因。\n\n在自然界中，NMN 广泛存在于各类食物中：\n- 每 100 克西兰花含约 0.25-1.12 毫克\n- 牛油果含约 0.47-1.88 毫克\n- 毛豆含约 0.47-1.88 毫克\n\n但通过日常饮食摄入的 NMN 量远无法满足人体需求 —— 成年人若想通过西兰花补充达到有效剂量，每天需食用约 30 公斤，因此通过高纯度原料制成的保健品成为理想选择。\n\n## 二、科学原理：NMN 如何实现 “抗衰赋能”？\n\nNMN 的核心作用机制是通过转化为 NAD+，激活人体内的三类长寿蛋白：\n\n![NAD+ 结构](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/v2/cover/FPoQbxsRYoESbTxWmDac4Wa9nOd/?fallback_source=1&height=1280&mount_node_token=XQjsdpOnhonIYUxYSKPc57sYnnd&mount_point=docx_image&policy=allow_down&width=1280)\n\n### 1. 激活 Sirtuins 家族：细胞修复的 “指挥官”\nSirtuins 是一组依赖 NAD + 的去乙酰化酶，其中 SIRT1 可修复受损 DNA，SIRT3 则调控线粒体功能。当 NAD + 水平充足时，Sirtuins 被激活，能显著减少细胞氧化损伤，延缓细胞衰老进程。2013 年哈佛大学 David Sinclair 团队在《细胞》杂志发表的研究证实，给老年小鼠补充 NMN 后，其线粒体功能和肌肉耐力可恢复至年轻小鼠水平。\n\n### 2. 激活 PARP 酶：DNA 损伤的 “修复师”\nPARP 酶是 DNA 修复的关键酶，在识别到 DNA 断裂后，会消耗 NAD + 来启动修复程序。NMN 通过提升 NAD + 水平，为 PARP 酶提供充足 “燃料”，尤其在辐射、污染等外界损伤因素下，能加速 DNA 修复，降低突变风险。\n\n### 3. 激活 AMPK 信号通路：能量代谢的 “调节器”\nAMPK 被称为 “细胞能量传感器”，NMN 转化的 NAD + 可激活 AMPK，促进葡萄糖摄取和脂肪酸氧化，改善细胞能量代謝效率。这也是 NMN 能缓解疲劳、提升运动耐力的重要原因。"
    },
    "en": {
      "title": "β-Nicotinamide Mononucleotide (NMN): Decoding the Science Behind Nature's Anti-Aging Ingredient",
      "body": "In the global anti-aging supplement market, β-Nicotinamide Mononucleotide (NMN) has undoubtedly emerged as the most sought-after \"star ingredient.\" From groundbreaking laboratory research to bestselling end products, NMN has become a bridge connecting cutting-edge biology with public health demands, backed by solid scientific evidence and proven efficacy. As a specialized NMN supplier for global trade, we provide a comprehensive analysis of this \"rising star of anti-aging\" from multiple dimensions: scientific principles, ingredient properties, applications, and global regulatory status.\n\n![Nicotinamide Mononucleotide](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/v2/cover/FPoQbxsRYoESbTxWmDac4Wa9nOd/?fallback_source=1&height=1280&mount_node_token=XQjsdpOnhonIYUxYSKPc57sYnnd&mount_point=docx_image&policy=allow_down&width=1280)\n\n## What is NMN? Molecular Structure & Natural Sources\n\nβ-Nicotinamide Mononucleotide (NMN) is a naturally occurring nucleotide derivative in living organisms. Its molecular structure consists of nicotinamide, ribose, and a phosphate group, serving as the direct precursor to NAD+ (nicotinamide adenine dinucleotide) — a vital coenzyme that plays a central role in cellular energy metabolism, DNA repair, and aging regulation. However, NAD+ levels decline by approximately 50% every decade with age, contributing to age-related diseases.\n\nIn nature, NMN is widely present in various foods:\n- Broccoli: 0.25–1.12 mg per 100g\n- Avocado: 0.47–1.88 mg per 100g\n- Edamame: 0.47–1.88 mg per 100g\n\nHowever, dietary intake alone is insufficient to meet physiological requirements. To achieve an effective dose through broccoli consumption, an adult would need to consume approximately 30kg daily. Thus, high-purity NMN supplements represent the optimal solution."
    }
  }
}
```