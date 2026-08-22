import { NavLink } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

interface MenuItem {
  title: string;
  icon: any;
  path: string;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

interface SidebarProps {
  menu: MenuSection[];
}

export default function Sidebar({
  menu,
}: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="w-72 bg-white border-r border-slate-200/60 h-[calc(100vh-64px)] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-30">
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-slate-200">
        <nav className="space-y-8">
          {menu.map((section) => (
            <div key={section.section}>
              <p className="px-4 mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {section.section}
              </p>
              
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-[inset_4px_0_0_0_#2563eb]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                        `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active Background Gradient (subtle) */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent pointer-events-none" />
                          )}
                          
                          <div className="flex items-center gap-3 relative z-10">
                            <Icon 
                              size={18} 
                              strokeWidth={isActive ? 2.5 : 2} 
                              className={`transition-colors duration-200 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} 
                            />
                            <span>{item.title}</span>
                          </div>
                          
                          {isActive && (
                            <ChevronRight size={16} className="text-blue-600 relative z-10" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <button
          onClick={logout}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          <LogOut size={16} className="text-slate-400 transition-colors group-hover:text-red-500" />
          Sign Out
        </button>
      </div>

    </aside>
  );
}