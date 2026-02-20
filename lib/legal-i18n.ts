import type { Locale } from './i18n';

export interface LegalTranslations {
    nav: {
        back: string;
    };
    terms: {
        title: string;
        lastUpdated: string;
        content: React.ReactNode;
    };
    privacy: {
        title: string;
        lastUpdated: string;
        content: React.ReactNode;
    };
    disclaimer: {
        title: string;
        lastUpdated: string;
        content: React.ReactNode;
    };
    contact: {
        title: string;
        description: string;
        emailLabel: string;
    };
}

export const legalTranslations: Record<Locale, any> = {
    en: {
        nav: {
            back: 'Back to Home',
        },
        terms: {
            title: 'Terms of Service',
            lastUpdated: 'February 2026',
            content: `
### 1. Introduction
Welcome to Rayoy ("we," "our," "us"). By accessing or using our website and services, you agree to be bound by these Terms of Service.

### 2. Service Description
Rayoy provides AI-generated digital decision support reports designed for personal reflection and strategic thinking. This is a digital downloadable product.

### 3. No Guaranteed Outcomes
Our reports are based on cycle intelligence models. We do not provide fortune telling, astrology predictions, guaranteed outcomes, or future certainty of any kind. You agree that any decisions you make based on our reports are strictly at your own risk.

### 4. No Professional Advice
The content provided by Rayoy does not constitute financial, legal, medical, or professional advice. You should consult appropriate professionals for specific advice tailored to your situation.

### 5. Payments and Refunds
All payments are processed securely via Stripe. Because our products are digital and delivered immediately upon generation, **all sales are final and non-refundable**, except where required by law.

### 6. User Responsibility
You assume full responsibility for your decisions. We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            `,
        },
        privacy: {
            title: 'Privacy Policy',
            lastUpdated: 'February 2026',
            content: `
### 1. Information We Collect
We collect the data necessary to provide our services. This includes:
- **Contact Information**: Name and email address.
- **Input Data**: The specific information you provide to generate your cycle intelligence report.

### 2. How We Use Your Data
The primary purpose of collecting your data is to generate your AI-assisted report. We may also use your email to send you your report or important service updates.

### 3. Data Protection and Sharing
We do not sell, rent, or trade your personal information to third parties. Your data is used strictly for the provision of our services.

### 4. Payment Processing
We do not store or process your credit card information on our servers. All payment data is securely handled directly by Stripe, our payment processor.

### 5. Data Security
We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            `,
        },
        disclaimer: {
            title: 'Disclaimer',
            lastUpdated: 'February 2026',
            content: `
Rayoy provides AI-generated digital reports for informational and self-reflection purposes only. The content does not constitute financial, legal, medical, or professional advice. We do not guarantee outcomes or predictions of future events.

Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the website.
            `,
        },
        contact: {
            title: 'Contact Us',
            description: 'Have questions or need assistance? Reach out to our support team.',
            emailLabel: 'Email Support',
        }
    },
    'zh-CN': {
        nav: {
            back: '返回首页',
        },
        terms: {
            title: '服务条款 (Terms of Service)',
            lastUpdated: '2026年2月',
            content: `
### 1. 简介
欢迎访问 Rayoy。使用我们的网站和服务即表示您同意受本服务条款的约束。

### 2. 服务描述
Rayoy 提供旨在用于个人反思和战略思考的 AI 生成的数字决策支持报告。这是一个数字化下载产品。

### 3. 不保证结果
我们的报告基于周期智能模型。我们不提供算命、占星预测，也不保证任何结果或未来的确定性。您基于我们的报告做出的任何决定均由您自行承担风险。

### 4. 非专业建议
Rayoy 提供的任何内容均不构成财务、法律、医疗或专业建议。如需针对您具体情况的建议，请咨询相关专业人士。

### 5. 支付与退款
所有付款均通过 Stripe 安全处理。由于我们的产品是数字产品并在生成后立即交付，除非法律要求，**所有售出商品均不予退款**。

### 6. 用户责任
您对自己的决定承担全部责任。对于因使用或无法使用我们的服务而导致的任何直接、间接、附带、特殊或后果性的损害，我们概不负责。
            `,
        },
        privacy: {
            title: '隐私政策 (Privacy Policy)',
            lastUpdated: '2026年2月',
            content: `
### 1. 我们收集的信息
我们收集提供服务所必需的数据。这包括：
- **联系信息**：姓名和电子邮件地址。
- **输入数据**：您为生成周期智能报告而提供的特定信息。

### 2. 我们如何使用您的数据
收集您数据的主要目的是生成 AI 辅助报告。我们还可能使用您的电子邮件向您发送报告或重要的服务更新。

### 3. 数据保护与共享
我们绝不出售、出租或交易您的个人信息给第三方。您的数据严格用于提供我们的服务。

### 4. 支付处理
我们不在我们的服务器上存储或处理您的信用卡信息。所有支付数据均由我们的支付处理方 Stripe 直接安全处理。

### 5. 数据安全
我们采取合理的安全措施，以保护您的个人信息免遭未经授权的访问、更改、披露或破坏。
            `,
        },
        disclaimer: {
            title: '免责声明 (Disclaimer)',
            lastUpdated: '2026年2月',
            content: `
Rayoy 提供 AI 生成的数字报告仅供参考和自我反思之用。相关内容不构成财务、法律、医疗或专业建议。我们不保证结果，也不做任何未来事件的预测。

您对该等信息的任何依赖均由您自行承担风险。对于您或任何其他网站访问者对该等材料的依赖而引起的任何责任，我们概不负责。
            `,
        },
        contact: {
            title: '联系我们',
            description: '有任何问题或需要协助？请联系我们的支持团队。',
            emailLabel: '发送邮件',
        }
    },
    'zh-TW': {
        nav: {
            back: '返回首頁',
        },
        terms: {
            title: '服務條款 (Terms of Service)',
            lastUpdated: '2026年2月',
            content: `
### 1. 簡介
歡迎訪問 Rayoy。使用我們的網站和服務即表示您同意受本服務條款的約束。

### 2. 服務描述
Rayoy 提供旨在用於個人反思和戰略思考的 AI 生成的數字決策支持報告。這是一個數字化下載產品。

### 3. 不保證結果
我們的報告基於週期智能模型。我們不提供算命、占星預測，也不保證任何結果或未來的確定性。您基於我們的報告做出的任何決定均由您自行承擔風險。

### 4. 非專業建議
Rayoy 提供的任何內容均不構成財務、法律、醫療或專業建議。如需針對您具體情況的建議，請諮詢相關專業人士。

### 5. 支付與退款
所有付款均通過 Stripe 安全處理。由於我們的產品是數字產品並在生成後立即交付，除非法律要求，**所有售出商品均不予退款**。

### 6. 用戶責任
您對自己的決定承擔全部責任。對於因使用或無法使用我們的服務而導致的任何直接、間接、附帶、特殊或後果性的損害，我們概不負責。
            `,
        },
        privacy: {
            title: '隱私政策 (Privacy Policy)',
            lastUpdated: '2026年2月',
            content: `
### 1. 我們收集的信息
我們收集提供服務所必需的數據。這包括：
- **聯繫信息**：姓名和電子郵件地址。
- **輸入數據**：您為生成週期智能報告而提供的特定信息。

### 2. 我們如何使用您的數據
收集您數據的主要目的是生成 AI 輔助報告。我們還可能使用您的電子郵件向您發送報告或重要的服務更新。

### 3. 數據保護與共享
我們絕不出售、出租或交易您的個人信息給第三方。您的數據嚴格用於提供我們的服務。

### 4. 支付處理
我們不在我們的服務器上存儲或處理您的信用卡信息。所有支付數據均由我們的支付處理方 Stripe 直接安全處理。

### 5. 數據安全
我們採取合理的安全措施，以保護您的個人信息免遭未經授權的訪問、更改、披露或破壞。
            `,
        },
        disclaimer: {
            title: '免責聲明 (Disclaimer)',
            lastUpdated: '2026年2月',
            content: `
Rayoy 提供 AI 生成的數字報告僅供參考和自我反思之用。相關內容不構成財務、法律、醫療或專業建議。我們不保證結果，也不做任何未來事件的預測。

您對該等信息的任何依賴均由您自行承擔風險。對於您或任何其他網站訪問者對該等材料的依賴而引起的任何責任，我們概不負責。
            `,
        },
        contact: {
            title: '聯繫我們',
            description: '有任何問題或需要協助？請聯繫我們的支持團隊。',
            emailLabel: '發送郵件',
        }
    }
};
