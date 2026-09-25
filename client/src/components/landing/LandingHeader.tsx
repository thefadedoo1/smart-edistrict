import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Landmark } from "lucide-react";

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-3" : "bg-white py-4 border-b border-slate-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-blue-800 p-2 rounded-lg text-white">
            <Landmark size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 leading-tight">Smart eDistrict</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:block">One Platform. Many Services.</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-blue-700">Home</Link>
          <a href="#services" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">Services</a>
          <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">About</a>
          <a href="#help" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">Help</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="h-6 w-px bg-slate-300"></div>
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors">
            Login
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors shadow-sm">
            Register
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4">
          <Link to="/" className="text-base font-semibold text-blue-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="#services" className="text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#about" className="text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#help" className="text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Help</a>
          <hr className="border-slate-100" />
          <Link to="/login" className="text-base font-medium text-slate-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" className="text-base font-medium text-blue-700" onClick={() => setMobileMenuOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
