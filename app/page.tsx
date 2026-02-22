'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Crosshair, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { isSignedIn } = useAuth();

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
              SYSTEM V2 ONLINE
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
              Strategy Is <br />
              <span className="text-gradient">Timing.</span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Rayoy analyzes your structural cycle. Know exactly when to aggressively expand, gracefully pause, or strategically pivot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group">
                {isSignedIn ? 'Enter Console' : 'Initialize Profile'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-gray-700 text-white font-semibold rounded-full hover:bg-gray-800 transition-all">
                View Intelligence Tiers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="method" className="py-24 bg-black relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Most failures are <span className="text-indigo-400 italic font-serif">timing</span> failures.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">We combine Western strategic logic with Eastern structural astrology (Bazi) to map your highest probability action windows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 transition-colors group">
              <Activity className="w-10 h-10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Cycle Detection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Identify whether you are in an expansion, consolidation, or volatile phase based on precise historical and structural variables.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 transition-colors group">
              <Crosshair className="w-10 h-10 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Tactical Windows</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Stop guessing. Get clear 'go/no-go' signals for major life and business decisions, down to the optimal month and day.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 transition-colors group">
              <BrainCircuit className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">AI Agent Core</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Query the AI terminal instantly. Ask specific strategic questions and get answers grounded in your exact natal and transit charts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>© 2026 Rayoy Intelligence Systems. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <Link href="/disclaimer" className="hover:text-gray-300">Disclaimer</Link>
        </div>
      </footer>
    </div>
  );
}
