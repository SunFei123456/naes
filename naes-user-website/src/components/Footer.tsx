import logo from "../assets/images/logo-w.png";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation('common');

    return (
        <footer className="bg-gray-900 text-white py-8 px-6">
            <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:space-x-12">
                {/* 左侧区域 */}
                <div className="md:w-1/3 mb-6 md:mb-0">
                    {/* 上部分 - 图片 */}
                    <div className="mb-4 h-[30px] overflow-hidden">
                        <Link to="/" className="block">
                            <img
                                src={logo}
                                alt="Company Logo"
                                className="-ml-6 h-[300px] w-auto -mt-[135px]"
                                style={{ objectFit: 'contain' }}
                            />
                        </Link>
                    </div>

                    {/* 下部分 - 联系信息 */}
                    <div className="text-base">
                        <p className="text-gray-400">{t('footer.contact.email')}</p>
                        <p className="text-gray-400">{t('footer.contact.address')}</p>
                    </div>
                </div>

                {/* 右侧区域 */}
                <div className="md:w-2/3 mt-12 text-right text-base">
                    <p className="text-gray-400 mb-2">{t('footer.right.phone')}</p>
                    <p className="text-gray-400">{t('footer.right.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;