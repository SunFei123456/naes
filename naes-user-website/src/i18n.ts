import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译文件
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enWhyChooseUs from './locales/en/whyChooseUs.json';
import enContact from './locales/en/contact.json';
import enProducts from './locales/en/products.json';
import enQa from './locales/en/qa.json';
import zhCommon from './locales/zh/common.json';
import zhHome from './locales/zh/home.json';
import zhAbout from './locales/zh/about.json';
import zhWhyChooseUs from './locales/zh/whyChooseUs.json';
import zhContact from './locales/zh/contact.json';
import zhProducts from './locales/zh/products.json';
import zhQa from './locales/zh/qa.json';

// 规范化语言代码：将 zh-CN、zh-TW 等映射为 zh，仅保留主码。
const normalizeLang = (lng: string | null | undefined): 'zh' | 'en' | undefined => {
  if (!lng) return undefined;
  const lower = lng.toLowerCase();
  if (lower === 'en' || lower.startsWith('en-')) return 'en';
  if (lower === 'zh' || lower.startsWith('zh-')) return 'zh';
  return undefined;
};

// 获取保存的语言设置
const getSavedLanguage = (): string => {
  try {
    // 优先从 localStorage 读取
    const storedLanguage = normalizeLang(localStorage.getItem('i18nextLng'));
    if (storedLanguage) return storedLanguage;
    
    // 如果 localStorage 没有，尝试从 cookie 读取
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'i18next') {
        const norm = normalizeLang(value);
        if (norm) return norm;
      }
    }
  } catch (error) {
    console.warn('Failed to load saved language:', error);
  }
  
  return 'en'; // 默认返回英文
};

const initialLanguage = getSavedLanguage();

i18n
  .use(initReactI18next)
  .init({
    lng: initialLanguage, // 使用保存的语言或默认英文
    fallbackLng: 'zh', // 回退语言是中文
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en', 'zh'],
    nonExplicitSupportedLngs: true, // 自动将 zh-CN 归一为 zh
    load: 'languageOnly', // 只使用主码
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        about: enAbout,
        whyChooseUs: enWhyChooseUs,
        contact: enContact,
        products: enProducts,
        qa: enQa,
      },
      zh: {
        common: zhCommon,
        home: zhHome,
        about: zhAbout,
        whyChooseUs: zhWhyChooseUs,
        contact: zhContact,
        products: zhProducts,
        qa: zhQa,
      },
    },
  });

// 监听语言变化并自动保存
i18n.on('languageChanged', (lng) => {
  const norm = normalizeLang(lng);
  if (norm) {
    try {
      localStorage.setItem('i18nextLng', norm);
      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
      document.cookie = `i18next=${norm}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
      console.warn('Failed to save language change:', error);
    }
  }
});

export default i18n;
