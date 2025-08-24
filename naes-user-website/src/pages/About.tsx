import Breadcrumbs from "../components/Breadcrumbs";
import aboutHeroImage from '@/assets/images/aboutHero.jpg';
import aboutImage from '@/assets/images/about.jpg';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation('about');

    // // 明确指定返回类型为字符串数组
    // const points = t('content.points', { returnObjects: true }) as string[];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="w-full h-[400px] md:h-[500px] bg-cover bg-center mt-header"
                style={{ backgroundImage: `url(${aboutHeroImage})` }}>
            </div>
            {/* 面包屑 */}
            <Breadcrumbs />
            {/* Content Section */}
            <div className="container max-w-6xl mx-auto px-6 h-[100vh] flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-center mb-12">{t('content.title')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* 左侧文本 */}
                    <div className="text-gray-700 space-y-4">
                        <p className="text-lg leading-relaxed">{t('content.description')}</p>
                        {/*<ul className="list-disc pl-5 space-y-2">*/}
                        {/*    {points.map((point: string, index: number) => (*/}
                        {/*      <li key={index}>{point}</li>*/}
                        {/*    ))}*/}
                        {/*</ul>*/}
                    </div>

                    {/* 右侧图片 */}
                    <div>
                        <img src={`${aboutImage}`} alt="Company Building" className="w-full rounded-lg shadow-lg" />
                    </div>
                </div>
            </div>

            {/*/!* Statistics Section *!/*/}
            {/*<div className="container max-w-6xl mx-auto px-6 bg-gray-100 py-12">*/}
            {/*    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">*/}
            {/*        <div>*/}
            {/*            <h2 className="text-2xl font-bold">2021</h2>*/}
            {/*            <p className="text-gray-600">{t('stats.founded')}</p>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <h2 className="text-2xl font-bold">219 acres</h2>*/}
            {/*            <p className="text-gray-600">{t('stats.area')}</p>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <h2 className="text-2xl font-bold">164,000㎡</h2>*/}
            {/*            <p className="text-gray-600">{t('stats.construction')}</p>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <h2 className="text-2xl font-bold">1.2B RMB</h2>*/}
            {/*            <p className="text-gray-600">{t('stats.investment')}</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default AboutPage;