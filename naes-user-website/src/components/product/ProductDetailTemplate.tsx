import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useProductTranslations } from '@/hooks/useProductTranslations';
import { useTranslation } from 'react-i18next';
import { getAllProducts } from '@/data/products';
import p1Image from '@/assets/product/p1.png';
import p12Image from '@/assets/product/p1-2.jpg';
import p11Image from '@/assets/product/p1-1.jpg';
import p2Image from '@/assets/product/p2.png';
import p21Image from '@/assets/product/p2-1.jpg';
import p22Image from '@/assets/product/p2-2.png';
import p3Image from '@/assets/product/p3.png';
import p31Image from '@/assets/product/p3-1.png';
import p32Image from '@/assets/product/p3-2.jpg';
import p4Image from '@/assets/product/p4.jpg';
import p41Image from '@/assets/product/p4-1.png';
import p42Image from '@/assets/product/p4-2.jpg';
import p5Image from '@/assets/product/p5.jpg';
import p51Image from '@/assets/product/p5-1.png';
import p52Image from '@/assets/product/p5-2.png';
import p6Image from '@/assets/product/p6.png';
import p61Image from '@/assets/product/p6-1.jpg';
import p62Image from '@/assets/product/p6-2.png';
import p7Image from '@/assets/product/p7.png';
import p71Image from '@/assets/product/p7-1.png';
import p72Image from '@/assets/product/p7-2.jpg';
import p8Image from '@/assets/product/p8.png';
import p81Image from '@/assets/product/p8-1.png';
import p82Image from '@/assets/product/p8-2.png';
import p9Image from '@/assets/product/p9.jpg';
import p91Image from '@/assets/product/p9-1.jpg';
import p92Image from '@/assets/product/p9-2.jpg';
import p10Image from '@/assets/product/p10.jpg';
import p101Image from '@/assets/product/p10-1.png';
import p102Image from '@/assets/product/p10-2.png';
import { useNavigate } from 'react-router-dom';

