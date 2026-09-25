import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";

const Footer = () => {
  return (
    <footer id="help" className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="bg-slate-800 p-2 rounded-lg text-slate-300 border border-slate-700">
                <Landmark size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">Smart eDistrict</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Digital public services, made simpler.</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm mb-6">
              A unified digital platform for citizens to access government services online. Secure, transparent, and built for everyone.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">All Services</Link></li>
              <li><a href="#services" className="hover:text-white transition-colors">Popular Services</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Departments</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Citizen Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/grievance" className="hover:text-white transition-colors">Grievances</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Smart eDistrict</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Smart eDistrict. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span>Digital Governance Platform</span>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;