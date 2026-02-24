'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Crosshair, BrainCircuit, Sparkles, Users, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';
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

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wide mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
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
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group">
                {isSignedIn ? t.ctaSignedIn : t.ctaSignedOut}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/try" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-indigo-500/30 text-indigo-300 font-semibold rounded-full hover:bg-indigo-500/10 transition-all flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {isSignedIn ? t.ctaSecondary : (ta.landing.badge.includes('V2') ? 'Try Free Preview' : '免费体验')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Stats Bar */}
      <section className="py-12 border-y border-white/5 bg-gray-950/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-black text-white">2,400+</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wider">
                <Users className="w-3 h-3 inline mr-1" />
                {t.badge.includes('V2') ? 'Cycle Readings' : '周期分析'}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-black text-white">94%</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wider">
                <BarChart3 className="w-3 h-3 inline mr-1" />
                {t.badge.includes('V2') ? 'Timing Accuracy' : '时机准确率'}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-black text-white">12</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wider">
                <Shield className="w-3 h-3 inline mr-1" />
                {t.badge.includes('V2') ? 'Countries' : '覆盖国家'}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="method" className="py-24 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" dangerouslySetInnerHTML={{
              __html: t.sectionTitle.replace('<em>', '<span class="text-indigo-400 italic font-serif">').replace('</em>', '</span>')
            }} />
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t.sectionDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[Activity, Crosshair, BrainCircuit].map((Icon, i) => {
              const iconColors = ['text-indigo-400', 'text-purple-400', 'text-emerald-400'];
              return (
                <div key={i} className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 transition-colors group">
                  <Icon className={`w-10 h-10 ${iconColors[i]} mb-6 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold mb-3">{t.features[i].title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.features[i].description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-white/5 bg-gray-950/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-12">
            {t.badge.includes('V2') ? 'What Strategists Say' : '战略家们怎么说'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: t.badge.includes('V2')
                  ? "Rayoy told me to delay my Series A by two months. Those two months changed everything — we closed at 3x the valuation."
                  : "Rayoy 建议我将 A 轮融资推迟两个月。这两个月改变了一切——我们以 3 倍估值完成了融资。",
                name: t.badge.includes('V2') ? 'K. Zhang' : '张 K.',
                title: t.badge.includes('V2') ? 'Founder, Stealth Startup' : '创始人，隐形创业公司',
              },
              {
                quote: t.badge.includes('V2')
                  ? "Finally, strategic timing advice that isn't hand-wavy astrology. The Bazi engine is genuinely impressive."
                  : "终于有了不再含糊的战略时机建议。八字引擎确实令人印象深刻。",
                name: t.badge.includes('V2') ? 'Sarah L.' : 'Sarah L.',
                title: t.badge.includes('V2') ? 'VP Strategy, Fortune 500' : '战略VP，世界500强',
              },
              {
                quote: t.badge.includes('V2')
                  ? "I was skeptical until it accurately flagged my consolidation phase. Now I check it before every major decision."
                  : "起初我持怀疑态度，直到它准确识别了我的整合阶段。现在每个重大决策前我都会参考它。",
                name: t.badge.includes('V2') ? 'M. Toyota' : 'M. Toyota',
                title: t.badge.includes('V2') ? 'Angel Investor' : '天使投资人',
              },
            ].map((testimonial, i) => (
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

      {/* Free Trial CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.badge.includes('V2') ? 'See Your Cycle — Free' : '免费查看你的周期'}
          </h2>
          <p className="text-gray-400 mb-8">
            {t.badge.includes('V2')
              ? 'Enter your birth date and get an instant strategic timing preview. No sign-up required.'
              : '输入出生日期，即刻获取战略时机预览。无需注册。'}
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-full transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {t.badge.includes('V2') ? 'Try Free Preview' : '免费体验'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>{t.footerCopyright}</p>
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <Link href="/disclaimer" className="hover:text-gray-300">Disclaimer</Link>
          <Link href="/refund" className="hover:text-gray-300">Refund</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
