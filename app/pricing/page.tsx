'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const plans = [
    {
        name: 'Free Report',
        price: '$0',
        description: 'Basic analysis to get you started.',
        features: ['1 Basic 3-Year Trend', 'General Risk Level', 'One-time Generation'],
        buttonText: 'Get Started',
        priceId: null, // No pricing ID for free
    },
    {
        name: 'Plus',
        price: '$19',
        period: '/mo',
        description: 'Advanced strategic insights for individuals.',
        features: ['Detailed Monthly Cycles', 'Bazi & Astrology Integration', '10 Agent Queries / mo', 'Email Support'],
        buttonText: 'Upgrade to Plus',
        priceId: 'price_plus_mock_id', // Mock ID
        recommended: true,
    },
    {
        name: 'Pro',
        price: '$49',
        period: '/mo',
        description: 'For founders making critical timing decisions.',
        features: ['Everything in Plus', 'Unlimited Agent Queries', 'Partnership Alignment', 'Priority Support'],
        buttonText: 'Upgrade to Pro',
        priceId: 'price_pro_mock_id', // Mock ID
    },
    {
        name: 'Ultra',
        price: '$199',
        period: '/yr',
        description: 'The ultimate cycle intelligence system.',
        features: ['Everything in Pro', 'Bespoke Annual Strategy', '1-on-1 Quarterly Review', 'White-glove Onboarding'],
        buttonText: 'Get Ultra',
        priceId: 'price_ultra_mock_id', // Mock ID
    },
];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const handleCheckout = async (priceId: string | null) => {
        if (!isSignedIn) {
            router.push('/sign-in'); // Redirect to Clerk login
            return;
        }

        if (!priceId) {
            router.push('/dashboard');
            return;
        }

        setLoading(priceId);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-extrabold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500"
                    >
                        Invest in Timing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Choose the intelligence tier that matches your ambition. Stop guessing when to pivot.
                    </motion.p>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                            className={`relative p-8 rounded-3xl border ${plan.recommended
                                    ? 'border-indigo-500 bg-gray-900/50 shadow-2xl shadow-indigo-500/10'
                                    : 'border-gray-800 bg-gray-900/20 backdrop-blur-sm'
                                } flex flex-col`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-200">{plan.name}</h3>
                                <p className="mt-2 text-sm text-gray-400 min-h-[40px]">{plan.description}</p>
                                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                                    {plan.price}
                                    {plan.period && <span className="ml-1 text-xl font-medium text-gray-500">{plan.period}</span>}
                                </div>
                            </div>

                            <ul className="mt-6 space-y-4 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex">
                                        <Check className="flex-shrink-0 h-5 w-5 text-indigo-400" />
                                        <span className="ml-3 text-sm text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(plan.priceId)}
                                disabled={loading === plan.priceId}
                                className={`mt-8 block w-full py-3 px-4 rounded-xl text-center font-semibold text-sm transition-all duration-200 ${plan.recommended
                                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                    }`}
                            >
                                {loading === plan.priceId ? 'Processing...' : plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
