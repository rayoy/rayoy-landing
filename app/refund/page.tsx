'use client';

import LegalHeader from '@/components/LegalHeader';
import { useLanguage } from '@/lib/LanguageContext';

export default function RefundPage() {
    const { locale } = useLanguage();
    const isZh = locale.startsWith('zh');

    return (
        <div className="min-h-screen bg-black text-white">
            <LegalHeader />
            <div className="max-w-3xl mx-auto px-4 py-20">
                <h1 className="text-3xl font-bold mb-8">{isZh ? '退款政策' : 'Refund Policy'}</h1>

                <div className="prose prose-invert prose-gray max-w-none space-y-6">
                    <p className="text-gray-400">
                        {isZh ? '最后更新：2026年2月' : 'Last Updated: February 2026'}
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-8">
                        {isZh ? '1. 免费版' : '1. Free Tier'}
                    </h2>
                    <p className="text-gray-400">
                        {isZh
                            ? 'Rayoy 的免费版用户无需支付任何费用。您可以随时注销账户。'
                            : 'Rayoy\'s free tier requires no payment. You may delete your account at any time.'}
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-8">
                        {isZh ? '2. 订阅计划' : '2. Subscription Plans'}
                    </h2>
                    <p className="text-gray-400">
                        {isZh
                            ? '我们提供按月/年订阅的付费计划。订阅后，您可以在当前计费周期结束前随时取消，不会产生后续费用。'
                            : 'We offer monthly and annual subscription plans. You may cancel your subscription at any time before the end of your current billing period. No further charges will be applied after cancellation.'}
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-8">
                        {isZh ? '3. 退款条件' : '3. Refund Eligibility'}
                    </h2>
                    <p className="text-gray-400">
                        {isZh
                            ? '如果您在订阅后 7 天内未使用任何付费功能（AI 查询、高级报告），您有资格获得全额退款。请通过联系页面提交退款申请。'
                            : 'If you have not used any paid features (AI queries, premium reports) within 7 days of your subscription, you are eligible for a full refund. Please submit your refund request through our contact page.'}
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-8">
                        {isZh ? '4. 不可退款的情况' : '4. Non-Refundable Cases'}
                    </h2>
                    <ul className="text-gray-400 list-disc list-inside space-y-2">
                        <li>{isZh ? '订阅超过 7 天' : 'Subscriptions older than 7 days'}</li>
                        <li>{isZh ? '已使用 AI 查询或高级功能' : 'AI queries or premium features have been used'}</li>
                        <li>{isZh ? '年度订阅在使用超过 30 天后' : 'Annual subscriptions after 30 days of use'}</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mt-8">
                        {isZh ? '5. 如何申请退款' : '5. How to Request a Refund'}
                    </h2>
                    <p className="text-gray-400">
                        {isZh
                            ? '请发送邮件至 support@rayoy.com 或通过联系页面提交申请，附上您的注册邮箱。我们将在 5 个工作日内处理。'
                            : 'Please email support@rayoy.com or submit a request through our contact page with your registered email. We will process your request within 5 business days.'}
                    </p>

                    <h2 className="text-xl font-semibold text-white mt-8">
                        {isZh ? '6. 联系我们' : '6. Contact Us'}
                    </h2>
                    <p className="text-gray-400">
                        {isZh
                            ? '如有任何关于退款的疑问，请联系 support@rayoy.com。'
                            : 'For any questions about refunds, please contact support@rayoy.com.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
