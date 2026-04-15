import { Link, useNavigate } from 'react-router-dom';
import { 
  BookMarked, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Shield, 
  Sparkles, 
  PlayCircle,
  Save,
  LogOut,
  ChevronRight,
  Star,
  Cloud
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <BookMarked className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Context Saver</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it works</a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Benefits</a>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button to="/dashboard" variant="outline" size="sm">Go to Dashboard</Button>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
                <Button to="/signup" size="sm">Start Free</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Productivity Redefined
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Pause your work without <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">losing your flow</span>
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Context Saver captures exactly what you're doing, why you paused, and what to do next. Resume instantly, even days later, with zero mental friction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button to="/signup" size="lg" className="px-10 py-6 text-lg rounded-2xl shadow-xl shadow-indigo-500/20">
                Start for Free
              </Button>
              <Button to="/pricing" variant="outline" size="lg" className="px-10 py-6 text-lg rounded-2xl">
                View Plans
              </Button>
            </div>

            <div className="pt-12 flex items-center justify-center gap-8 text-slate-400 dark:text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Instant Resume</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                <span className="text-sm font-medium">Cloud Sync</span>
              </div>
            </div>
          </motion.div>

          {/* App Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-transparent z-10" />
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-4">
              <div className="rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner">
                <img 
                  src="https://picsum.photos/seed/dashboard/1600/900" 
                  alt="Context Saver Dashboard" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Three simple steps to never lose your train of thought again.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-10 space-y-6 group hover:border-indigo-500/50 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <Save className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Save your context</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Before you step away, quickly jot down what you're doing, the current hurdle, and the very next step.
                </p>
              </div>
            </Card>

            <Card className="p-10 space-y-6 group hover:border-indigo-500/50 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                <LogOut className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Step away</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Go to lunch, attend a meeting, or end your day with a clear mind. Your context is safely stored.
                </p>
              </div>
            </Card>

            <Card className="p-10 space-y-6 group hover:border-indigo-500/50 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Resume instantly</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  When you return, Context Saver presents your "Next Step" front and center. No more "What was I doing?"
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Designed for the <span className="text-indigo-600">modern builder</span> who juggles multiple contexts.
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Reduced mental reset time</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Save up to 20 minutes of "re-orientation" time every time you switch tasks or return from a break.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Fewer forgotten tasks</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Never lose that "one small thing" you needed to do next. It's captured and waiting for you.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Easier context switching</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Switch between projects with confidence, knowing you can pick up exactly where you left off in any of them.</p>
                  </div>
                </div>
              </div>

              <Button to="/signup" size="lg" className="px-8">Get Started Now</Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full" />
              <Card className="relative z-10 p-2 overflow-hidden rounded-[2rem] border-slate-200 dark:border-white/10 shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/productivity/800/1000" 
                  alt="Productivity" 
                  className="w-full h-auto rounded-[1.5rem]"
                  referrerPolicy="no-referrer"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Simple, honest pricing</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Choose the plan that fits your workflow. Start a 5-day Plus trial today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 space-y-6 border-slate-200 dark:border-white/5">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-500 text-sm">/forever</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited local sessions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic task tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Local storage only</li>
              </ul>
              <Button to="/signup" variant="outline" fullWidth>Start Free</Button>
            </Card>

            <Card className="p-8 space-y-6 border-indigo-500 shadow-xl shadow-indigo-500/10 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Most Popular</div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Plus</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$5</span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Free</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pinned sessions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced filters</li>
              </ul>
              <Button to="/pricing" fullWidth>Start 5-day Trial</Button>
            </Card>

            <Card className="p-8 space-y-6 border-slate-200 dark:border-white/5">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$12</span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Plus</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cloud Sync</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-device access</li>
              </ul>
              <Button to="/pricing" variant="outline" fullWidth>View Pro</Button>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link to="/pricing" className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center gap-2 hover:gap-3 transition-all">
              Compare all features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to reclaim your focus?</h2>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">
            Join thousands of developers and builders who use Context Saver to stay productive and stress-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button to="/signup" size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-6 text-lg rounded-2xl shadow-xl">
              Start Free
            </Button>
            <Button to="/pricing" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg rounded-2xl">
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
              <BookMarked className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">Context Saver</span>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Context Saver. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/signup" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Sign Up</Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
