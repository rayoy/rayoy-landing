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
        <section id="report" className="px-6 py-24 sm:py-32 relative">
            <div className="mx-auto max-w-6xl relative z-10">
                <h2 className="text-center text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl md:text-4xl">
                    {t.solution.title}
                </h2>

                {/* Features grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="group flex items-start gap-4 rounded-lg border border-brand-border bg-brand-card/30 p-6 transition-all duration-300 hover:border-brand-accent/50 hover:bg-brand-card/80 hover:shadow-[0_0_15px_rgba(45,212,191,0.1)] hover:-translate-y-1"
                        >
                            <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">{f.icon}</div>
                            <span className="text-sm font-medium text-brand-text transition-colors group-hover:text-brand-accent">
                                {f.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Report preview card */}
                <div className="mx-auto mt-20 max-w-lg relative group">
                    {/* Background glow effect */}
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-brand-accent/0 via-brand-accent/10 to-brand-accent/0 opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100" />

                    <div className="relative rounded-xl border border-brand-border bg-[#0D1322] p-8 shadow-2xl overflow-hidden transition-all duration-500 hover:border-brand-accent/30">

                        {/* AI Scanline Animation */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                            <div className="w-full h-[2px] bg-brand-accent/50 shadow-[0_0_8px_2px_rgba(45,212,191,0.4)] animate-scan" />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-6 flex items-center justify-between border-b border-brand-border/50 pb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <h3 className="text-sm font-medium tracking-wide text-brand-text">
                                        {rp.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-brand-accent uppercase tracking-widest font-mono">Live Sync</span>
                                    <div className="h-2 w-2 rounded-full bg-brand-accent animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_5px_rgba(45,212,191,0.8)]" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Phase */}
                                <div className="group/item rounded-lg bg-brand-card/20 p-4 transition-colors hover:bg-brand-card/40 border border-transparent hover:border-brand-border/50">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                                        {rp.phaseLabel}
                                    </p>
                                    <p className="mt-1 font-mono text-xl text-brand-accent drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]">
                                        {rp.currentPhase}
                                    </p>
                                </div>

                                {/* Trend */}
                                <div className="group/item rounded-lg bg-brand-card/20 p-4 transition-colors hover:bg-brand-card/40 border border-transparent hover:border-brand-border/50">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                                        {rp.trendLabel}
                                    </p>
                                    <p className="mt-1 text-sm text-brand-text">
                                        {rp.trendValue}
                                    </p>
                                    {/* Mini bar chart visualization */}
                                    <div className="mt-4 flex items-end gap-1 h-12">
                                        {[40, 55, 45, 60, 70, 65, 80, 85, 90].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-full rounded-sm bg-brand-accent/20 transition-all duration-300 group-hover/item:bg-brand-accent/40"
                                                style={{
                                                    height: `${h}%`,
                                                    transitionDelay: `${i * 30}ms`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Risk & Action Split */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Risk */}
                                    <div className="group/item rounded-lg bg-brand-card/20 p-4 transition-colors hover:bg-brand-card/40 border border-transparent hover:border-brand-border/50">
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                                            {rp.riskLabel}
                                        </p>
                                        <div className="mt-2 flex gap-1">
                                            <div className="h-1.5 flex-1 rounded-full bg-brand-accent shadow-[0_0_5px_rgba(45,212,191,0.5)]" />
                                            <div className="h-1.5 w-1/4 rounded-full bg-brand-border" />
                                            <div className="h-1.5 w-1/4 rounded-full bg-brand-border" />
                                        </div>
                                        <p className="mt-2 text-xs text-brand-text">{rp.riskValue}</p>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="group/item rounded-lg bg-brand-card/20 p-4 transition-colors hover:bg-brand-card/40 border border-transparent hover:border-brand-border/50">
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                                            {rp.recommendationLabel}
                                        </p>
                                        <p className="mt-2 text-xs text-brand-text leading-tight">
                                            {rp.recommendationValue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
