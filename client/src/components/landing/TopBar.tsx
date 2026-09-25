import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-200">Government Digital Services</span>
          <span className="opacity-30">|</span>
          <a href="#main-content" className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white">Skip to main content</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-white transition-colors focus:outline-none">A-</button>
          <button className="hover:text-white transition-colors focus:outline-none">A</button>
          <button className="hover:text-white transition-colors focus:outline-none">A+</button>
          <span className="opacity-30">|</span>
          <button className="hover:text-white transition-colors font-medium">English</button>
          <span className="opacity-30">|</span>
          <Link to="/help" className="hover:text-white transition-colors">Help / Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
