import { Link } from "react-router-dom";
import { ShieldCheck, Users, FileText, ArrowRight, Activity, ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[90vh] flex items-center">
      {/* Background Gradients & Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-[150%] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 lg:flex-row lg:gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Government of Himachal Pradesh
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Himseva
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              e-district
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 lg:mx-0">
            Apply for government certificates online, track your application with real-time updates, and experience a fully transparent workflow from Citizen to Tehsildar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
            <Link
              to="/citizen/login"
              className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 px-8 font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Citizen Portal <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/officer/login"
              className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 px-8 font-bold text-slate-300 backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                Officer Login <ChevronRight size={18} className="text-slate-500 transition-colors group-hover:text-white" />
              </span>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-400" />
              <span>Real-time Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Content / Feature Cards */}
        <div className="mt-16 flex flex-1 justify-center w-full lg:mt-0 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="grid w-full max-w-md grid-cols-1 gap-4 relative z-10">
            
            <div className="group rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-slate-600">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Secure Workflow</h3>
                  <p className="mt-1 text-sm text-slate-400">Role-based approval system ensures accountability.</p>
                </div>
              </div>
            </div>

            <div className="group rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-slate-600 lg:translate-x-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Transparent Processing</h3>
                  <p className="mt-1 text-sm text-slate-400">Track every stage of your application live.</p>
                </div>
              </div>
            </div>

            <div className="group rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-slate-600">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Digital Certificates</h3>
                  <p className="mt-1 text-sm text-slate-400">Download instantly verified certificates.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;