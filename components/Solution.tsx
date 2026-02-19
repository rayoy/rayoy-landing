'use client';

import { useLanguage } from '@/lib/LanguageContext';

const featureIcons = [
    // Phase — compass
    <svg key="phase" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="12,2 14,10 12,12 10,10" fill="#2DD4BF" opacity="0.3" stroke="none" />
        <polygon points="12,22 10,14 12,12 14,14" fill="#2DD4BF" opacity="0.3" stroke="none" />
    </svg>,
    // Trend — chart line
    <svg key="trend" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3,18 8,13 13,15 21,6" />
        <polyline points="17,6 21,6 21,10" />
    </svg>,
    // Risk — shield
    <svg key="risk" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2l8 4v6c0 5.5-3.8 9.7-8 11-4.2-1.3-8-5.5-8-11V6l8-4z" />
        <path d="M12 8v4M12 16h.01" />
    </svg>,
    // Action — target
    <svg key="action" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>,
];

export default function Solution() {
    const { t } = useLanguage();

    const features = [
        { icon: featureIcons[0], label: t.solution.features.phase },
        { icon: featureIcons[1], label: t.solution.features.trend },
        { icon: featureIcons[2], label: t.solution.features.risk },
        { icon: featureIcons[3], label: t.solution.features.action },
    ];

    const rp = t.solution.reportPreview;

    return (
        <section id="report" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl md:text-4xl">
                    {t.solution.title}
                </h2>

                {/* Features grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 rounded-lg border border-brand-border bg-brand-card/30 p-6 transition-all hover:border-brand-accent/30 hover:bg-brand-card/60"
                        >
                            <div className="shrink-0">{f.icon}</div>
                            <span className="text-sm font-medium text-brand-text">
                                {f.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Report preview card */}
                <div className="mx-auto mt-16 max-w-lg rounded-xl border border-brand-border bg-brand-card/40 p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-brand-muted">
                            {rp.title}
                        </h3>
                        <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                    </div>

                    <div className="space-y-5">
                        {/* Phase */}
                        <div>
                            <p className="text-xs uppercase tracking-widest text-brand-muted">
                                {rp.phaseLabel}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-brand-accent">
                                {rp.currentPhase}
                            </p>
                        </div>

                        <div className="h-px bg-brand-border" />

                        {/* Trend */}
                        <div>
                            <p className="text-xs uppercase tracking-widest text-brand-muted">
                                {rp.trendLabel}
                            </p>
                            <p className="mt-1 text-sm text-brand-text">
                                {rp.trendValue}
                            </p>
                            {/* Mini bar chart visualization */}
                            <div className="mt-3 flex items-end gap-1">
                                {[40, 55, 45, 60, 70, 65, 80, 85, 90].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-5 rounded-sm bg-brand-accent/20 transition-all hover:bg-brand-accent/40"
                                        style={{ height: `${h}%`, minHeight: `${h * 0.5}px` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-brand-border" />

                        {/* Risk */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-brand-muted">
                                    {rp.riskLabel}
                                </p>
                                <p className="mt-1 text-sm text-brand-text">{rp.riskValue}</p>
                            </div>
                            <div className="flex gap-1">
                                <div className="h-2 w-6 rounded-full bg-brand-accent" />
                                <div className="h-2 w-6 rounded-full bg-brand-border" />
                                <div className="h-2 w-6 rounded-full bg-brand-border" />
                            </div>
                        </div>

                        <div className="h-px bg-brand-border" />

                        {/* Recommendation */}
                        <div>
                            <p className="text-xs uppercase tracking-widest text-brand-muted">
                                {rp.recommendationLabel}
                            </p>
                            <p className="mt-1 text-sm text-brand-text">
                                {rp.recommendationValue}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
