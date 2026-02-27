'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

// LemonSqueezy variant IDs — replace with real IDs from your LS dashboard
const variantIds = [null, '1347044', '1347053', '1347056'];
const prices = ['$0', '$19', '$49', '$199'];
const periods = [undefined, '/mo', '/mo', '/yr'];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const { ta } = useLanguage();
    const t = ta.pricing;

    const handleCheckout = async (variantId: string | null) => {
        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        if (!variantId) {
            router.push('/dashboard');
            return;
        }

        setLoading(variantId);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variantId }),
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
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="mb-12 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    {t.back}
                </button>

                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-extrabold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500"
                    >
                        {t.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        {t.description}
                    </motion.p>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {t.plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                            className={`relative p-8 rounded-3xl border ${i === 1
                                ? 'border-indigo-500 bg-gray-900/50 shadow-2xl shadow-indigo-500/10'
                                : 'border-gray-800 bg-gray-900/20 backdrop-blur-sm'
                                } flex flex-col`}
                        >
                            {i === 1 && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {t.mostPopular}
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-200">{plan.name}</h3>
                                <p className="mt-2 text-sm text-gray-400 min-h-[40px]">{plan.description}</p>
                                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                                    {prices[i]}
                                    {periods[i] && <span className="ml-1 text-xl font-medium text-gray-500">{periods[i]}</span>}
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
                                onClick={() => handleCheckout(variantIds[i])}
                                disabled={loading === variantIds[i]}
                                className={`mt-8 block w-full py-3 px-4 rounded-xl text-center font-semibold text-sm transition-all duration-200 ${i === 1
                                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                    }`}
                            >
                                {loading === variantIds[i] ? t.processing : plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
