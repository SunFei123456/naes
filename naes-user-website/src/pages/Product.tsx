import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import productHeroImage from '@/assets/images/product-banner.png';
import MoreButton from '@/components/MoreButton';
import { getAllProducts } from '@/data/products';
import { useTranslation } from 'react-i18next';

const ProductPage = () => {
  const { t } = useTranslation('products');
  const products = getAllProducts();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="mt-header h-[300px] w-full bg-cover bg-center md:h-[320px]"
        style={{
          backgroundImage: `url(${productHeroImage})`,
          backgroundPosition: 'center 32%',
        }}
      ></div>
      <Breadcrumbs />

      <section className="container mx-auto  max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-16 py-16 md:grid-cols-3">
          {products.map((product) => {
            const name = t(`products.${product.id}.name`);
            const description = t(`products.${product.id}.description`);

            return (
              <div
                key={product.id}
                className="rounded-lg shadow-lg hover:shadow-xl"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="h-96 overflow-hidden">
                    <img
                      src={product.image}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-semibold">{name}</h3>
                    <p className="mb-4 line-clamp-2 text-gray-600">
                      {description}
                    </p>
                    <MoreButton>{t('list.learnMore')}</MoreButton>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
