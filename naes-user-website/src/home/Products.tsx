import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllProducts, getProductById } from '@/data/products';
import MoreButton from '@/components/MoreButton';
import { useProductTranslations } from '@/hooks/useProductTranslations';

// 桌面端水平滚动配置 - 动态计算一个卡片的宽度

const Products = () => {
  const { t } = useTranslation('products');
  const products = getAllProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 计算容器滚动可用状态（仅桌面端水平）
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScroll - 1);
  }, []);

  // 滚动处理函数（仅桌面端水平）
  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;

      // 动态计算一个卡片的宽度（包含间距）
      // 卡片宽度为容器的 31%，gap-16 为 64px
      const containerWidth = el.clientWidth;
      const cardWidth = containerWidth * 0.31; // 31% 宽度
      const gap = 64; // gap-16 = 64px
      const scrollOffset = cardWidth + gap;

      const current = el.scrollLeft;
      let next =
        current + (direction === 'left' ? -scrollOffset : scrollOffset);
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      next = Math.max(0, Math.min(next, maxScroll));
      el.scrollTo({ left: next, behavior: 'smooth' });
      setTimeout(updateScrollState, 0);
    },
    [updateScrollState],
  );

  // 监听滚动与窗口变化，更新左右按钮显隐
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', onResize);
    };
  }, [updateScrollState]);

  // 产品卡片组件（桌面端）
  const ProductCard = ({ productId }: { productId: string }) => {
    const product = getProductById(productId);
    const { name } = useProductTranslations(productId);

    return (
      <div className="h-[500px] w-[31%] flex-shrink-0 snap-start rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <Link to={`/products/${productId}`} className="flex h-full flex-col">
          <div className="h-3/4 overflow-hidden">
            <img
              src={product.image}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col p-4">
            <h3 className="mb-2 text-xl font-semibold">{name}</h3>
            <div className="mt-auto">
              <MoreButton>{t('list.learnMore')}</MoreButton>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <section className="container relative mx-auto h-[100vh] max-w-6xl">
      <h2 className="mb-16 text-center text-2xl font-bold md:text-3xl">
        {t('hero.title')}
      </h2>

      <div className="relative h-[500px] overflow-hidden">
        {/* 导航按钮（到达边界时隐藏） */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#204f3e] p-3 shadow-md transition-colors hover:bg-[#1a3f32]"
            aria-label={t('navigation.previous')}
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#204f3e] p-3 shadow-md transition-colors hover:bg-[#1a3f32]"
            aria-label={t('navigation.next')}
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        )}

        {/* 滚动容器 */}
        <div
          ref={scrollRef}
          className="hide-scrollbar flex h-full w-full gap-16 overflow-x-auto overflow-y-hidden scroll-smooth"
        >
          {products.map((p) => (
            <ProductCard key={p.id} productId={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
