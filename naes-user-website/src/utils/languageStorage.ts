/**
 * 语言持久化存储工具
 */

export const LANGUAGE_STORAGE_KEY = 'i18nextLng';
export const LANGUAGE_COOKIE_NAME = 'i18next';

export type SupportedLanguage = 'zh' | 'en';

/**
 * 保存语言设置到本地存储
 */
export const saveLanguage = (language: SupportedLanguage): void => {
  try {
    // 保存到 localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    
    // 保存到 cookie (30天有效期)
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    
    console.log(`Language saved: ${language}`);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

/**
 * 从本地存储读取语言设置
 */
export const loadLanguage = (): SupportedLanguage | null => {
  try {
    // 优先从 localStorage 读取
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && (storedLanguage === 'zh' || storedLanguage === 'en')) {
      return storedLanguage as SupportedLanguage;
    }
    
    // 如果 localStorage 没有，尝试从 cookie 读取
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === LANGUAGE_COOKIE_NAME && (value === 'zh' || value === 'en')) {
        return value as SupportedLanguage;
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to load language preference:', error);
    return null;
  }
};

/**
 * 清除语言设置
 */
export const clearLanguage = (): void => {
  try {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    document.cookie = `${LANGUAGE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.warn('Failed to clear language preference:', error);
  }
};