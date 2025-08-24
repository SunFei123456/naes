import { useParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Breadcrumbs from "../../components/Breadcrumbs";

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

const QaCategory = () => {
    const { categoryId } = useParams();
    const { t } = useTranslation('qa');

    // 获取分类数据
    const categories = t('qa.categories', { returnObjects: true }) as Category[];
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
        return (
            <div className="w-full">
                <Breadcrumbs />
                <div className="container max-w-6xl mx-auto py-20 px-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">{t('qa.categoryNotFound')}</h1>
                        <p className="text-gray-600 mb-8">{t('qa.categoryNotFoundDesc')}</p>
                        <Link
                            to="/qa"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            {t('qa.backToQa')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pt-header">
            <Breadcrumbs />
            {/* Main content container */}
            <div className="container max-w-6xl mx-auto py-20 px-6">
                {/* Page header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
                    <p className="text-gray-600 max-w-3xl mx-auto">{category.description}</p>
                </div>

                {/* Questions list */}
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {category.questions.map((question) => (
                            <Link
                                key={question.id}
                                to={`/qa/${categoryId}/${question.id}`}
                                className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-[#204f3e]">
                                    {question.question}
                                </h3>
                                <p className="text-gray-600 line-clamp-2">
                                    {question.answer.substring(0, 150)}...
                                </p>
                                <div className="mt-4 flex items-center text-[#1b805b] text-sm font-medium">
                                    {t('qa.viewDetails')}
                                    <svg
                                        className="ml-2 w-4 h-4"
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
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Back to categories */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <Link
                        to="/qa"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
                    >
                        <svg
                            className="mr-2 w-4 h-4"
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
                        {t('qa.backToAllCategories')}
                    </Link>
                </div>

                {/* Still have questions section */}
                <div className="max-w-4xl mx-auto mt-16 bg-blue-50 p-8 rounded-lg text-center">
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

export default QaCategory;
