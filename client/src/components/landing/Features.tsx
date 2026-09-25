import { Clock3, Workflow, ShieldCheck, BellRing, FileCheck, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Real-Time Tracking",
    description: "Monitor your application status live. No more unnecessary visits to government offices.",
    icon: Clock3,
  },
  {
    title: "SLA-Based Delivery",
    description: "Every service is backed by a Service Level Agreement (SLA) to ensure timely resolution.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Workflow",
    description: "Know exactly which department and officer is currently processing your request.",
    icon: Workflow,
  },
  {
    title: "Instant Notifications",
    description: "Receive SMS and email updates when your application advances or requires attention.",
    icon: BellRing,
  },
  {
    title: "Digital Certificates",
    description: "Download digitally signed, legally valid certificates directly from your citizen portal.",
    icon: FileCheck,
  },
  {
    title: "Accountable Governance",
    description: "Built-in escalation matrices ensure delays are highlighted to senior officials automatically.",
    icon: BarChart3,
  },
];

const Features = () => {
  return (
    <section id="about" className="bg-white py-16 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Why Smart eDistrict?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A citizen-first digital platform designed to provide transparent, accountable, and highly efficient public services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Icon size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;