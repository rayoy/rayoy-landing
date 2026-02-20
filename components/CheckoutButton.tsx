'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function CheckoutButton() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            const res = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                console.error('Failed to create checkout session:', data.error);
                alert(t.paymentError || 'An error occurred initializing payment. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(t.paymentError || 'An error occurred initializing payment. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className={`relative mt-8 block w-full rounded-md bg-brand-accent py-3 text-center text-base font-medium text-brand-dark transition-all duration-300 hover:bg-brand-accent-hover hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    t.pricing.cta
                )}
            </span>
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
        </button>
    );
}
