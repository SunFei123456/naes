import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProductTranslations } from '@/hooks/useProductTranslations';

interface BreadcrumbsProps {
  newsTitle?: string; // 新闻标题，用于显示在面包屑中
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ newsTitle }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation(['common', 'qa', 'products']);
  
  // 获取当前路径中的产品ID
  const pathnames = location.pathname.split('/').filter(Boolean);
  const isProductDetail = pathnames[0] === 'products' && pathnames[1];
  const isNewsDetail = pathnames[0] === 'news' && pathnames[1];
  const productId = isProductDetail ? pathnames[1] : null;
  
  // 只在产品详情页面时使用产品翻译
  const productTranslations = productId ? useProductTranslations(productId) : null;

  // 使用 useMemo 优化路径计算
  const breadcrumbs = useMemo(() => {

    // 简化QA路径处理，避免复杂的翻译数据获取
    const getQaCategoryName = (categoryId: string) => {
      // 简单的分类ID到名称的映射
      const categoryMap: Record<string, { zh: string; en: string }> = {
        'product-fundamentals': {
          zh: '产品基础信息',
          en: 'Product Fundamentals',
        },
        'formulation-solutions': {
          zh: '应用与配比',
          en: 'Formulation Solutions',
        },
        'efficacy-mechanism': { zh: '功效与机制', en: 'Efficacy & Mechanism' },
        'safety-side-effects': {
          zh: '安全与副作用',
          en: 'Safety & Side Effects',
        },
        'application-solutions': {
          zh: '应用解决方案',
          en: 'Application Solutions',
        },
        'market-trends-data': {
          zh: '市场趋势与数据',
          en: 'Market Trends & Data',
        },
      };

      const category = categoryMap[categoryId];
      if (category) {
        return i18n.language === 'zh' ? category.zh : category.en;
      }
      return categoryId;
    };

    // 简化问题标题处理
    const getQaQuestionTitle = () => {
      // 对于问题标题，我们简化处理，只显示问题ID或简化的标题
      return i18n.language === 'zh' ? '问题详情' : 'Question Details';
    };

    const pathNameMap: Record<string, string> = {
      products: i18n.language === 'zh' ? '产品' : 'Products',
      'why-choose-us':
        i18n.language === 'zh' ? '为什么选择我们' : 'Why Choose Us',
      qa: i18n.language === 'zh' ? '常见问题' : 'Q&A',
      about: i18n.language === 'zh' ? '关于我们' : 'About Us',
      contact: i18n.language === 'zh' ? '联系我们' : 'Contact',
      news: i18n.language === 'zh' ? '新闻动态' : 'News',
    };

    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;

      let displayName = pathNameMap[name];

      // 处理QA相关路径
      if (pathnames[0] === 'qa') {
        if (index === 1) {
          // QA分类页面
          displayName = getQaCategoryName(name);
        } else if (index === 2) {
          // QA问题详情页面
          displayName = getQaQuestionTitle();
          // 截断过长的问题标题
          if (displayName.length > 50) {
            displayName = displayName.substring(0, 50) + '...';
          }
        }
      }

      // 处理产品详情的产品名本地化
      if (pathnames[0] === 'products' && index === 1 && productTranslations) {
        displayName = productTranslations.name;
      }

      // 处理新闻详情页面，显示标题前6个字
      if (pathnames[0] === 'news' && index === 1 && newsTitle) {
        displayName = newsTitle.length > 6 ? newsTitle.substring(0, 6) + '...' : newsTitle;
      }

      // 如果没有找到映射，使用默认格式化
      if (!displayName) {
        displayName = name
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }

      return {
        routeTo,
        isLast,
        displayName,
        isProduct: index > 0 && pathnames[0] === 'products',
        isQa: pathnames[0] === 'qa',
        isNews: pathnames[0] === 'news',
      };
    });
  }, [location.pathname, i18n.language, t, productTranslations]);

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <nav
          className="flex items-center space-x-2 overflow-x-auto"
          aria-label="Breadcrumb"
        >
          <ol className="flex min-w-0 items-center space-x-2">
            {/* Home 链接 */}
            <li className="flex items-center">
              <Link
                to="/"
                className="group flex items-center space-x-1 rounded-lg px-3 py-2 text-gray-600 shadow-sm transition-all duration-200 hover:bg-white hover:text-[#3e4e3a] hover:shadow-md"
                aria-label="返回首页"
              >
                <Home size={16} className="flex-shrink-0" />
                <span className="text-sm font-medium">
                  {i18n.language === 'zh' ? '首页' : 'Home'}
                </span>
              </Link>
            </li>

            {breadcrumbs.map(
              ({ routeTo, isLast, displayName, isProduct, isQa, isNews }, index) => (
                <li key={routeTo} className="flex items-center">
                  {/* 分隔符 */}
                  <ChevronRight
                    size={16}
                    className="mx-1 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />

                  {isLast ? (
                    /* 当前页面 - 不可点击 */
                    <span className="max-w-xs truncate rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm">
                      {displayName}
                    </span>
                  ) : (
                    /* 可点击的面包屑项 */
                    <Link
                      to={
                        isProduct && index === 1
                          ? '/products'
                          : isQa && index === 2
                            ? `/qa/${breadcrumbs[1]?.routeTo.split('/')[2]}`
                          : isNews && index === 1
                            ? '/news'
                            : routeTo
                      }
                      className="group max-w-xs truncate rounded-lg px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-white hover:text-blue-600 hover:shadow-md"
                      aria-label={`${
                        i18n.language === 'zh' ? '导航到' : 'Navigate to'
                      } ${displayName}`}
                    >
                      {displayName}
                    </Link>
                  )}
                </li>
              ),
            )}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
