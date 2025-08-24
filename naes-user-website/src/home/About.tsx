import aboutImage from '@/assets/images/about.jpg';
import Button from '@/components/Button';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation('home');

  return (
    <section className="container mx-auto flex h-[100vh] max-w-6xl flex-col items-center justify-center">
      {/* 第一部分：标题 */}
      <h2 className="mb-12 text-center text-3xl font-bold">
        {t('about.title')}
      </h2>

      {/* 第二部分：左右布局 */}
      <div className="flex flex-col items-start justify-between gap-20 md:flex-row">
        {/* 左侧：文字 + 按钮 */}
        <div className="text-center md:w-1/2 md:text-left ">
          <p className="mb-4 text-lg text-gray-700">
            {t('about.mainSection.text')}
          </p>
          <Button to="/contact">{t('about.mainSection.button')}</Button>
        </div>

        {/* 右侧：图片 */}
        <div className="md:w-1/2">
          <img
            src={`${aboutImage}`}
            alt="About Us"
            className="h-96 w-full rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>

      {/*/!* 第三部分：四个分区 *!/*/}
      {/*<div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">*/}
      {/*    <div className="p-6 bg-gray-100 rounded-lg shadow">*/}
      {/*        <h3 className="text-xl font-semibold mb-2">*/}
      {/*            {t('about.features.feature1.title')}*/}
      {/*        </h3>*/}
      {/*        <p className="text-gray-600">*/}
      {/*            {t('about.features.feature1.description')}*/}
      {/*        </p>*/}
      {/*    </div>*/}
      {/*    <div className="p-6 bg-gray-100 rounded-lg shadow">*/}
      {/*        <h3 className="text-xl font-semibold mb-2">*/}
      {/*            {t('about.features.feature2.title')}*/}
      {/*        </h3>*/}
      {/*        <p className="text-gray-600">*/}
      {/*            {t('about.features.feature2.description')}*/}
      {/*        </p>*/}
      {/*    </div>*/}
      {/*    <div className="p-6 bg-gray-100 rounded-lg shadow">*/}
      {/*        <h3 className="text-xl font-semibold mb-2">*/}
      {/*            {t('about.features.feature3.title')}*/}
      {/*        </h3>*/}
      {/*        <p className="text-gray-600">*/}
      {/*            {t('about.features.feature3.description')}*/}
      {/*        </p>*/}
      {/*    </div>*/}
      {/*    <div className="p-6 bg-gray-100 rounded-lg shadow">*/}
      {/*        <h3 className="text-xl font-semibold mb-2">*/}
      {/*            {t('about.features.feature4.title')}*/}
      {/*        </h3>*/}
      {/*        <p className="text-gray-600">*/}
      {/*            {t('about.features.feature4.description')}*/}
      {/*        </p>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </section>
  );
};

export default About;
