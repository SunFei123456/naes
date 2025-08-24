import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import WhyChooseUs from '../pages/WhyChooseUs';
import Contact from '../pages/Contact';
import Products from '../pages/Product';
import ProductDetail from '@/pages/products/ProductDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/** About 页面暂不展示 */}
      <Route
        path="/why-choose-us"
        element={
          <Layout>
            <WhyChooseUs />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <Products />
          </Layout>
        }
      />
      <Route
        path="/products/:productId"
        element={
          <Layout>
            <ProductDetail />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      {/** Q&A 页面暂不展示 */}
    </Routes>
  );
};

export default AppRoutes;
