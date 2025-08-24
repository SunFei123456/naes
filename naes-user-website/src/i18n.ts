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

// 获取保存的语言设置
const getSavedLanguage = (): string => {
  try {
    // 优先从 localStorage 读取
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage && (storedLanguage === 'zh' || storedLanguage === 'en')) {
      return storedLanguage;
    }
    
    // 如果 localStorage 没有，尝试从 cookie 读取
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'i18next' && (value === 'zh' || value === 'en')) {
        return value;
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
  if (lng === 'zh' || lng === 'en') {
    try {
      localStorage.setItem('i18nextLng', lng);
      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
      document.cookie = `i18next=${lng}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
      console.warn('Failed to save language change:', error);
    }
  }
});

export default i18n;
