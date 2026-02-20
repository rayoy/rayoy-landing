import CheckoutButton from './CheckoutButton';
import { useLanguage } from '@/lib/LanguageContext';

export default function Pricing() {
    const { t } = useLanguage();

    return (
        <section id="pricing" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-md text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl">
                    {t.pricing.title}
                </h2>

                {/* Pricing Card with subtle glow */}
                <div className="relative mt-12 group">
                    {/* Animated glow background */}
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-brand-accent/0 via-brand-accent/20 to-brand-accent/0 opacity-0 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />

                    <div className="relative rounded-xl border border-brand-border bg-brand-card/60 p-10 backdrop-blur-sm transition-colors hover:border-brand-accent/30">
                        {/* Best Value Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-brand-accent/50 bg-brand-dark px-3 py-0.5 text-xs font-medium tracking-wide text-brand-accent shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                            Phase 1 Offer
                        </div>

                        <div className="flex items-baseline justify-center gap-2 mt-2">
                            <span className="text-5xl font-bold tracking-tight text-brand-text">
                                {t.pricing.price}
                            </span>
                            <span className="text-sm text-brand-muted">/ {t.pricing.period}</span>
                        </div>

                        <p className="mt-4 text-sm text-brand-muted">{t.pricing.note}</p>

                        <ul className="mt-8 space-y-3 text-left">
                            {t.pricing.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-brand-muted transition-colors hover:text-brand-text">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="#2DD4BF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="3,8 6.5,11.5 13,4.5" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <CheckoutButton />
                    </div>
                </div>
            </div>
        </section>
    );
}
