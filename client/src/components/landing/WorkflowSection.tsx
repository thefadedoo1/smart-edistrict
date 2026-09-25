import { Search, FileText, Activity, FileCheck2 } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Find a Service",
    description: "Search or browse for the government service or certificate you need.",
    icon: Search,
  },
  {
    num: "02",
    title: "Submit Application",
    description: "Fill out the online form and upload the required supporting documents.",
    icon: FileText,
  },
  {
    num: "03",
    title: "Track Progress",
    description: "Monitor your application status and receive notifications.",
    icon: Activity,
  },
  {
    num: "04",
    title: "Receive Decision",
    description: "Download your digitally signed certificate directly from the portal.",
    icon: FileCheck2,
  },
];

const WorkflowSection = () => {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A simple, transparent process to access government services from anywhere.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:flex relative items-start justify-between">
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-slate-200" aria-hidden="true" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center w-1/4 px-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white border-2 border-blue-700 text-blue-700 shadow-sm mb-6">
                  <Icon size={28} />
                </div>
                <div className="text-sm font-bold text-blue-700 mb-2">STEP {step.num}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex gap-6">
                {index < steps.length - 1 && (
                  <div className="absolute top-16 left-8 bottom-[-3rem] w-0.5 bg-slate-200" aria-hidden="true" />
                )}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white border-2 border-blue-700 text-blue-700 shadow-sm">
                  <Icon size={28} />
                </div>
                <div className="pt-2">
                  <div className="text-sm font-bold text-blue-700 mb-1">STEP {step.num}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;