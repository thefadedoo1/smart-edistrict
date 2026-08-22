import {
  Clock3,
  ShieldCheck,
  Workflow,
  BellRing,
  FileCheck,
  BarChart3,
} from "lucide-react";

const features = [
  {
    title: "Real-Time Application Tracking",
    description: "Citizens can track every stage of their application from submission to certificate generation.",
    icon: Clock3,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Multi-Level Approval Workflow",
    description: "Applications move through DA, Patwari, DA Review and Tehsildar with complete transparency.",
    icon: Workflow,
    color: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "SLA Monitoring",
    description: "Every application is monitored against defined service timelines to reduce delays.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Automatic Escalation",
    description: "Delayed applications are automatically highlighted so officers can take timely action.",
    icon: BellRing,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Digital Certificate Generation",
    description: "Approved applications generate downloadable digital certificates instantly.",
    icon: FileCheck,
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    title: "Officer Performance Analytics",
    description: "Monitor workload, processing time and SLA compliance to improve governance.",
    icon: BarChart3,
    color: "from-slate-500 to-slate-700",
    bg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
];

const Features = () => {
  return (
    <section className="relative bg-slate-50 py-24 sm:py-32 overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-64 bg-gradient-to-b from-slate-200/50 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase">
            Platform Capabilities
          </h2>
          <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Why Choose Himseva eDistrict?
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A modern digital governance platform designed to provide transparent, accountable, and highly efficient public services to every citizen.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative flex flex-col rounded-3xl bg-white p-8 ring-1 ring-slate-200/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/5 hover:ring-blue-100"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white to-slate-50/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} shadow-sm ring-1 ring-slate-900/5 transition-transform group-hover:scale-110 duration-300`}>
                      <Icon size={28} className={feature.iconColor} strokeWidth={2} />
                    </div>
                    
                    <dt className="text-xl font-bold leading-7 text-slate-900">
                      {feature.title}
                    </dt>
                    
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                      <p className="flex-auto">
                        {feature.description}
                      </p>
                    </dd>
                  </div>
                  
                  {/* Bottom Gradient Accent */}
                  <div className={`absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-full`} />
                </div>
              );
            })}

          </dl>
        </div>

      </div>
    </section>
  );
};

export default Features;