import heroImage from '@/assets/images/hero.jpg';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation('home');

    return (
        <section
            className="relative w-full h-screen bg-no-repeat bg-center mt-12" // 添加 h-screen 使高度充满视口
            style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed" // 可选：添加视差滚动效果
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center text-white text-center px-4">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                    {t('hero.title')}
                </h2>
                {/* 可选：添加副标题或按钮 */}
                {/* <p className="text-xl md:text-2xl mb-8 max-w-2xl">{t('hero.subtitle')}</p>
        <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition">
          {t('hero.cta')}
        </button> */}
            </div>
        </section>
    );
};

export default Hero;