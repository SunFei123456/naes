import Breadcrumbs from '../components/Breadcrumbs';
import whyChooseUsHeroImage from '@/assets/images/aboutHero.jpg';
import whyChooseUsImage from '@/assets/images/why-us.png';
import whyUsBackground from '@/assets/images/why-us-ditu.jpg';
import { useTranslation } from 'react-i18next';

// 导入tag 图片
import tag from '@/assets/images/tag.jpg';

const WhyChooseUsPage = () => {
  const { t } = useTranslation('whyChooseUs');

  // 优势数据
  const advantages = [
    {
      title: t('advantages.team.title', '年轻活力的团队'),
      content: t(
        'advantages.team.content',
        '紧跟政策与热点为您解决痛点和难点：了解各个地区的保健品消费市场，为您提供更优的采购方案和技术协作服务，帮你节省时间成本，更快速的切入市场需求。',
      ),
    },
    {
      title: t('advantages.service.title', '一对一管家服务'),
      content: t(
        'advantages.service.content',
        '从生产线到交货全流程为您把关：专员负责您的订单，提供订单进程汇报，让您了解货物情况，省心收货，随时提供技术应急响应，帮您解决实际突发问题。',
      ),
    },
    {
      title: t('advantages.quality.title', '专业机构品质把控'),
      content: t(
        'advantages.quality.content',
        '让原材料成为您在激烈市场竞争中的制胜法宝：样品既是货品，我们拥有严格的QA监管体系，确保货物品质符合您的需求，希望成为您的长期合作伙伴。',
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section - 第一屏 */}
      <div className="relative flex flex-col">
        <div
          className="mt-header h-[300px] w-full bg-cover bg-center md:h-[320px]"
          style={{ backgroundImage: `url(${whyChooseUsHeroImage})` }}
        ></div>

        {/* 面包屑 */}
        <Breadcrumbs />

        {/* Content Section */}
        <div className="bg-white py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              {/* 左侧文本 */}
              <div className="text-gray-700">
                <h2 className="mb-6 text-3xl font-bold text-gray-800">
                  {t('content.mainTitle')}
                </h2>
                <p className="text-lg leading-relaxed">
                  {t('content.mainDescription')}
                </p>

                <img src={tag} alt="tag" className="mt-6 border-none" />
              </div>

              {/* 右侧图片 */}
              <div>
                <img
                  src={`${whyChooseUsImage}`}
                  alt="Why Choose Us"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us 卡片式设计 - 第二屏 */}
      <div
        className="relative min-h-800px] overflow-hidden bg-cover bg-center bg-no-repeat py-12 md:py-16"
        style={{ backgroundImage: `url(${whyUsBackground})` }}
      >
        <div className=" relative mx-auto max-w-6xl px-6">
          {/* 标题 */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800">
              {t('advantages.sectionTitle', 'Why Choose Us?')}
            </h2>
          </div>

          {/* 三个优势点 - 明显的阶梯式排列 */}
          <div className="space-y-12">
            {/* 第一个优势 - Young & Dynamic Team (最左边) */}
            <div className="relative">
              <div className="max-w-3xl lg:ml-0">
                <h3 className="text-2xl font-bold text-[#204f3e]">
                  {advantages[0].title}
                </h3>
                <div className="my-3 h-0.5 w-full border-b-2 border-dashed border-[#2e6b56] opacity-80"></div>
                <p className="text-lg leading-relaxed text-gray-500">
                  {advantages[0].content}
                </p>
              </div>
            </div>

            {/* 第二个优势 - One-on-One Butler Service (中间缩进) */}
            <div className="relative">3
              <div className="max-w-3xl lg:ml-72">
                <h3 className="text-2xl font-bold text-[#204f3e]">
                  {advantages[1].title}
                </h3>
                <div className=" my-3 h-0.5 w-full border-b-2 border-dashed border-[#2e6b56] opacity-80"></div>
                <p className="text-lg leading-relaxed text-gray-500">
                  {advantages[1].content}
                </p>
              </div>
            </div>

            {/* 第三个优势 - Professional Quality Control (最右边) */}
            <div className="relative">
              <div className="max-w-3xl lg:ml-[550px]">
                <h3 className=" text-2xl font-bold text-[#204f3e]">
                  {advantages[2].title}
                </h3>
                <div className="my-3 h-0.5 w-full border-b-2 border-dashed border-[#2e6b56] opacity-80"></div>
                <p className="text-lg leading-relaxed text-gray-500">
                  {advantages[2].content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsPage;

