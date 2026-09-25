import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-blue-700 py-16 lg:py-20 relative overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
          Access Government Services Online
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
          Save time, avoid unnecessary visits, and manage your government applications from one secure platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-white px-8 font-semibold text-blue-700 transition-all hover:bg-slate-50 shadow-sm"
          >
            Explore Services <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/register"
            className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue-800 px-8 font-semibold text-white ring-1 ring-inset ring-blue-600 transition-all hover:bg-blue-900"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
