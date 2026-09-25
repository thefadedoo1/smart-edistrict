import { FileText, Users, BadgeCheck, Clock3 } from "lucide-react";

const stats = [
  {
    title: "Government Services",
    value: "50+",
    icon: FileText,
  },
  {
    title: "Departments",
    value: "10+",
    icon: Users,
  },
  {
    title: "Real-Time Tracking",
    value: "24/7",
    icon: Clock3,
  },
  {
    title: "Secure Access",
    value: "100%",
    icon: BadgeCheck,
  },
];

const Statistics = () => {
  return (
    <section className="bg-slate-900 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-800">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`flex flex-col items-center text-center ${index === 0 ? '' : 'pl-8'}`}
              >
                <div className="text-blue-400 mb-4">
                  <Icon size={32} />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;