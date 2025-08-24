import { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import ScrollToTop from '@/components/ScrollToTop';
import { useLanguageInit } from '@/hooks/useLanguageInit';

const App: FC = () => {
  // 初始化语言设置
  useLanguageInit();

  return (
    <>
      <HashRouter>
        <ScrollToTop />
        <AppRoutes />
      </HashRouter>
    </>
  );
};

export default App;
