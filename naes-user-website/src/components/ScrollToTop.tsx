import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 滚动到顶部组件
 * 在路由变化时自动将页面滚动到顶部
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // 页面路由变化时滚动到顶部
        window.scrollTo({
            top: 0,
            left: 0,
        });
    }, [pathname]); // 依赖pathname，路由变化时触发

    return null; // 这个组件不渲染任何内容
};

export default ScrollToTop;
