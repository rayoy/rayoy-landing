'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight, Activity, Crosshair, BrainCircuit, Sparkles,
  Users, BarChart3, Shield, ChevronDown, ChevronUp,
  CalendarDays, Cpu, Target, Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { isSignedIn } = useAuth();
  const { ta } = useLanguage();
  const t = ta.landing;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-indigo-500/30">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wide mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              {t.badge}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
              {t.heroTitle1} <br />
              <span className="text-gradient">{t.heroTitle2}</span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              {t.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
              >
                {isSignedIn ? t.ctaSignedIn : t.ctaSignedOut}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/try"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-indigo-500/30 text-indigo-300 font-semibold rounded-full hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t.ctaTryFree}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="py-12 border-y border-white/5 bg-gray-950/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '2,400+', label: t.statsReadings, Icon: Users },
              { value: '94%', label: t.statsAccuracy, Icon: BarChart3 },
              { value: '12', label: t.statsCountries, Icon: Shield },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wider">
                  <stat.Icon className="w-3 h-3 inline mr-1" />
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-28 bg-black relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorksTitle}</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.howItWorksSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.howItWorksSteps.map((step, i) => {
              const StepIcons = [CalendarDays, Cpu, Target];
              const Icon = StepIcons[i];
              const colors = ['from-indigo-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-pink-500 to-orange-500'];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[i]} mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-mono text-gray-600 mb-2">{step.step}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-7 left-[calc(100%+8px)] w-[calc(100%-60px)] h-px bg-gradient-to-r from-gray-700 to-transparent" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="method" className="py-24 bg-black relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2
              className="text-3xl md:text-5xl font-bold mb-6"
              dangerouslySetInnerHTML={{
                __html: t.sectionTitle
                  .replace('<em>', '<span class="text-indigo-400 italic font-serif">')
                  .replace('</em>', '</span>'),
              }}
            />
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t.sectionDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[Activity, Crosshair, BrainCircuit].map((Icon, i) => {
              const iconColors = ['text-indigo-400', 'text-purple-400', 'text-emerald-400'];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 transition-colors group"
                >
                  <Icon className={`w-10 h-10 ${iconColors[i]} mb-6 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold mb-3">{t.features[i].title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.features[i].description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ REPORT PREVIEW ═══════════════ */}
      <section className="py-28 border-t border-white/5 bg-gray-950/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.reportPreviewTitle}</h2>
            <p className="text-gray-400">{t.reportPreviewSubtitle}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-700 bg-gray-900/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-gray-500 font-mono">cycle_report_2026.ryo</span>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(t.reportLabels).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">{label}</div>
                  <div className={`text-sm font-medium ${key === 'risk' ? 'text-emerald-400' : key === 'phase' ? 'text-indigo-300' : 'text-gray-200'}`}>
                    {t.reportValues[key as keyof typeof t.reportValues]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-12">
            {t.testimonialsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800"
              >
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="py-24 border-t border-white/5 bg-gray-950/30">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.faqTitle}</h2>
          <div className="space-y-4">
            {t.faqItems.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FREE TRIAL CTA ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.tryCta}</h2>
          <p className="text-gray-400 mb-8">{t.tryCtaDescription}</p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-full transition-all shadow-lg shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            {t.tryCtaButton}
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="text-sm">{t.footerCopyright}</span>
              <a href="mailto:support@rayoy.com" className="flex items-center gap-1.5 text-sm hover:text-gray-300 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                support@rayoy.com
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">{t.footerLinks.terms}</Link>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">{t.footerLinks.privacy}</Link>
              <Link href="/disclaimer" className="hover:text-gray-300 transition-colors">{t.footerLinks.disclaimer}</Link>
              <Link href="/refund" className="hover:text-gray-300 transition-colors">{t.footerLinks.refund}</Link>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">{t.footerLinks.contact}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Expandable FAQ item */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-900/50 transition-colors"
      >
        <span className="font-medium text-sm text-white">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
