import {
  FileBadge,
  FileText,
  Shield,
  Home,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Income Certificate",
    description: "Apply for official proof of your annual family income.",
    icon: FileText,
  },
  {
    title: "Residence Certificate",
    description: "Obtain documentation verifying your permanent address.",
    icon: Home,
  },
  {
    title: "Caste Certificate",
    description: "Apply for recognized caste/community validation.",
    icon: Shield,
  },
  {
    title: "Birth Certificate",
    description: "Register and download official birth records.",
    icon: Users,
  },
  {
    title: "Death Certificate",
    description: "Register and obtain official death certificates.",
    icon: FileText,
  },
  {
    title: "Character Certificate",
    description: "Apply for a police clearance and character verification.",
    icon: FileBadge,
  },
];

const ServicesPreview = () => {
  return (
    <section id="services" className="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Popular Services
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              Frequently requested government services and certificates.
            </p>
          </div>
          <Link
            to="/login"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            View all services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
              >
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm">
                    {service.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:text-blue-800"
                  >
                    Apply Now <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 md:hidden">
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
          >
            View all services <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServicesPreview;