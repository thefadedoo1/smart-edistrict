import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ArrowRight, Activity, Lock } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        
        <div className="text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-8">
            <ShieldCheck size={16} className="text-blue-600" />
            Official Government Digital Services
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Government Services, <span className="text-blue-700">Simplified.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            Access government services, submit applications, track requests, and stay updated — all from one secure digital platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue-700 px-8 font-semibold text-white transition-all hover:bg-blue-800 shadow-sm"
            >
              Explore Services <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm font-medium text-slate-600 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-slate-400" />
              <span>Secure</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-slate-400" />
              <span>Transparent</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-slate-400" />
              <span>Accessible</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;