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

const QaDetail = () => {
    const { categoryId, questionId } = useParams();
    const { t } = useTranslation('qa');

    // 获取分类和问题数据
    const categories = t('qa.categories', { returnObjects: true }) as Category[];
    const category = categories.find(cat => cat.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);

    if (!category || !question) {
        return (
            <div className="w-full">
                <Breadcrumbs />

                <div className="container max-w-6xl mx-auto py-20 px-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">{t('qa.questionNotFound')}</h1>
                        <p className="text-gray-600 mb-8">{t('qa.questionNotFoundDesc')}</p>
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

    // 格式化答案内容，处理换行符
    const formatAnswer = (answer: string) => {
        return answer.split('\n').map((line, index) => (
            <p key={index} className="mb-4 last:mb-0">
                {line}
            </p>
        ));
    };

    return (
        <div className="w-full pt-header">
            <Breadcrumbs />
            {/* Main content container */}
            <div className="container max-w-6xl mx-auto py-20 px-6">
                {/* Question header */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        {question.question}
                    </h1>
                </div>

                {/* Answer content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white">
                        <div className="prose prose-lg max-w-none text-gray-700">
                            {formatAnswer(question.answer)}
                        </div>
                    </div>
                </div>

                {/* Navigation links */}
                <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row gap-4 justify-between">
                    <Link
                        to={`/qa/${categoryId}`}
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
                        {t('qa.backToCategory')} {category.name}
                    </Link>

                    <Link
                        to="/qa"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
                    >
                        {t('qa.backToAllCategories')}
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
                    </Link>
                </div>

                {/* Related questions */}
                <div className="max-w-4xl mx-auto mt-16">
                    <h3 className="text-xl font-bold mb-6">{t('qa.relatedQuestions')}</h3>
                    <div className="space-y-4">
                        {category.questions
                            .filter(q => q.id !== questionId)
                            .slice(0, 3)
                            .map((relatedQuestion) => (
                                <Link
                                    key={relatedQuestion.id}
                                    to={`/qa/${categoryId}/${relatedQuestion.id}`}
                                    className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <h4 className="font-medium text-gray-800 hover:text-blue-600">
                                        {relatedQuestion.question}
                                    </h4>
                                </Link>
                            ))
                        }
                    </div>
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

export default QaDetail;
