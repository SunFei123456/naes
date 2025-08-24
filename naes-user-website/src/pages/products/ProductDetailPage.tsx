import { useParams } from "react-router-dom";
import ProductDetailTemplate from "@/components/product/ProductDetailTemplate";
import { getProductById } from "@/data/products";
import NotFound from "@/pages/NotFound";

const ProductDetailPage = () => {
  const { productId } = useParams();

  if (!productId) return <NotFound />;

  const product = getProductById(productId);
  if (!product) return <NotFound />;

  return <ProductDetailTemplate {...product} />;
};

export default ProductDetailPage;