const ProductDetailTemplate: React.FC<Product> = (product) => {
  const { t, i18n } = useTranslation('products');
  const { name, labels, primary_source } = useProductTranslations(product.id);
  const navigate = useNavigate();

  const isEnglish = i18n.language === 'en';

  // 图片画廊状态管理
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 每次进入页面时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  // 创建图片数组
  const images =
    product.id === 'pc'
      ? [p1Image, p12Image, p11Image] // 磷脂酰胆碱专用图片
      : product.id === 'bh'
        ? [p2Image, p21Image, p22Image] // 盐酸小檗碱专用图片
        : product.id === 'nmn'
          ? [p3Image, p31Image, p32Image] // NMN专用图片
          : product.id === 'pqq'
            ? [p4Image, p41Image, p42Image] // PQQ专用图片
            : product.id === 'rt'
              ? [p5Image, p51Image, p52Image] // 白藜芦醇专用图片
              : product.id === 'et'
                ? [p6Image, p61Image, p62Image] // 麦角硫因专用图片
                : product.id === 'ps'
                  ? [p7Image, p71Image, p72Image] // 磷脂酰丝氨酸专用图片
                  : product.id === 'spe'
                    ? [p8Image, p81Image, p82Image] // 锯叶棕提取物专用图片
                    : product.id === 'ua'
                      ? [p9Image, p91Image, p92Image] // 尿石素A专用图片
                      : product.id === 'gt'
                        ? [p10Image, p101Image, p102Image] // 还原型谷胱甘肽专用图片
                        : [
                            product.image,
                            product.image,
                            product.image,
                            product.image,
                          ]; // 其他产品使用默认图片

  console.log('Primary Source for', product.id, ':', primary_source);

  return (
    <div className="min-h-screen">
      <div className="pt-header container py-12">
        <Breadcrumbs />

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 p-6 lg:grid-cols-2">
          {/* 图片画廊 */}
          <div className="max-w-md space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-300 bg-white">
              <img
                src={images[selectedImageIndex]}
                alt={`${name} - 图片 ${selectedImageIndex + 1}`}
                className="h-full w-full object-contain"
              />

              {/* 左切换按钮 */}
              {images.length > 1 && (
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : images.length - 1,
                    )
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-[#204f3e] p-3 shadow-lg transition-colors duration-200 hover:bg-[#1a3f32]"
                  aria-label="上一张图片"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* 右切换按钮 */}
              {images.length > 1 && (
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev < images.length - 1 ? prev + 1 : 0,
                    )
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-[#204f3e] p-3 shadow-lg transition-colors duration-200 hover:bg-[#1a3f32]"
                  aria-label="下一张图片"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 右侧：产品信息 */}
          <div className="space-y-4">
            {/* 产品标题 */}
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">{name}</h1>
            </div>

            {/* 产品基本信息 - 使用翻译数据 */}
            <div className="!mt-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 text-base">
                  {(() => {
                    const productDetails = t(`products.${product.id}.details`, {
                      returnObjects: true,
                    });

                    if (!productDetails || typeof productDetails === 'string') {
                      return null;
                    }

                    return Object.entries(
                      productDetails as Record<string, string>,
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex border-b border-gray-100 pb-2"
                      >
                        <span className="font-medium text-gray-600">
                          {labels[key as keyof typeof labels] || key}
                        </span>
                        <span className="ml-4 text-gray-900">
                          {value as string}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="!mt-8 flex space-x-3">
              <button
                onClick={() => navigate('/contact')}
                className="rounded-lg bg-[#204f3e] px-6 py-2 text-base font-medium text-white shadow-md transition-colors duration-200 hover:bg-[#1a3f32]"
              >
                {isEnglish ? 'Inquire Now' : '立即询价'}
              </button>
              <button
                onClick={() => {
                  const allProducts = getAllProducts();
                  const currentIndex = allProducts.findIndex(
                    (p) => p.id === product.id,
                  );
                  const nextIndex = (currentIndex + 1) % allProducts.length;
                  const nextProduct = allProducts[nextIndex];
                  navigate(`/products/${nextProduct.id}`);
                }}
                className="rounded-lg bg-[#204f3e] px-6 py-2 text-base font-medium text-white shadow-md transition-colors duration-200 hover:bg-[#1a3f32]"
              >
                {isEnglish ? 'Next Product' : '下一个产品'}
              </button>
            </div>
          </div>
        </div>

        {/* 产品描述 - 全宽度显示 */}
        <div className="mx-auto mt-16 max-w-6xl p-6">
          <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
            {isEnglish ? 'Product Description' : '产品描述'}
          </h3>
          <div className="prose max-w-none">
            <div className="space-y-3 text-base leading-relaxed text-gray-700">
              {product.id === 'pc' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Phosphatidylcholine
                      (1,2-diacyl-sn-glycero-3-phosphocholine) is an amphiphilic
                      molecule composed of a hydrophilic head group and
                      hydrophobic tails, classified as a phospholipid with a
                      choline moiety in its head group. It is extracted through
                      mechanical processing or hexane extraction from natural
                      sources such as egg yolk and soybeans.
                    </p>
                    <p className="indent-4">
                      As one of the primary structural components of cell
                      membranes, phosphatidylcholine (PC) is abundantly present
                      in soybeans, egg yolks, animal livers, and fish. Being the
                      most abundant phospholipid in the human body, it serves
                      not only as a crucial maintainer of cell membrane
                      structure and fluidity but also participates in lipid
                      metabolism, neural signal transduction, and liver function
                      regulation. It is acclaimed as both the "architect of cell
                      membranes" and "guardian of liver health."
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      磷脂酰胆碱（1,2-diacyl-sn-glycero-3-phosphocholine）是一种两性分子，由亲水的头部和疏水的尾部组成，是磷脂的一种，在头部插有一个胆碱基团。通过机械加工或己烷萃取等方法可从蛋黄、大豆等来源中提取磷脂酰胆碱。
                    </p>
                    <p className="indent-4">
                      磷脂酰胆碱（PC）是细胞膜的主要组成成分之一，广泛存在于大豆、蛋黄、动物肝脏及鱼类中。作为人体内含量最丰富的磷脂，它不仅是细胞膜结构和流动性的关键维持者，还参与脂质代谢、神经信号传递及肝脏功能调节，被誉为"细胞膜的建筑师"和"肝脏健康的守护者"。
                    </p>
                  </>
                )
              ) : product.id === 'bh' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Berberine hydrochloride is an organic compound with the
                      chemical formula C20H18ClNO4. It appears as a yellow
                      crystalline powder that is readily soluble in boiling
                      water, slightly soluble in cold water, and practically
                      insoluble in cold ethanol, chloroform, and ether.
                    </p>
                    <p className="indent-4">
                      As a naturally occurring alkaloid extracted from medicinal
                      plants such as Coptis chinensis (goldthread) and
                      Phellodendron amurense (Amur cork tree), berberine
                      hydrochloride exhibits broad-spectrum biological activity.
                      Traditionally used in herbal medicine for treating
                      gastrointestinal infections and inflammation, modern
                      research has further validated its potential benefits for
                      various health applications.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      盐酸小檗碱，是一种有机化合物，化学式为C20H18ClNO4，为黄色结晶性粉末，易溶于沸水，微溶于冷水，几乎不溶于冷乙醇、氯仿和乙醚。
                    </p>
                    <p className="indent-4">
                      盐酸小檗碱是一种从多种植物中提取的生物碱，常见于黄连、黄柏等中药材中。它是一种黄色结晶粉末，具有广泛的生物活性。盐酸小檗碱在传统医学中被用于治疗胃肠道感染和炎症，现代研究也证实了其在多种健康问题上的潜在益处。
                    </p>
                  </>
                )
              ) : product.id === 'nmn' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      β-Nicotinamide Mononucleotide (NMN), also known as
                      Nicotinamide Mononucleotide, is a water-soluble compound
                      with the chemical formula C11H15N2O8P. It appears as a
                      white to off-white crystalline powder with no distinct
                      odor. This compound demonstrates excellent water
                      solubility while being insoluble in acetone and ethanol.
                      For optimal preservation, the material requires protection
                      from light and moisture at ambient temperature conditions,
                      maintaining stability for 24 months. The substance
                      exhibits weak acidity with pH values ranging between 3-4.
                      NMN finds extensive applications as a raw material in
                      pharmaceuticals, healthcare products, cosmetics, and food
                      additives. Industrial production methods include both
                      chemical synthesis and enzymatic approaches.
                    </p>
                    <p className="indent-4">
                      As the direct precursor to Nicotinamide Adenine
                      Dinucleotide (NAD+), NMN naturally occurs in foods such as
                      broccoli and avocados. Serving as a crucial molecule in
                      cellular energy metabolism, NMN elevates endogenous NAD+
                      levels to participate in regulating cellular repair,
                      energy production, and anti-aging processes. In recent
                      years, it has become a major focus in anti-aging research.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      NMN的全称为β-烟酰胺单核苷酸（β-Nicotinamide
                      Mononucleotide），别名为烟酰胺单核苷酸，化学式为C11H15N2O8P，易溶于水，为白色至微黄色、无明显气味的结晶性粉末，常温下需避光和防水保存（使用期限为24个月），具有弱酸性（pH
                      =
                      3~4），被广泛用于药物、医疗和化妆品原料和食品添加剂，工业合成方法有化学法和生物法。
                    </p>
                    <p className="indent-4">
                      β-烟酰胺单核苷酸（NMN）是烟酰胺腺嘌呤二核苷酸（NAD+）的直接前体，广泛存在于西兰花、牛油果等天然食物中。作为细胞能量代谢的关键分子，NMN通过提升体内NAD+水平，参与调节细胞修复、能量生成和抗衰老过程，近年来成为抗衰老领域的研究热点。
                    </p>
                  </>
                )
              ) : product.id === 'pqq' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Pyrroloquinoline quinone (abbreviated as PQQ) is an
                      aromatic ortho-quinone compound with the chemical formula
                      C14H6N2O8 and a molecular weight of 330.206. It appears as
                      a reddish-brown powder and is readily soluble in water.
                      Industrially, PQQ is typically produced through chemical
                      synthesis or microbial fermentation.
                    </p>
                    <p className="indent-4">
                      Pyrroloquinoline quinone disodium salt (PQQ) is a
                      water-soluble redox coenzyme naturally found in soil
                      microorganisms, certain plants (e.g., kiwifruit, green
                      peppers), and fermented foods. As a key regulator of
                      mitochondrial function, PQQ stimulates mitochondrial
                      biogenesis, scavenges free radicals, and plays vital roles
                      in cellular energy metabolism and antioxidant defense,
                      earning it the reputation as a "next-generation
                      antioxidant."
                    </p>
                    <p className="indent-4">
                      Pyrroloquinoline quinone disodium salt (PQQ) is currently
                      applied in various fields: Animal Production: Enhances
                      growth and reproductive performance in mammals and
                      regulates lipid metabolism in poultry. Pharmaceuticals:
                      Shows significant potential for preventing and treating
                      neurodegenerative diseases, physical injuries, and
                      obesity-related disorders. Agriculture: Increases
                      microbial populations in soil, boosts available phosphorus
                      content, and elevates plant chlorophyll levels to promote
                      crop growth.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      吡咯喹啉醌（英文名为pyrroloquinoline
                      quinone，简写为PQQ），化学分子式是C14H6N2O8，分子量为330.206，是一种芳香族邻醌化合物。它外观呈现红褐色，易溶于水。工业上通常通过化学法和微生物发酵法来生产PQQ。
                    </p>
                    <p className="indent-4">
                      吡咯并喹啉醌二钠盐（PQQ）是一种水溶性的氧化还原辅酶，天然存在于土壤微生物、部分植物（如奇异果、青椒）及发酵食品中。它作为线粒体功能的关键调控因子，能够刺激线粒体生物合成，清除自由基，并在细胞能量代谢、抗氧化防御中发挥重要作用，被誉为"新一代抗氧化剂"。
                    </p>
                    <p className="indent-4">
                      在动物生产领域，PQQ可促进哺乳动物生长繁殖性能，也可以调节禽类脂质代谢；在医药领域，PQQ在神经退行性疾病、机体损伤及肥胖综合征疾病领域的预防和治疗方面潜力很大；在植物领域，PQQ可以增加土壤中微生物数量、提高有效磷含量和植物叶绿素含量，从而促进植物的生长。
                    </p>
                  </>
                )
              ) : product.id === 'rt' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Resveratrol (chemical name: 3,5,4'-trihydroxystilbene) is
                      a stilbenoid polyphenol compound with the molecular
                      formula C14H12O3 (molecular weight:228.24). It appears as
                      white needle-like crystals and functions as a phytoalexin
                      — a protective compound produced by plants in response to
                      stress. Initially isolated from the roots of Veratrum
                      species (North American plants), it derives its name from
                      this source.
                    </p>
                    <p className="indent-4">
                      As a naturally occurring polyphenol, resveratrol is
                      abundant in grape skins, red wine blueberries and peanuts.
                      Resveratrol exhibits remarkable biological activities,
                      demonstrating pharmacological effects including antitumor
                      properties, cardiovascular protection, antioxidant
                      activity, antibacterial and antiviral actions,
                      hepatoprotection, anti-inflammatory effects, and immune
                      modulation. It is also utilized as a dietary supplement
                      for health maintenance and disease prevention.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      白藜芦醇（Resveratrol），化学名为三羟基芪，是一种含有芪类结构的二苯乙烯类多酚化合物。分子式为C14H12O3，分子量228.24。白藜芦醇为白色针状结晶，是植物受到刺激时产生的一种自身保护因子，最初是从北美的植物白藜芦（Veratrum）根部分离得到，因此得名。
                    </p>
                    <p className="indent-4">
                      白藜芦醇是一种天然多酚类化合物，广泛存在于葡萄皮、红酒、蓝莓、花生等植物中。白藜芦醇的生物活性显著，具有抗肿瘤、保护心血管系统、抗氧化、抗菌、抗病毒、保肝、抗炎、调节免疫等药理作用。白藜芦醇也可作为膳食补充剂，用于人体保健和疾病的预防。
                    </p>
                  </>
                )
              ) : product.id === 'et' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Ergothioneine (2-mercapto-L-histidine betaine, EGT) is a
                      compound first discovered in 1909 from ergot fungus. In
                      its pure form, it appears as white crystals that are
                      readily soluble in water and resistant to auto-oxidation
                      at physiological pH and in strong alkaline solutions.
                    </p>
                    <p className="indent-4">
                      Ergothioneine (EGT) is a natural sulfur-containing amino
                      acid antioxidant that was listed by the journal Nature as
                      one of the candidate substances for "longevity vitamins".
                      It is primarily found in mushrooms (such as porcini),
                      oats, rye, and animal liver and kidneys. Its unique
                      molecular structure gives it exceptional antioxidant
                      stability, enabling multiple physiological functions
                      including free radical scavenging, detoxification,
                      maintaining DNA biosynthesis, supporting normal cell
                      growth, and modulating cellular immunity.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      麦角硫因（巯基组氨酸三甲基内盐，ergothioneine，EGT）是1909年发现的一种化合物，最初在一种麦角菌中被发现，纯品是白色晶体，易溶于水，在生理pH值下和强碱溶液中不会自身氧化。
                    </p>
                    <p className="indent-4">
                      麦角硫因（EGT）是一种天然含硫氨基酸类抗氧化剂，被《Nature》期刊列为"长寿维生素"候选物质之一。主要存在于蘑菇（如牛肝菌）、燕麦、黑麦及动物肝脏、肾脏中。其独特的分子结构使其具有卓越的抗氧化稳定性，它具有清除自由基，解毒，维持DNA的生物合成，细胞的正常生长及细胞免疫等多种生理功能。
                    </p>
                  </>
                )
              ) : product.id === 'ps' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Phosphatidylserine is an essential membrane phospholipid
                      with the chemical formula C42H82NO10P (molecular weight:
                      792.1 g/mol), appearing as a white waxy solid. It is
                      produced via solvent extraction, chemical synthesis, or
                      enzymatic conversion, and is approved as a novel food
                      ingredient with broad applications in pharmaceuticals and
                      functional foods.
                    </p>
                    <p className="indent-4">
                      Naturally present in cell membranes (particularly brain
                      cells), PS is primarily derived from soybeans, cabbage,
                      animal brain tissues and fish. As a key structural
                      component of the brain, PS regulates neurotransmission,
                      membrane fluidity, and neurotransmitter release.
                      Recognized as "nutrient for brain cell membranes", it is
                      widely used in cognitive health and anti-aging
                      formulations.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      磷脂酰丝氨酸是一种重要的膜磷脂，化学式为C42H82NO10P，摩尔质量为792.1g/mol，外观为白色蜡状固体。磷脂酰丝氨酸的制备方法主要有溶剂提取法、化学合成法和酶转化法。是一种新资源食品，在制药和功能食品领域具有广泛的应用。
                    </p>
                    <p className="indent-4">
                      磷脂酰丝氨酸（PS）是一种天然存在于细胞膜（尤其是脑细胞）中的磷脂，主要来源于大豆、卷心菜、动物脑组织及鱼类。作为大脑的关键结构成分，它参与调节神经信号传递、细胞膜流动性及神经递质释放，被誉为"脑细胞膜的营养素"，广泛应用于认知健康与抗衰老领域。
                    </p>
                  </>
                )
              ) : product.id === 'spe' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Saw Palmetto Extract is a powdered substance derived from
                      the fruits of Saw Palmetto (Serenoa repens), native to
                      tropical regions of the Americas. It is produced through
                      supercritical extraction of oils followed by
                      β-cyclodextrin encapsulation technology. The main active
                      components are unsaturated fatty acids such as oleic acid
                      and linoleic acid (content 25%-45%), detected by gas
                      chromatography. Clinically used as adjuvant therapy for
                      prostate hyperplasia and related urinary system diseases,
                      it has anti-inflammatory, antibacterial, and diuretic
                      effects.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      锯叶棕提取物是以原产美洲热带地区的锯叶棕果实为原料，经超临界萃取法提取油脂后，通过β-环状糊精包裹工艺制成的粉末状物质。其主要有效成分为油酸、亚油酸等不饱和脂肪酸（含量25%-45%），采用气相色谱法检测成分，临床上用于前列腺增生及相关泌尿系统疾病的辅助治疗，具有抗炎、抗菌和利尿作用。
                    </p>
                  </>
                )
              ) : product.id === 'ua' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Urolithin A (English: Urolithin A, abbreviation Uro-A) is
                      one of the urolithin isomers with the molecular formula
                      C13H8O4. Urolithin A is a natural compound produced by gut
                      microbiota through metabolism of ellagitannins (found in
                      pomegranates, nuts and other foods). Recent studies have
                      confirmed the positive effects of Urolithin A on aging and
                      age-related diseases.
                    </p>
                    <p className="indent-4">
                      It can improve mitochondrial function by clearing damaged
                      mitochondria from cells and promoting the growth of
                      healthy mitochondria. Urolithin A is classified as a
                      mitophagy activator. With high bioavailability and
                      potential anti-aging and cell vitality-enhancing
                      properties, it has become a research hotspot in the health
                      field in recent years.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      尿石素A（英语：Urolithin
                      A，缩写Uro-A）是尿石素的异构体之一，分子式是C13H8O4。尿石素A是由肠道菌群代谢石榴、坚果等食物中的鞣花单宁（Ellagitannins）生成的天然化合物，最近的几项研究已经确定药尿石素
                      A 对衰老和年龄相关疾病的积极影响。
                    </p>
                    <p className="indent-4">
                      可以通过清洁细胞中受损的线粒体和促进健康线粒体的生长来改善线粒体功能，尿石素A属于线粒体自噬激活剂。其生物利用度高，具有抗衰老、增强细胞活力的潜力，近年成为健康领域的研究热点。
                    </p>
                  </>
                )
              ) : product.id === 'gt' ? (
                isEnglish ? (
                  <>
                    <p className="indent-4">
                      Glutathione is a tripeptide compound composed of
                      glutamate, cysteine, and glycine, serving as a potent
                      endogenous antioxidant in the human body. Recognized as
                      the "master antioxidant", it maintains redox balance by
                      neutralizing free radicals and regenerating other
                      antioxidant molecules (e.g., vitamins C/E). It plays
                      pivotal roles in detoxification, immune modulation, and
                      cellular protection.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="indent-4">
                      谷胱甘肽是由谷氨酸、半胱氨酸和甘氨酸组成的三肽化合物，是人体内天然存在的强效抗氧化剂。作为"抗氧化剂之母"，其通过中和自由基、再生其他抗氧化分子（如维生素C/E）维持氧化还原平衡，并在解毒、免疫调节及细胞保护中发挥核心作用。
                    </p>
                  </>
                )
              ) : (
                // 其他产品使用翻译系统
                <div className="whitespace-pre-line">
                  {t(`products.${product.id}.description`)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 基本分析表格 - 放在益处之前 */}
        <div className="mx-auto max-w-6xl">
          {product.id === 'pc' && (
            <div className="mt-16 p-6">
              <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                {isEnglish ? 'Analysis Report' : '基本分析'}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                        {isEnglish ? 'Specification' : '规格'}
                      </th>
                      <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                        {isEnglish ? 'Appearance' : '外观'}
                      </th>
                      <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                        {isEnglish ? 'Lecithin Content（%）' : '卵磷脂（%）'}
                      </th>
                      <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                        {isEnglish
                          ? 'Acetone Insolubles（%）'
                          : '丙酮不溶性物质（%）'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr className="bg-white">
                      <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                        20%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        {isEnglish
                          ? 'White to pale yellow powder'
                          : '白色至浅黄色粉末'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥20
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥60
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                        25%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        {isEnglish ? 'Pale yellow powder' : '浅黄色粉末'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥25
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥60
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                        35%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        {isEnglish ? 'Pale yellow powder' : '浅黄色粉末'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥35
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥60
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                        50%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        {isEnglish
                          ? 'Yellow to brownish-yellow solid'
                          : '黄色至棕黄色固体'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥50
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥97
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                        60%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        {isEnglish
                          ? 'Yellow to brownish-yellow solid'
                          : '黄色至棕黄色固体'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥60
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                        ≥97
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 盐酸小檗碱专用检测表格 */}
          {product.id === 'bh' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'Yellow crystalline powder'
                            : '黄色晶状粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'Yellow crystalline powder'
                            : '黄色晶状粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥97%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          97.36%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Water content' : '水分'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤12%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          10.9%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Residue on ignition' : '灼烧残留'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.2%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.15%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Jatrorrhizine' : '药根碱'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Palmatine' : '巴马汀'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1000CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤80CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NMN专用检测表格 */}
          {product.id === 'nmn' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'Off-white to white powder'
                            : '类白色或白色粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'White powder' : '白色粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥99.5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.9%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Water content' : '水分'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.08%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'pH' : 'PH值'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          3.0～4.0
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          3.4
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Ethanol' : '乙醇'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤500 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合规'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属含量'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属含量'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Cadmium (Cd)' : '镉（Cd）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.2 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤500 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.92 MPN/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤50 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Staphylococcus aureus'
                            : '金黄色葡萄球菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PQQ专用检测表格 */}
          {product.id === 'pqq' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Reddish-brown powder' : '红褐色粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Reddish-brown powder' : '红褐色粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Assay(anhydrous basis)'
                            : '含量（无水计）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥98.0%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.2%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥99.0%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.7%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Water Content' : '水分'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤12%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          11.2%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Residual Solvents' : '有机溶剂'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属含量'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属含量'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Cadmium (Cd)' : '镉（Cd）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤500 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.92 MPN/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤50 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Staphylococcus aureus'
                            : '金黄色葡萄球菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 白藜芦醇专用检测表格 */}
          {product.id === 'rt' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'White or off-white crystalline powder'
                            : '白色或类白色结晶粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'White or off-white crystalline powder'
                            : '类白色结晶粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Assay(Content)' : '含量'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥99.0%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.83%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Melting Point' : '熔点'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          258～263℃
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          258～260℃
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Loss on Drying' : '干燥失重'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.13%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Water Content' : '水分'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.1%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属含量'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属含量'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤2.0 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Cadmium (Cd)' : '镉（Cd）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1.0 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤2.0 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1000 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤100 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 麦角硫因专用检测表格 */}
          {product.id === 'et' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'White or off-white crystalline powder'
                            : '白色或类白色粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'White powder' : '白色粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥95%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.8%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Water content' : '水分'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤2.0%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.12%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Residue on ignition' : '灼烧残留'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.5%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属含量'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属含量'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Cadmium (Cd)' : '镉（Cd）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤750 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤100 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 磷脂酰丝氨酸专用检测表格 */}
          {product.id === 'ps' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Light yellow powder' : '淡黄色粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Light yellow powder' : '淡黄色粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          20%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          20.22%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mesh size' : '网格体大小'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? '100% pass through 80-mesh sieve'
                            : '100%通过80目'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '符合'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Residue on ignition' : '灼烧残留'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          2.84%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Loss on drying' : '干燥损失'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          2.55%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属含量'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属含量'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Heavy Metal' : '重金属'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤10 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤2.0 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1.0 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1000 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤100 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 尿石素A专用检测表格 */}
          {product.id === 'ua' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Light yellow powder' : '浅黄色粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Light yellow powder' : '浅黄色粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥97.0%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.30%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Water content' : '水分'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤3%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.14%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Maximum individual impurity'
                            : '最大单杂'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1.0%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Organic solvent residues' : '有机溶剂'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤3000 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属检测'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Cadmium (Cd)' : '镉（Cd）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '微生物总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤500 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Escherichia coli' : '大肠杆菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.92 MPN/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤50 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Staphylococcus aureus'
                            : '金黄色葡萄球菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 还原型谷胱甘肽专用检测表格 */}
          {product.id === 'gt' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Analysis Report' : '基本分析'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Parameter' : '项目'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Result' : '结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Appearance' : '外观'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'White or off-white crystalline powder'
                            : '白色或类白色结晶粉末'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish
                            ? 'White crystalline powder'
                            : '白色结晶粉末'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Purity (HPLC)' : '纯度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≥98%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          99.8%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Related Substances(Total)'
                            : '相关杂质(Total)'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜2%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.98%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Related Substances(GSSG)'
                            : '相关杂质(GSSG)'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ＜1.5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.54%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Optical Rotation' : '旋光度'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          -15°～-17.5°
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          -16.23°
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Residue on ignition' : '灼烧残渣'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.1%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.03%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Loss on drying' : '干燥失重'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤0.5%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          0.2%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Chloride' : '氯化物'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤200 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Sulfate' : '硫酸盐'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤300 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Ammonium' : '铵'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤200 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Iron' : '铁'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤20 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Heavy Metal Specifications' : '重金属含量'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish
                            ? 'Heavy Metal Specifications'
                            : '重金属含量'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Limit' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Compliance' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Lead (Pb)' : '铅（Pb）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          3 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Mercury (Hg)' : '汞（Hg）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          2 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Cadmium (Cd)' : '镉（Cd）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          1 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Arsenic (As)' : '砷（As）'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          2 ppm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                  {isEnglish ? 'Microbiological Parameters' : '微生物检测'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Microbiological Parameters' : '微生物'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Specification' : '标准'}
                        </th>
                        <th className="px-4 py-3 text-left text-base font-medium uppercase tracking-wider text-gray-500">
                          {isEnglish ? 'Test Result' : '检测结果'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Total Aerobic Microbial Count'
                            : '菌落总数'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1000 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Molds & Yeasts' : '霉菌和酵母'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤100 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish
                            ? 'Staphylococcus aureus'
                            : '金黄色葡萄球菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-base font-medium text-gray-900">
                          {isEnglish ? 'Salmonella spp.' : '沙门氏菌'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          ≤1000 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-base text-gray-500">
                          {isEnglish ? 'Compliant' : '合格'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 产品益处 - 全宽度显示 */}
        {(() => {
          const benefits = t(`products.${product.id}.benefits`, {
            returnObjects: true,
          });
          if (
            !benefits ||
            typeof benefits === 'string' ||
            !Array.isArray(benefits) ||
            benefits.length === 0
          ) {
            return null;
          }
          return (
            <div className="mx-auto mt-16 max-w-6xl p-6">
              <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                {isEnglish
                  ? product.id === 'pc'
                    ? 'Benefits of Phosphatidylcholine (PC) Supplementation:'
                    : product.id === 'bh'
                      ? 'Benefits of Berberine hydrochloride Supplementation:'
                      : 'Benefits:'
                  : '益处：'}
              </h3>
              <div className="prose max-w-none">
                <ol className="list-inside list-decimal space-y-3 leading-relaxed text-gray-700">
                  {benefits.map((benefit: any, index: number) => (
                    <li key={index} className="text-base">
                      <strong>{benefit.title}：</strong>
                      {benefit.description}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })()}

        {/* 产品运用 - 全宽度显示 */}
        {(() => {
          const applications = t(`products.${product.id}.applications`, {
            returnObjects: true,
          });
          if (
            !applications ||
            typeof applications === 'string' ||
            !Array.isArray(applications) ||
            applications.length === 0
          ) {
            return null;
          }
          return (
            <div className="mx-auto mt-16 max-w-6xl p-6">
              <h3 className="mb-4 text-xl font-bold text-[#204f3e]">
                {isEnglish ? 'Applications:' : '运用：'}
              </h3>
              <div className="prose max-w-none">
                <ol className="list-inside list-decimal space-y-3 leading-relaxed text-gray-700">
                  {applications.map((application: any, index: number) => (
                    <li key={index} className="text-base">
                      <strong>{application.title}：</strong>
                      {application.description}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })()}

        {/* 其他产品的检测表格 */}
        <div className="mx-auto max-w-6xl">
          {/* NMN专用检测表格 */}
          {product.id === 'nmn' && (
            <div className="space-y-8">
              {/* 产品规格表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-8 text-2xl font-semibold">
                  {labels.product_specification_table}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.item}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.standard}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.result}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          外观
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          类白色或白色粉末
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          符合
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          纯度
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≥99.5%
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          99.9%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          水分
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤0.5%
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          0.08%
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          PH值
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          3.0～4.0
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          3.4
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          乙醇
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤500 ppm
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合规
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 重金属检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-8 text-2xl font-semibold">
                  {labels.heavy_metals_test_table}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.heavy_metal_content}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.standard}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.test_result}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          铅（Pb）
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          汞（Hg）
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          镉（Cd）
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤0.2 ppm
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          砷（As）
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤0.1 ppm
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 微生物检测结果表 */}
              <div className="mt-16 p-6">
                <h3 className="mb-8 text-2xl font-semibold">
                  {labels.microorganism_test_table}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.microorganism}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.standard}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500">
                          {labels.test_result}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          微生物总数
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤500 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          大肠杆菌
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤0.92 MPN/g
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          霉菌和酵母
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ≤50 CFU/g
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ＜10
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          金黄色葡萄球菌
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          沙门氏菌
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          N.D
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          合格
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTemplate;
