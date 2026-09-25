import { Link } from "react-router-dom";
import { ArrowRight, Building2, Trees, Landmark, Stethoscope, GraduationCap, Bus, Sprout } from "lucide-react";

const departments = [
  { name: "Revenue Department", icon: Landmark },
  { name: "Social Welfare", icon: UsersIcon },
  { name: "Rural Development", icon: Trees },
  { name: "Urban Development", icon: Building2 },
  { name: "Health & Family Welfare", icon: Stethoscope },
  { name: "Education", icon: GraduationCap },
  { name: "Transport", icon: Bus },
  { name: "Agriculture", icon: Sprout },
];

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const DepartmentsSection = () => {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Explore Services by Department
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Find the right service by browsing through our official government departments.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link
                to="/login"
                key={dept.name}
                className="flex flex-col items-center justify-center p-6 text-center border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group"
              >
                <div className="text-slate-500 group-hover:text-blue-700 transition-colors mb-3">
                  <Icon size={32} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-900">
                  {dept.name}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            View all departments <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default DepartmentsSection;
