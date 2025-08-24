import { useTranslation } from 'react-i18next';

interface ProductTranslations {
  name: string;
  description: string;
  highlights: string[];
  benefits: Array<{
    title: string;
    description: string;
  }>;
  primary_source?: string;
  details?: {
    cas_number: string;
    specification: string;
    appearance: string;
    molecular_formula: string;
    solubility: string;
    package: string;
    sample: string;
    certificate: string;
  };
  labels: {
    primary_source: string;
    benefits: string;
    specifications: string;
    percentage: string;
    state: string;
    packaging: string;
    source: string;
    cas_number: string;
    specification: string;
    appearance: string;
    molecular_formula: string;
    solubility: string;
    package: string;
    minimum_order: string;
    sample: string;
    certificate: string;
    product_specification_table: string;
    heavy_metals_test_table: string;
    microorganism_test_table: string;
    item: string;
    standard: string;
    result: string;
    test_result: string;
    heavy_metal_content: string;
    heavy_metal_test: string;
    microorganism: string;
  };
}

export const useProductTranslations = (
  productId: string,
): ProductTranslations => {
  const { t } = useTranslation('products');

  // 获取 primary_source，如果是空字符串则转为 undefined
  const primarySource = t(`products.${productId}.primary_source`, {
    defaultValue: undefined,
  });

  // 尝试获取产品详细信息
  const details = t(`products.${productId}.details`, {
    returnObjects: true,
    defaultValue: null,
  }) as any;

  return {
    name: t(`products.${productId}.name`),
    description: t(`products.${productId}.description`),
    highlights: t(`products.${productId}.highlights`, {
      returnObjects: true,
    }) as string[],
    primary_source: primarySource,
    benefits: t(`products.${productId}.benefits`, {
      returnObjects: true,
    }) as Array<{
      title: string;
      description: string;
    }>,
    details: details && typeof details === 'object' ? details : undefined,
    labels: {
      primary_source: t('detail.primary_source'),
      benefits: t('detail.benefits'),
      specifications: t('detail.specifications'),
      percentage: t('detail.percentage'),
      state: t('detail.state'),
      packaging: t('detail.packaging'),
      source: t('detail.source'),
      cas_number: t('detail.cas_number'),
      specification: t('detail.specification'),
      appearance: t('detail.appearance'),
      molecular_formula: t('detail.molecular_formula'),
      solubility: t('detail.solubility'),
      package: t('detail.package'),
      minimum_order: t('detail.minimum_order'),
      sample: t('detail.sample'),
      certificate: t('detail.certificate'),
      product_specification_table: t('detail.product_specification_table'),
      heavy_metals_test_table: t('detail.heavy_metals_test_table'),
      microorganism_test_table: t('detail.microorganism_test_table'),
      item: t('detail.item'),
      standard: t('detail.standard'),
      result: t('detail.result'),
      test_result: t('detail.test_result'),
      heavy_metal_content: t('detail.heavy_metal_content'),
      heavy_metal_test: t('detail.heavy_metal_test'),
      microorganism: t('detail.microorganism'),
    },
  };
};
