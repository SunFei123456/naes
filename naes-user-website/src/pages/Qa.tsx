import Breadcrumbs from "../components/Breadcrumbs";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Question {
    id: string;
    question: string;
    answer: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
    questions: Question[];
}

const QAPage = () => {
    const { t } = useTranslation('qa');

    // Get categories data
    const categories = t('qa.categories', { returnObjects: true }) as Category[];

    return (
        <div className="w-full pt-header">
            <Breadcrumbs />
            {/* Main content container */}
            <div className="container max-w-6xl mx-auto py-20 px-6">


                {/* Page header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">{t('qa.title')}</h1>
                    <p className="text-gray-600 max-w-3xl mx-auto">{t('qa.subtitle')}</p>
                </div>

                {/* Categories Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/qa/${category.id}`}
                                className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#204f3e] transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        {category.description}
                                    </p>
                                    <div className="text-[#204f3e] text-sm font-medium flex items-center justify-center">
                                        {t('qa.viewAllQuestions')}
                                        <svg
                                            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Still have questions section */}
                <div className=" mx-auto mt-16 bg-blue-50 p-8 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-4">{t('qa.stillHaveQuestions.title')}</h3>
                    <p className="text-gray-600 mb-6">{t('qa.stillHaveQuestions.description')}</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                        {t('qa.stillHaveQuestions.contactButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QAPage;