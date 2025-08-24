import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/images/logo-g.jpg'; // 使用彩色Logo
import usFlag from '../assets/images/us.svg'; // 美国国旗
import cnFlag from '../assets/images/cn.svg'; // 中国国旗

import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

type SupportedLanguage = 'zh' | 'en';

const Header = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // 业务固定信息（根据需求提供静态值）
  const PHONE_DISPLAY = '0571-85502995';
  const PHONE_TEL = '57185502995';
  const EMAIL = 'sales@natureessential.ltd';

  // 判断当前路径是否激活
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // 获取导航链接的样式类名
  const getNavLinkClass = (path: string) => {
    const baseClass =
      'relative px-4 py-2 text-xs md:text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-300 rounded-lg';
    const activeClass = 'text-white bg-[#204f3e] shadow-md';
    const inactiveClass = 'text-gray-700 hover:text-[#204f3e] hover:bg-gray-50';

    return `${baseClass} ${isActiveRoute(path) ? activeClass : inactiveClass}`;
  };

  const toggleLanguage = (lang: string) => {
    const supportedLang = lang as SupportedLanguage;

    // 切换语言（保存逻辑已在i18n.ts中的languageChanged监听器中处理）
    i18n.changeLanguage(supportedLang);

    setIsLanguageMenuOpen(false);
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full"
      style={{ height: 'var(--header-height)' }}
    >
      {/* Sub-header 区域 - 参考目标站点排版 */}
      <div className="flex h-12 items-center bg-[#204f3e] text-sm text-white md:h-14">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4">
          {/* 左：欢迎语 + 分割线 + 电话邮箱 */}
          <div className="flex items-center space-x-4">
            {/* 欢迎语 */}
            <span className="hidden font-medium text-white sm:block">
              {t('subHeader.welcome')}
            </span>

            {/* 分割线 */}
            <div className="hidden h-4 w-px bg-white/30 sm:block"></div>

            {/* 电话 + 邮箱 */}
            <div className="flex items-center space-x-6">
              {/* 电话号码 */}
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="text-white transition-colors hover:text-green-200"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>

              {/* 邮箱地址 */}
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-white transition-colors hover:text-green-200"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* 右：社交图标（占位，不跳转） */}
          <div className="flex items-center space-x-2">
            <button
              aria-label="WhatsApp"
              className="p-1.5 transition-opacity hover:opacity-80"
              onClick={() =>
                window.open('https://wa.me/qr/TEQNG3SRTPDMH1', '_blank')
              }
            >
              <MessageCircle
                size={16}
                className="text-white"
                fill="currentColor"
              />
            </button>
            {/*
            <button
              aria-label="Facebook"
              className="p-1.5 transition-opacity hover:opacity-80"
            >
              <Facebook size={16} className="text-white" fill="currentColor" />
            </button>
            <button
              aria-label="LinkedIn"
              className="p-1.5 transition-opacity hover:opacity-80"
            >
              <Linkedin size={16} className="text-white" fill="currentColor" />
            </button>
            */}
          </div>
        </div>
      </div>

      {/* 主导航区域 - 固定高度 */}
      <div className="h-20 bg-white shadow-lg">
        <div className="container mx-auto grid h-full max-w-7xl grid-cols-3 items-center px-4">
          {/* Logo - 居左 */}
          <div className="flex justify-start">
            <Link to="/" className="flex w-80 items-center">
              <img
                src={logo}
                alt="Company Logo"
                className="h-auto w-full object-contain"
              />
            </Link>
          </div>

          {/* Navigation links - 居中 */}
          <nav className="flex justify-center">
            <ul className="flex space-x-2 md:space-x-3 lg:space-x-4">
              <li>
                <Link to="/" className={getNavLinkClass('/')}>
                  {t('header.home')}
                </Link>
              </li>
              {/** About 暂不展示 */}
              <li>
                <Link
                  to="/why-choose-us"
                  className={getNavLinkClass('/why-choose-us')}
                >
                  {t('header.whyChooseUs')}
                </Link>
              </li>
              <li>
                <Link to="/products" className={getNavLinkClass('/products')}>
                  {t('header.products')}
                </Link>
              </li>

              <li>
                <Link to="/contact" className={getNavLinkClass('/contact')}>
                  {t('header.contact')}
                </Link>
              </li>
              {/** Q&A 暂不展示 */}
            </ul>
          </nav>

          {/* 语言切换 - 居右 */}
          <div className="flex justify-end">
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 rounded px-3 py-2 transition-colors hover:bg-gray-100"
              >
                {/* 当前语言国旗 */}
                <img
                  src={i18n.language === 'zh' ? cnFlag : usFlag}
                  alt={i18n.language === 'zh' ? 'Chinese Flag' : 'US Flag'}
                  className="h-4 w-6 rounded-sm object-cover"
                />
                <span className="text-sm font-medium text-black">
                  {i18n.language === 'zh' ? '中文' : 'English'}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-600 transition-transform ${
                    isLanguageMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 语言下拉菜单 */}
              {isLanguageMenuOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                  <button
                    onClick={() => toggleLanguage('zh')}
                    className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <img
                      src={cnFlag}
                      alt="Chinese Flag"
                      className="h-4 w-6 rounded-sm object-cover"
                    />
                    <span className="text-sm text-black">中文</span>
                  </button>
                  <button
                    onClick={() => toggleLanguage('en')}
                    className="flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <img
                      src={usFlag}
                      alt="US Flag"
                      className="h-4 w-6 rounded-sm object-cover"
                    />
                    <span className="text-sm text-black">English</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
